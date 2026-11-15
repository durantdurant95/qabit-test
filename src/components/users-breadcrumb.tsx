"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSyncExternalStore } from "react";

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Skeleton } from "@/components/ui/skeleton";
import { useUsers } from "@/hooks/use-users";

const subscribe = () => () => {};

/** False during server render and hydration, true afterwards. */
function useIsClient() {
  return useSyncExternalStore(
    subscribe,
    () => true,
    () => false,
  );
}

export function UsersBreadcrumb() {
  const pathname = usePathname();
  const isClient = useIsClient();
  const userId = Number(pathname.match(/^\/users\/(\d+)/)?.[1]);
  // The full list is prefetched by the layout, so this reads from the cache.
  const { data: users } = useUsers();
  const user =
    isClient && userId ? users?.find(({ id }) => id === userId) : undefined;

  if (!userId) {
    return (
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbPage className="font-medium">People</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
    );
  }

  return (
    <Breadcrumb>
      <BreadcrumbList>
        <BreadcrumbItem className="hidden sm:inline-flex">
          <BreadcrumbLink asChild>
            <Link href="/users">People</Link>
          </BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator className="hidden sm:block" />
        <BreadcrumbItem>
          {user ? (
            <BreadcrumbPage className="font-medium">{user.name}</BreadcrumbPage>
          ) : (
            <Skeleton className="h-4 w-28" />
          )}
        </BreadcrumbItem>
      </BreadcrumbList>
    </Breadcrumb>
  );
}
