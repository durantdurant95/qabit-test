"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSkeleton,
  SidebarRail,
} from "@/components/ui/sidebar";
import { useUsers } from "@/hooks/use-users";

export function AppSidebar() {
  const pathname = usePathname();
  const { data: users = [] } = useUsers();

  return (
    <Sidebar>
      <SidebarHeader>
        <Link href="/users" className="px-2 py-1 text-sm font-semibold">
          Users &amp; Posts
        </Link>
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
                      <Link href={href}>{user.name}</Link>
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
