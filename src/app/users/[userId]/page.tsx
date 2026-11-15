import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";
import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { UserPosts } from "@/components/posts/user-posts";
import { getPostsByUser, getUser } from "@/lib/api";
import { queryKeys } from "@/lib/query-keys";

function parseUserId(rawId: string) {
  const userId = Number(rawId);
  return Number.isInteger(userId) && userId > 0 ? userId : null;
}

export async function generateMetadata({
  params,
}: PageProps<"/users/[userId]">): Promise<Metadata> {
  const userId = parseUserId((await params).userId);
  // fetch is memoized per request, so this shares the page's request.
  const user = userId ? await getUser(userId).catch(() => null) : null;

  if (!user) {
    return { title: "User not found" };
  }

  return {
    title: user.name,
    description: `Posts by ${user.name} (@${user.username}).`,
  };
}

export default async function UserPage({
  params,
}: PageProps<"/users/[userId]">) {
  const userId = parseUserId((await params).userId);

  if (!userId) {
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
