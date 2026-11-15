import { render, screen } from "@testing-library/react";
import { http, HttpResponse } from "msw";

import UsersPage from "@/app/users/page";
import { server } from "@/test/msw/server";

describe("smoke", () => {
  it("renders the users empty state", () => {
    render(<UsersPage />);

    expect(
      screen.getByRole("heading", { name: "Select a user" }),
    ).toBeInTheDocument();
  });

  it("intercepts fetch with MSW", async () => {
    server.use(
      http.get("https://example.test/ping", () =>
        HttpResponse.json({ ok: true }),
      ),
    );

    const response = await fetch("https://example.test/ping");

    await expect(response.json()).resolves.toEqual({ ok: true });
  });
});
