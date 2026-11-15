import { FileTextIcon } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { Post } from "@/lib/types";

export function PostList({ posts }: { posts: Post[] }) {
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
