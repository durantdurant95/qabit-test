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
import { Skeleton } from "@/components/ui/skeleton";
import { UsersBreadcrumb } from "@/components/users-breadcrumb";
import { getUsers } from "@/lib/api";
import { queryKeys } from "@/lib/query-keys";

export default function UsersLayout({ children }: LayoutProps<"/users">) {
  return (
    <SidebarProvider>
      <Suspense fallback={<AppSidebarSkeleton />}>
        <PrefetchedSidebar />
      </Suspense>
      <SidebarInset>
        <header className="sticky top-0 z-10 flex h-16 shrink-0 items-center gap-2 border-b bg-background/80 px-4 backdrop-blur-md md:rounded-t-xl">
          <SidebarTrigger className="-ml-1" />
          <Separator
            orientation="vertical"
            className="mr-2 data-vertical:h-4 data-vertical:self-auto"
          />
          <Suspense fallback={<Skeleton className="h-4 w-24" />}>
            <UsersBreadcrumb />
          </Suspense>
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
