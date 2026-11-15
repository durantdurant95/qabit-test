import { screen, waitFor, within } from "@testing-library/react";
import type { UserEvent } from "@testing-library/user-event";
import { http, HttpResponse } from "msw";

import { UserPosts } from "@/components/posts/user-posts";
import { apiUrl } from "@/test/msw/handlers";
import { server } from "@/test/msw/server";
import { renderWithProviders } from "@/test/render";

/** Counts POST /posts requests that reach the network. */
function trackCreateRequests() {
  const requests: Request[] = [];
  const listener = ({ request }: { request: Request }) => {
    if (request.method === "POST" && request.url === apiUrl("/posts")) {
      requests.push(request.clone());
    }
  };

  server.events.on("request:start", listener);
  return {
    requests,
    stop: () => server.events.removeListener("request:start", listener),
  };
}

async function openForm(user: UserEvent) {
  await user.click(await screen.findByRole("button", { name: "New post" }));
  return screen.findByRole("dialog", { name: "Write a post" });
}

async function publish(user: UserEvent, title: string, body: string) {
  const dialog = await openForm(user);

  await user.type(within(dialog).getByLabelText("Title"), title);
  await user.type(within(dialog).getByLabelText("Body"), body);
  await user.click(
    within(dialog).getByRole("button", { name: "Publish post" }),
  );

  await waitFor(() =>
    expect(
      screen.queryByRole("dialog", { name: "Write a post" }),
    ).not.toBeInTheDocument(),
  );
}

const postTitles = () =>
  within(screen.getByRole("list", { name: "Posts" }))
    .getAllByRole("listitem")
    .map((item) => item.querySelector("[data-slot=card-title]")?.textContent);

describe("UserPosts", () => {
  let tracker: ReturnType<typeof trackCreateRequests>;

  beforeEach(() => {
    tracker = trackCreateRequests();
  });
  afterEach(() => tracker.stop());

  it("shows the user's posts", async () => {
    renderWithProviders(<UserPosts userId={1} />);

    expect(
      await screen.findByRole("heading", { name: "Leanne Graham" }),
    ).toBeInTheDocument();
    expect(await screen.findByRole("list", { name: "Posts" })).toBeVisible();
    expect(postTitles()).toEqual([
      "First post by Leanne",
      "Second post by Leanne",
    ]);
  });

  it("blocks an empty submit with both required errors and sends no request", async () => {
    const { user } = renderWithProviders(<UserPosts userId={1} />);
    const dialog = await openForm(user);

    await user.click(
      within(dialog).getByRole("button", { name: "Publish post" }),
    );

    expect(await within(dialog).findByText("Title is required")).toBeVisible();
    expect(within(dialog).getByText("Body is required")).toBeVisible();
    expect(within(dialog).getByLabelText("Title")).toHaveAttribute(
      "aria-invalid",
      "true",
    );
    expect(within(dialog).getByLabelText("Body")).toHaveAccessibleDescription(
      "Body is required",
    );
    expect(tracker.requests).toHaveLength(0);
  });

  it("treats whitespace-only values as empty", async () => {
    const { user } = renderWithProviders(<UserPosts userId={1} />);
    const dialog = await openForm(user);

    await user.type(within(dialog).getByLabelText("Title"), "   ");
    await user.type(within(dialog).getByLabelText("Body"), "   ");
    await user.click(
      within(dialog).getByRole("button", { name: "Publish post" }),
    );

    expect(await within(dialog).findByText("Title is required")).toBeVisible();
    expect(within(dialog).getByText("Body is required")).toBeVisible();
    expect(tracker.requests).toHaveLength(0);
  });

  it("clears a field's error as soon as it becomes valid", async () => {
    const { user } = renderWithProviders(<UserPosts userId={1} />);
    const dialog = await openForm(user);

    await user.click(
      within(dialog).getByRole("button", { name: "Publish post" }),
    );
    await within(dialog).findByText("Title is required");

    await user.type(within(dialog).getByLabelText("Title"), "Hi");

    expect(within(dialog).queryByText("Title is required")).toBeNull();
    expect(within(dialog).getByText("Body is required")).toBeVisible();
  });

  it("adds a valid post to the top of the list with the trimmed values", async () => {
    const { user } = renderWithProviders(<UserPosts userId={1} />);
    await screen.findByRole("list", { name: "Posts" });

    await publish(user, "  A brand new post  ", "  With a body.  ");

    expect(postTitles()[0]).toBe("A brand new post");
    expect(tracker.requests).toHaveLength(1);
    await expect(tracker.requests[0].json()).resolves.toEqual({
      userId: 1,
      title: "A brand new post",
      body: "With a body.",
    });
  });

  it("keeps both posts after two submits, although the API returns the same id", async () => {
    // React reports duplicate keys through console.error.
    const consoleError = jest.spyOn(console, "error");
    const { user } = renderWithProviders(<UserPosts userId={1} />);
    await screen.findByRole("list", { name: "Posts" });

    await publish(user, "Post one", "Body one");
    await publish(user, "Post two", "Body two");

    expect(postTitles()).toEqual([
      "Post two",
      "Post one",
      "First post by Leanne",
      "Second post by Leanne",
    ]);
    expect(
      within(screen.getByRole("list", { name: "Posts" })).getAllByText("New"),
    ).toHaveLength(2);
    expect(
      consoleError.mock.calls.some(([message]) =>
        String(message).includes("same key"),
      ),
    ).toBe(false);
    consoleError.mockRestore();
  });

  it("keeps created posts when the fetched posts are refetched", async () => {
    const { user, queryClient } = renderWithProviders(<UserPosts userId={1} />);
    await screen.findByRole("list", { name: "Posts" });

    await publish(user, "Survives refetch", "Body");
    await queryClient.refetchQueries({ queryKey: ["posts", 1] });

    expect(postTitles()).toContain("Survives refetch");
  });

  it("starts with an empty form after a post is published", async () => {
    const { user } = renderWithProviders(<UserPosts userId={1} />);
    await screen.findByRole("list", { name: "Posts" });

    await publish(user, "Post one", "Body one");
    const dialog = await openForm(user);

    expect(within(dialog).getByLabelText("Title")).toHaveValue("");
    expect(within(dialog).getByLabelText("Body")).toHaveValue("");
  });

  it("keeps the values and shows an error when the create fails", async () => {
    server.use(
      http.post(apiUrl("/posts"), () => HttpResponse.json({}, { status: 500 })),
    );
    const { user } = renderWithProviders(<UserPosts userId={1} />);
    const dialog = await openForm(user);

    await user.type(within(dialog).getByLabelText("Title"), "Will fail");
    await user.type(within(dialog).getByLabelText("Body"), "Body");
    await user.click(
      within(dialog).getByRole("button", { name: "Publish post" }),
    );

    expect(await within(dialog).findByRole("alert")).toHaveTextContent(
      "Couldn't publish the post",
    );
    expect(within(dialog).getByLabelText("Title")).toHaveValue("Will fail");
    // The list sits behind the dialog, so check the text isn't rendered at all.
    expect(screen.queryByText("Will fail")).not.toBeInTheDocument();
  });
});
