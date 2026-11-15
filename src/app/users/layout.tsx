import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";
import { Suspense } from "react";

import { AppSidebar, AppSidebarSkeleton } from "@/components/app-sidebar";
import { Separator } from "@/components/ui/separator";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { getUsers } from "@/lib/api";
import { queryKeys } from "@/lib/query-keys";

export default function UsersLayout({ children }: LayoutProps<"/users">) {
  return (
    <SidebarProvider>
      <Suspense fallback={<AppSidebarSkeleton />}>
        <PrefetchedSidebar />
      </Suspense>
      <SidebarInset>
        <header className="flex h-14 shrink-0 items-center gap-2 border-b px-4">
          <SidebarTrigger className="-ml-1" />
          <Separator
            orientation="vertical"
            className="mr-2 data-[orientation=vertical]:h-4"
          />
          <h1 className="text-sm font-medium">Users</h1>
        </header>
        {children}
      </SidebarInset>
    </SidebarProvider>
  );
}

async function PrefetchedSidebar() {
  // A new client per request, so cached data is never shared between users.
  const queryClient = new QueryClient();

  await queryClient.prefetchQuery({
    queryKey: queryKeys.users.list(),
    queryFn: () => getUsers(),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <AppSidebar />
    </HydrationBoundary>
  );
}
