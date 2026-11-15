import { FileTextIcon } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardAction,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import type { CreatedPost, Post } from "@/lib/types";

/** Created posts carry a client-generated string id. */
function isCreated(post: Post | CreatedPost): post is CreatedPost {
  return typeof post.id === "string";
}

export function PostList({ posts }: { posts: Array<Post | CreatedPost> }) {
  if (posts.length === 0) {
    return (
      <div
        role="status"
        className="flex flex-col items-center gap-2 rounded-lg border border-dashed px-4 py-10 text-center"
      >
        <FileTextIcon className="size-5 text-muted-foreground" aria-hidden />
        <p className="text-sm text-muted-foreground">No posts yet.</p>
      </div>
    );
  }

  return (
    <ul aria-label="Posts" className="flex flex-col gap-3">
      {posts.map((post) => (
        <li key={post.id}>
          <Card size="sm">
            <CardHeader>
              <CardTitle className="text-base first-letter:uppercase">
                {post.title}
              </CardTitle>
              {isCreated(post) && (
                <CardAction>
                  <Badge>New</Badge>
                </CardAction>
              )}
            </CardHeader>
            <CardContent>
              <p className="text-sm whitespace-pre-line text-muted-foreground first-letter:uppercase">
                {post.body}
              </p>
            </CardContent>
          </Card>
        </li>
      ))}
    </ul>
  );
}
