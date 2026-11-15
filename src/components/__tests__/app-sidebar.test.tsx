import { screen, waitFor } from "@testing-library/react";

import { AppSidebar } from "@/components/app-sidebar";
import { mockRouter, setMockUrl } from "@/test/navigation";
import { renderWithProviders } from "@/test/render";

jest.mock("next/navigation", () => jest.requireActual("@/test/navigation"));

function renderSidebar() {
  return renderWithProviders(<AppSidebar />, { withSidebar: true });
}

/** The user links, each named like "LG Leanne Graham @Bret". */
const people = () => screen.queryAllByRole("link", { name: /@/ });

describe("AppSidebar search", () => {
  beforeEach(() => setMockUrl("/users"));

  it("lists every user by default", async () => {
    renderSidebar();

    expect(
      await screen.findByRole("link", { name: /Leanne Graham/ }),
    ).toBeInTheDocument();
    expect(people()).toHaveLength(3);
  });

  it("filters the list as the user types and keeps the term in the URL", async () => {
    const { user } = renderSidebar();
    await screen.findByRole("link", { name: /Leanne Graham/ });

    await user.type(
      screen.getByRole("searchbox", { name: "Search people by name" }),
      "ervin",
    );

    await waitFor(() => expect(people()).toHaveLength(1));
    expect(people()[0]).toHaveAccessibleName(/Ervin Howell/);
    expect(mockRouter.replace).toHaveBeenCalledWith("/users?q=ervin", {
      scroll: false,
    });
    // Links keep the search, so the filtered list survives navigation.
    expect(screen.getByRole("link", { name: /Ervin Howell/ })).toHaveAttribute(
      "href",
      "/users/2?q=ervin",
    );
  });

  it("shows an empty state when nothing matches, and clearing restores the list", async () => {
    const { user } = renderSidebar();
    await screen.findByRole("link", { name: /Leanne Graham/ });

    await user.type(
      screen.getByRole("searchbox", { name: "Search people by name" }),
      "nobody",
    );

    expect(await screen.findByText(/No one matches/)).toHaveTextContent(
      "No one matches “nobody”.",
    );

    await user.click(screen.getByRole("button", { name: "Clear search" }));

    expect(
      await screen.findByRole("link", { name: /Leanne Graham/ }),
    ).toBeInTheDocument();
    expect(screen.getByRole("searchbox")).toHaveValue("");
  });

  it("treats regex characters in the term literally", async () => {
    const { user } = renderSidebar();
    await screen.findByRole("link", { name: /Leanne Graham/ });

    await user.type(screen.getByRole("searchbox"), ".*");

    expect(await screen.findByText(/No one matches/)).toBeInTheDocument();
  });

  it("marks the selected user as active", async () => {
    setMockUrl("/users/2");
    renderSidebar();

    expect(
      await screen.findByRole("link", { name: /Ervin Howell/ }),
    ).toHaveAttribute("data-active", "true");
    expect(screen.getByRole("link", { name: /Leanne Graham/ })).toHaveAttribute(
      "data-active",
      "false",
    );
  });
});
