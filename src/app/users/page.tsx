import { MousePointerClickIcon } from "lucide-react";

import { Kbd } from "@/components/ui/kbd";

export default function UsersPage() {
  return (
    <div className="relative flex flex-1 flex-col items-center justify-center overflow-hidden p-8 text-center">
      <div
        aria-hidden
        className="pointer-events-none absolute top-1/2 left-1/2 size-80 -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/10 blur-3xl"
      />
      <div className="relative flex flex-col items-center gap-3">
        <div className="mb-2 flex size-14 items-center justify-center rounded-lg bg-primary text-primary-foreground shadow-lg shadow-primary/20">
          <MousePointerClickIcon className="size-6" aria-hidden />
        </div>
        <h2 className="text-2xl text-balance">Select a user</h2>
        <p className="max-w-xs text-sm text-pretty text-muted-foreground">
          Choose someone from the list to read their posts and write a new one.
        </p>
        <p className="mt-2 hidden items-center gap-1.5 text-xs text-muted-foreground md:flex">
          Press <Kbd>/</Kbd> to search by name
        </p>
      </div>
    </div>
  );
}
