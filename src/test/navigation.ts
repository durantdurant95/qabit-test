import { useSyncExternalStore } from "react";

/**
 * In-memory stand-in for `next/navigation`. Use it with
 * `jest.mock("next/navigation", () => jest.requireActual("@/test/navigation"))`.
 * `push` and `replace` update the URL and re-render the hooks that read it.
 */
let url = new URL("http://localhost/");
const listeners = new Set<() => void>();

function navigate(href: string) {
  url = new URL(href, url);
  listeners.forEach((listener) => listener());
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

const getHref = () => url.href;

export const mockRouter = {
  push: jest.fn(navigate),
  replace: jest.fn(navigate),
  prefetch: jest.fn(),
  refresh: jest.fn(),
  back: jest.fn(),
  forward: jest.fn(),
};

/** Sets the current URL before rendering, and clears the router mocks. */
export function setMockUrl(href: string) {
  url = new URL(href, "http://localhost/");
  Object.values(mockRouter).forEach((fn) => fn.mockClear());
}

export function useRouter() {
  return mockRouter;
}

export function usePathname() {
  const href = useSyncExternalStore(subscribe, getHref, getHref);
  return new URL(href).pathname;
}

export function useSearchParams() {
  const href = useSyncExternalStore(subscribe, getHref, getHref);
  return new URL(href).searchParams;
}

export function notFound(): never {
  throw new Error("NEXT_NOT_FOUND");
}
