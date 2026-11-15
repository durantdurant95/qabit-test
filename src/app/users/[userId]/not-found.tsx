import { UserXIcon } from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/ui/button";

export default function UserNotFound() {
  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-3 p-8 text-center">
      <div className="mb-2 flex size-14 items-center justify-center rounded-lg bg-muted text-muted-foreground">
        <UserXIcon className="size-6" aria-hidden />
      </div>
      <h1 className="text-2xl text-balance">User not found</h1>
      <p className="max-w-xs text-sm text-pretty text-muted-foreground">
        There&apos;s no one with that id. Pick someone from the list instead.
      </p>
      <Button asChild variant="outline" className="mt-2">
        <Link href="/users">Back to people</Link>
      </Button>
    </div>
  );
}
