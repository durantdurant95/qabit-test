"use client";

import { AlertCircleIcon, SearchIcon } from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarInput,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSkeleton,
  SidebarRail,
} from "@/components/ui/sidebar";
import { useDebouncedValue } from "@/hooks/use-debounced-value";
import { useUsers } from "@/hooks/use-users";

/** Appends the search term so the filtered list survives navigation. */
function withSearch(href: string, q: string) {
  return q ? `${href}?${new URLSearchParams({ q })}` : href;
}

export function AppSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();
  const q = searchParams.get("q") ?? "";

  const [search, setSearch] = useState(q);
  const debouncedSearch = useDebouncedValue(search.trim(), 300);

  useEffect(() => {
    if (debouncedSearch === q) return;

    const params = new URLSearchParams(searchParams);
    if (debouncedSearch) {
      params.set("q", debouncedSearch);
    } else {
      params.delete("q");
    }
    const query = params.toString();
    router.replace(query ? `${pathname}?${query}` : pathname, {
      scroll: false,
    });
  }, [debouncedSearch, q, pathname, router, searchParams]);

  const { data: users, isPending, isError, isFetching, refetch } = useUsers(q);
  // Also show the skeleton while retrying after an error.
  const isLoading = isPending || (isError && isFetching);

  return (
    <Sidebar>
      <SidebarHeader>
        <Link
          href={withSearch("/users", q)}
          className="px-2 py-1 text-sm font-semibold"
        >
          Users &amp; Posts
        </Link>
        <form role="search" onSubmit={(event) => event.preventDefault()}>
          <label htmlFor="user-search" className="sr-only">
            Search users by name
          </label>
          <div className="relative">
            <SearchIcon
              className="pointer-events-none absolute top-1/2 left-2 size-4 -translate-y-1/2 text-muted-foreground"
              aria-hidden
            />
            <SidebarInput
              id="user-search"
              type="search"
              placeholder="Search by name..."
              autoComplete="off"
              className="pl-8"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
            />
          </div>
        </form>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Users</SidebarGroupLabel>
          <SidebarGroupContent>
            {isLoading ? (
              <UserMenuSkeleton />
            ) : isError ? (
              <Alert variant="destructive" role="alert">
                <AlertCircleIcon />
                <AlertTitle>Couldn&apos;t load users</AlertTitle>
                <AlertDescription>
                  <p>Check your connection and try again.</p>
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
            ) : users.length === 0 ? (
              <p
                role="status"
                className="px-2 py-4 text-sm text-muted-foreground"
              >
                No users match &ldquo;{q}&rdquo;.
              </p>
            ) : (
              <SidebarMenu>
                {users.map((user) => {
                  const href = `/users/${user.id}`;

                  return (
                    <SidebarMenuItem key={user.id}>
                      <SidebarMenuButton
                        asChild
                        isActive={
                          pathname === href || pathname.startsWith(`${href}/`)
                        }
                      >
                        <Link href={withSearch(href, q)}>{user.name}</Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  );
                })}
              </SidebarMenu>
            )}
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarRail />
    </Sidebar>
  );
}

/** Shown while the users list is prefetched on the server. */
export function AppSidebarSkeleton() {
  return (
    <Sidebar>
      <SidebarHeader>
        <span className="px-2 py-1 text-sm font-semibold">
          Users &amp; Posts
        </span>
        <SidebarInput
          type="search"
          placeholder="Search by name..."
          aria-label="Search users by name"
          disabled
        />
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Users</SidebarGroupLabel>
          <SidebarGroupContent>
            <UserMenuSkeleton />
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}

// Fixed widths keep the skeleton deterministic, so it can be prerendered.
const SKELETON_WIDTHS = [
  "72%",
  "58%",
  "84%",
  "64%",
  "76%",
  "52%",
  "68%",
  "80%",
];

function UserMenuSkeleton() {
  return (
    <SidebarMenu aria-busy="true" aria-label="Loading users">
      {SKELETON_WIDTHS.map((width, index) => (
        <SidebarMenuItem key={index}>
          <SidebarMenuSkeleton width={width} />
        </SidebarMenuItem>
      ))}
    </SidebarMenu>
  );
}
