import type { RequestHandler } from "msw";

// Default handlers shared by every test. Tests can override them with server.use().
export const handlers: RequestHandler[] = [];
