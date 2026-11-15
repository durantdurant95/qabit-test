"use client";

import { AlertCircleIcon } from "lucide-react";

import { NewPostForm } from "@/components/posts/new-post-form";
import { PostList } from "@/components/posts/post-list";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { UserAvatar } from "@/components/user-avatar";
import { useCreatedPosts, useCreatePost } from "@/hooks/use-create-post";
import { usePosts } from "@/hooks/use-posts";
import { useUser } from "@/hooks/use-users";
import type { User } from "@/lib/types";

export function UserPosts({ userId }: { userId: number }) {
  // Both queries are prefetched on the server, so they start with data.
  const { data: user } = useUser(userId);
  const {
    data: posts,
    isPending,
    isError,
    isFetching,
    refetch,
  } = usePosts(userId);
  const createdPosts = useCreatedPosts(userId);
  const createPost = useCreatePost(userId);
  const isLoading = isPending || (isError && isFetching);
  const allPosts = posts ? [...createdPosts, ...posts] : createdPosts;

  return (
    <div className="mx-auto flex w-full max-w-3xl flex-col gap-8 p-4 md:p-8">
      {user ? <UserHeader user={user} /> : <UserHeaderSkeleton />}

      <Card>
        <CardHeader>
          <CardTitle>
            <h2 className="text-base">Write a post</h2>
          </CardTitle>
          <CardDescription>
            It shows up at the top of the list once it&apos;s published.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <NewPostForm
            onSubmit={createPost.mutateAsync}
            error={createPost.error}
          />
        </CardContent>
      </Card>

      <section aria-labelledby="posts-heading" className="flex flex-col gap-4">
        <div className="flex items-center gap-2">
          <h2 id="posts-heading" className="text-lg">
            Posts
          </h2>
          {posts && !isLoading && (
            <Badge variant="secondary" className="tabular-nums">
              {allPosts.length}
            </Badge>
          )}
        </div>

        {isLoading ? (
          <PostListSkeleton />
        ) : isError ? (
          <Alert variant="destructive" role="alert">
            <AlertCircleIcon />
            <AlertTitle>Couldn&apos;t load posts</AlertTitle>
            <AlertDescription>
              <p>Check your connection, then try again.</p>
              <Button
                size="sm"
                variant="outline"
                className="mt-2"
                onClick={() => refetch()}
              >
                Retry
              </Button>
            </AlertDescription>
          </Alert>
        ) : (
          <PostList posts={allPosts} />
        )}
      </section>
    </div>
  );
}

function UserHeader({ user }: { user: User }) {
  return (
    <header className="flex items-center gap-4">
      <UserAvatar
        id={user.id}
        name={user.name}
        size="lg"
        className="size-14 [&_[data-slot=avatar-fallback]]:text-base"
      />
      <div className="grid min-w-0 gap-0.5">
        <h1 className="truncate text-2xl">{user.name}</h1>
        <p className="truncate text-sm text-muted-foreground">
          @{user.username} · {user.email}
        </p>
      </div>
    </header>
  );
}

/** Shown while navigating to a user, before the server prefetch resolves. */
export function UserPostsSkeleton() {
  return (
    <div className="mx-auto flex w-full max-w-3xl flex-col gap-8 p-4 md:p-8">
      <UserHeaderSkeleton />
      <Skeleton className="h-64 w-full rounded-xl" />
      <div className="flex flex-col gap-4">
        <Skeleton className="h-6 w-24" />
        <PostListSkeleton />
      </div>
    </div>
  );
}

function UserHeaderSkeleton() {
  return (
    <div className="flex items-center gap-4">
      <Skeleton className="size-14 rounded-full" />
      <div className="grid gap-2">
        <Skeleton className="h-7 w-48" />
        <Skeleton className="h-4 w-64" />
      </div>
    </div>
  );
}

function PostListSkeleton() {
  return (
    <ul
      aria-busy="true"
      aria-label="Loading posts"
      className="flex flex-col gap-3"
    >
      {[0, 1, 2, 3].map((index) => (
        <li
          key={index}
          className="flex flex-col gap-3 rounded-xl p-4 ring-1 ring-foreground/10"
        >
          <Skeleton className="h-5 w-2/3" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-5/6" />
        </li>
      ))}
    </ul>
  );
}
