"use client";

import { AlertCircleIcon, SearchIcon, SearchXIcon } from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Kbd } from "@/components/ui/kbd";
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
import { BrandMark, UserAvatar } from "@/components/user-avatar";
import { useDebouncedValue } from "@/hooks/use-debounced-value";
import { useUsers } from "@/hooks/use-users";

/** Appends the search term so the filtered list survives navigation. */
function withSearch(href: string, q: string) {
  return q ? `${href}?${new URLSearchParams({ q })}` : href;
}

function isEditable(target: EventTarget | null) {
  return (
    target instanceof HTMLElement &&
    (target.isContentEditable ||
      /^(INPUT|TEXTAREA|SELECT)$/.test(target.tagName))
  );
}

export function AppSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();
  const q = searchParams.get("q") ?? "";

  const searchRef = useRef<HTMLInputElement>(null);
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

  // Press "/" anywhere to jump to the search box.
  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if (event.key !== "/" || isEditable(event.target)) return;
      event.preventDefault();
      searchRef.current?.focus();
    }
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, []);

  const { data: users, isPending, isError, isFetching, refetch } = useUsers(q);
  // Also show the skeleton while retrying after an error.
  const isLoading = isPending || (isError && isFetching);

  return (
    <Sidebar variant="inset">
      <BrandHeader href={withSearch("/users", q)} />
      <SidebarContent>
        <SidebarGroup className="pb-0">
          <form role="search" onSubmit={(event) => event.preventDefault()}>
            <label htmlFor="user-search" className="sr-only">
              Search people by name
            </label>
            <div className="relative">
              <SearchIcon
                className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground"
                aria-hidden
              />
              <SidebarInput
                ref={searchRef}
                id="user-search"
                type="search"
                placeholder="Search by name"
                autoComplete="off"
                className="pr-10 pl-9 [&::-webkit-search-cancel-button]:hidden"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
              />
              <Kbd className="absolute top-1/2 right-2.5 hidden -translate-y-1/2 bg-sidebar md:inline-flex">
                /
              </Kbd>
            </div>
          </form>
        </SidebarGroup>
        <SidebarGroup>
          <SidebarGroupLabel>
            People
            {users && !isLoading && !isError && (
              <span className="ml-auto tabular-nums">{users.length}</span>
            )}
          </SidebarGroupLabel>
          <SidebarGroupContent>
            {isLoading ? (
              <UserMenuSkeleton />
            ) : isError ? (
              <Alert variant="destructive" role="alert">
                <AlertCircleIcon />
                <AlertTitle>Couldn&apos;t load people</AlertTitle>
                <AlertDescription>
                  <p>Check your connection, then try again.</p>
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
              <div
                role="status"
                className="flex flex-col items-center gap-2 rounded-md border border-dashed px-4 py-6 text-center"
              >
                <SearchXIcon
                  className="size-5 text-muted-foreground"
                  aria-hidden
                />
                <p className="text-sm text-muted-foreground">
                  No one matches &ldquo;{q}&rdquo;.
                </p>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => {
                    setSearch("");
                    searchRef.current?.focus();
                  }}
                >
                  Clear search
                </Button>
              </div>
            ) : (
              <SidebarMenu>
                {users.map((user) => {
                  const href = `/users/${user.id}`;

                  return (
                    <SidebarMenuItem key={user.id}>
                      <SidebarMenuButton
                        asChild
                        size="lg"
                        isActive={
                          pathname === href || pathname.startsWith(`${href}/`)
                        }
                        className="h-12 gap-3 px-2 data-active:bg-sidebar-primary data-active:font-normal data-active:text-sidebar-primary-foreground data-active:hover:bg-sidebar-primary data-active:hover:text-sidebar-primary-foreground"
                      >
                        <Link href={withSearch(href, q)}>
                          <UserAvatar id={user.id} name={user.name} />
                          <span className="grid min-w-0 flex-1 leading-tight">
                            <span className="truncate font-medium">
                              {user.name}
                            </span>
                            <span className="truncate text-xs text-muted-foreground group-data-[active=true]/menu-button:text-sidebar-primary-foreground/75">
                              @{user.username}
                            </span>
                          </span>
                        </Link>
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

/** Same height as the top bar, so both rows line up. */
function BrandHeader({ href }: { href?: string }) {
  const content = (
    <>
      <BrandMark />
      <span className="grid flex-1 text-left leading-tight">
        <span className="truncate text-sm font-semibold tracking-tight">
          Users &amp; Posts
        </span>
        <span className="truncate text-xs text-muted-foreground">
          Read and write posts
        </span>
      </span>
    </>
  );

  return (
    <SidebarHeader>
      <SidebarMenu>
        <SidebarMenuItem>
          {href ? (
            <SidebarMenuButton
              asChild
              size="lg"
              className="h-12 px-2 hover:bg-transparent active:bg-transparent"
            >
              <Link href={href}>{content}</Link>
            </SidebarMenuButton>
          ) : (
            <div className="flex h-12 items-center gap-2 px-2">{content}</div>
          )}
        </SidebarMenuItem>
      </SidebarMenu>
    </SidebarHeader>
  );
}

/** Shown while the users list is prefetched on the server. */
export function AppSidebarSkeleton() {
  return (
    <Sidebar variant="inset">
      <BrandHeader />
      <SidebarContent>
        <SidebarGroup className="pb-0">
          <SidebarInput
            type="search"
            placeholder="Search by name"
            aria-label="Search people by name"
            disabled
          />
        </SidebarGroup>
        <SidebarGroup>
          <SidebarGroupLabel>People</SidebarGroupLabel>
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
    <SidebarMenu aria-busy="true" aria-label="Loading people">
      {SKELETON_WIDTHS.map((width, index) => (
        <SidebarMenuItem key={index}>
          <SidebarMenuSkeleton
            showIcon
            width={width}
            className="h-12 gap-3 px-2 [&_[data-sidebar=menu-skeleton-icon]]:size-8 [&_[data-sidebar=menu-skeleton-icon]]:rounded-full"
          />
        </SidebarMenuItem>
      ))}
    </SidebarMenu>
  );
}
