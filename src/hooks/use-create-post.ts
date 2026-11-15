import {
  skipToken,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { toast } from "sonner";

import { createPost } from "@/lib/api";
import { queryKeys } from "@/lib/query-keys";
import type { NewPostValues } from "@/lib/schemas";
import type { CreatedPost } from "@/lib/types";

const NO_POSTS: CreatedPost[] = [];

/**
 * Posts created in this session, newest first. They live under their own
 * client-only key, so refetching or rehydrating `['posts', userId]` can't
 * overwrite them.
 */
export function useCreatedPosts(userId: number): CreatedPost[] {
  const { data } = useQuery<CreatedPost[]>({
    queryKey: queryKeys.createdPosts.byUser(userId),
    // Never fetched: only written with setQueryData.
    queryFn: skipToken,
    staleTime: Infinity,
    // Keep them after navigating away from the user.
    gcTime: Infinity,
  });

  return data ?? NO_POSTS;
}

export function useCreatePost(userId: number) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (values: NewPostValues) => createPost({ ...values, userId }),
    onSuccess: (post) => {
      const created: CreatedPost = { ...post, id: crypto.randomUUID() };

      queryClient.setQueryData<CreatedPost[]>(
        queryKeys.createdPosts.byUser(userId),
        (previous = []) => [created, ...previous],
      );
      toast.success("Post published", { description: created.title });
    },
  });
}
