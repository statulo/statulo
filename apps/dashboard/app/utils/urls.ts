import type { LocationQuery } from "vue-router";

// Ensure a root relative path can't start with a //
const rootRelativeRegex = /^\/[^/]/;

export function getNextPage(query: LocationQuery): string {
  const nextPage = query.next?.toString();
  // Next page must be a root relative path, if not, next page is /
  if (nextPage && !rootRelativeRegex.test(nextPage)) return "/";
  return nextPage ?? "/";
}
