import { useQuery } from "@tanstack/react-query";

import { getPostsByUser } from "@/lib/api";
import { queryKeys } from "@/lib/query-keys";

/** Posts fetched from the API for one user. */
export function usePosts(userId: number) {
  return useQuery({
    queryKey: queryKeys.posts.byUser(userId),
    queryFn: ({ signal }) => getPostsByUser(userId, { signal }),
  });
}
