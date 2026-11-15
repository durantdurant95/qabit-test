import { http, HttpResponse, type RequestHandler } from "msw";

import { API_URL } from "@/lib/api";
import type { NewPost, Post } from "@/lib/types";
import { posts, users } from "@/test/fixtures";

/** Builds a URL on the mocked API, e.g. `apiUrl("/users")`. */
export const apiUrl = (path: string) => `${API_URL}${path}`;

// Default handlers shared by every test. Tests can override them with server.use().
export const handlers: RequestHandler[] = [
  http.get(apiUrl("/users"), ({ request }) => {
    // Mirrors json-server: `name_like` is a case-insensitive RegExp.
    const nameLike = new URL(request.url).searchParams.get("name_like");
    const pattern = nameLike ? new RegExp(nameLike, "i") : null;

    return HttpResponse.json(
      pattern ? users.filter((user) => pattern.test(user.name)) : users,
    );
  }),

  http.get(apiUrl("/users/:userId"), ({ params }) => {
    const user = users.find((user) => user.id === Number(params.userId));

    return user
      ? HttpResponse.json(user)
      : HttpResponse.json({}, { status: 404 });
  }),

  http.get(apiUrl("/users/:userId/posts"), ({ params }) =>
    HttpResponse.json(
      posts.filter((post) => post.userId === Number(params.userId)),
    ),
  ),

  // Like the real API, every created post comes back with id 101.
  http.post(apiUrl("/posts"), async ({ request }) => {
    const body = (await request.json()) as NewPost;

    return HttpResponse.json<Post>({ ...body, id: 101 }, { status: 201 });
  }),
];
