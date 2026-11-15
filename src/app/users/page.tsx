import { UsersIcon } from "lucide-react";

export default function UsersPage() {
  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-2 p-8 text-center">
      <UsersIcon className="size-8 text-muted-foreground" aria-hidden />
      <h2 className="text-lg font-semibold">Select a user</h2>
      <p className="text-sm text-muted-foreground">
        Pick someone from the sidebar to see their posts.
      </p>
    </div>
  );
}
