import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { http, HttpResponse } from "msw";

import UserError from "@/app/users/[userId]/error";
import UsersError from "@/app/users/error";
import { AppSidebar } from "@/components/app-sidebar";
import { UserPosts } from "@/components/posts/user-posts";
import { apiUrl } from "@/test/msw/handlers";
import { server } from "@/test/msw/server";
import { setMockUrl } from "@/test/navigation";
import { renderWithProviders } from "@/test/render";

jest.mock("next/navigation", () => jest.requireActual("@/test/navigation"));

/** Fails the next request to `path` with a 500, then lets it through. */
function failOnce(path: string) {
  server.use(
    http.get(apiUrl(path), () => HttpResponse.json({}, { status: 500 }), {
      once: true,
    }),
  );
}

describe("error states", () => {
  it("shows an alert when the posts fail to load, and retry recovers", async () => {
    failOnce("/users/1/posts");
    const { user } = renderWithProviders(<UserPosts userId={1} />);

    const alert = await screen.findByRole("alert");
    expect(alert).toHaveTextContent("Couldn't load posts");
    expect(
      screen.queryByRole("list", { name: "Posts" }),
    ).not.toBeInTheDocument();

    await user.click(within(alert).getByRole("button", { name: "Retry" }));

    expect(
      await screen.findByRole("list", { name: "Posts" }),
    ).toBeInTheDocument();
    expect(screen.getByText("First post by Leanne")).toBeInTheDocument();
    expect(screen.queryByRole("alert")).not.toBeInTheDocument();
  });

  it("shows an alert when the users fail to load, and retry recovers", async () => {
    setMockUrl("/users");
    failOnce("/users");
    const { user } = renderWithProviders(<AppSidebar />, {
      withSidebar: true,
    });

    const alert = await screen.findByRole("alert");
    expect(alert).toHaveTextContent("Couldn't load people");

    await user.click(within(alert).getByRole("button", { name: "Retry" }));

    expect(
      await screen.findByRole("link", { name: /Leanne Graham/ }),
    ).toBeInTheDocument();
    expect(screen.queryByRole("alert")).not.toBeInTheDocument();
  });

  it.each([
    ["users", UsersError, "Something went wrong"],
    ["user posts", UserError, "Couldn't load this user's posts"],
  ])(
    "the %s error boundary retries on click",
    async (_, ErrorBoundary, title) => {
      const consoleError = jest
        .spyOn(console, "error")
        .mockImplementation(() => {});
      const retry = jest.fn();
      const error = new Error("boom");
      render(<ErrorBoundary error={error} retry={retry} />);

      expect(screen.getByRole("alert")).toHaveTextContent(title);
      await userEvent.click(screen.getByRole("button", { name: "Try again" }));

      expect(retry).toHaveBeenCalledTimes(1);
      expect(consoleError).toHaveBeenCalledWith(error);
      consoleError.mockRestore();
    },
  );
});
