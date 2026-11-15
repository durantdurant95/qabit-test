import { render, screen } from "@testing-library/react";
import { http, HttpResponse } from "msw";

import Home from "@/app/page";
import { server } from "@/test/msw/server";

describe("smoke", () => {
  it("renders the home page heading", () => {
    render(<Home />);

    expect(
      screen.getByRole("heading", { name: "Users & Posts" }),
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
