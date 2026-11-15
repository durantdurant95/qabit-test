export const queryKeys = {
  users: {
    all: ["users"] as const,
    list: (q = "") =>
      [...queryKeys.users.all, "list", { q: q.trim() }] as const,
    detail: (id: number) => [...queryKeys.users.all, "detail", id] as const,
  },
  posts: {
    byUser: (userId: number) => ["posts", userId] as const,
  },
  createdPosts: {
    byUser: (userId: number) => ["created-posts", userId] as const,
  },
};
