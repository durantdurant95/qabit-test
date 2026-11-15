export { cn } from "cn";

/**
 * Escapes characters that have a special meaning in a regular expression.
 * json-server treats `_like` filters as a RegExp, so user input must be escaped.
 */
export function escapeRegex(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}
