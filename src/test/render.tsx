import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { render, type RenderOptions } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import type { ReactElement, ReactNode } from "react";

import { SidebarProvider } from "@/components/ui/sidebar";
import { TooltipProvider } from "@/components/ui/tooltip";

/** A client per test, without retries, so failures show up right away. */
export function createTestQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false },
    },
  });
}

type Options = Omit<RenderOptions, "wrapper"> & {
  queryClient?: QueryClient;
  /** Wraps the UI in SidebarProvider, needed by the shadcn sidebar parts. */
  withSidebar?: boolean;
};

/** Renders with the app's providers and returns a user-event instance. */
export function renderWithProviders(
  ui: ReactElement,
  {
    queryClient = createTestQueryClient(),
    withSidebar = false,
    ...options
  }: Options = {},
) {
  function Wrapper({ children }: { children: ReactNode }) {
    const content = withSidebar ? (
      <SidebarProvider>{children}</SidebarProvider>
    ) : (
      children
    );

    return (
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>{content}</TooltipProvider>
      </QueryClientProvider>
    );
  }

  return {
    user: userEvent.setup(),
    queryClient,
    ...render(ui, { wrapper: Wrapper, ...options }),
  };
}
