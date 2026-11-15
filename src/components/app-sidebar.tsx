"use client";

import { SearchIcon } from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

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

  const { data: users = [] } = useUsers(q);

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
