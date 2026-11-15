import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";
import { notFound } from "next/navigation";

import { UserPosts } from "@/components/posts/user-posts";
import { getPostsByUser, getUser } from "@/lib/api";
import { queryKeys } from "@/lib/query-keys";

export default async function UserPage({
  params,
}: PageProps<"/users/[userId]">) {
  const { userId: rawId } = await params;
  const userId = Number(rawId);

  if (!Number.isInteger(userId) || userId <= 0) {
    notFound();
  }

  // A new client per request, so cached data is never shared between users.
  const queryClient = new QueryClient();

  // fetchQuery throws on failure, so a failed request reaches error.tsx.
  const [user] = await Promise.all([
    queryClient.fetchQuery({
      queryKey: queryKeys.users.detail(userId),
      queryFn: () => getUser(userId),
    }),
    queryClient.fetchQuery({
      queryKey: queryKeys.posts.byUser(userId),
      queryFn: () => getPostsByUser(userId),
    }),
  ]);

  if (!user) {
    notFound();
  }

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <UserPosts userId={userId} />
    </HydrationBoundary>
  );
}
