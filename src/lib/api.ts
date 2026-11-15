import type { NewPost, Post, User } from "./types";
import { escapeRegex } from "./utils";

export const API_URL = "https://jsonplaceholder.typicode.com";

export class ApiError extends Error {
  constructor(
    readonly status: number,
    message: string,
  ) {
    super(message);
    this.name = "ApiError";
  }
}

type RequestOptions = { signal?: AbortSignal };

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(`${API_URL}${path}`, init);

  if (!response.ok) {
    throw new ApiError(
      response.status,
      `Request to ${path} failed with status ${response.status}`,
    );
  }

  return response.json() as Promise<T>;
}

/** Lists users, optionally filtered by name (case-insensitive, server-side). */
export function getUsers(q?: string, { signal }: RequestOptions = {}) {
  const params = new URLSearchParams();
  const term = q?.trim();

  if (term) {
    params.set("name_like", escapeRegex(term));
  }

  const query = params.size > 0 ? `?${params}` : "";

  return request<User[]>(`/users${query}`, { signal });
}

/** Returns the user, or null when it doesn't exist. */
export async function getUser(
  id: number,
  { signal }: RequestOptions = {},
): Promise<User | null> {
  try {
    return await request<User>(`/users/${id}`, { signal });
  } catch (error) {
    if (error instanceof ApiError && error.status === 404) {
      return null;
    }
    throw error;
  }
}

export function getPostsByUser(
  userId: number,
  { signal }: RequestOptions = {},
) {
  return request<Post[]>(`/users/${userId}/posts`, { signal });
}

export function createPost(post: NewPost) {
  return request<Post>("/posts", {
    method: "POST",
    headers: { "Content-Type": "application/json; charset=UTF-8" },
    body: JSON.stringify(post),
  });
}
