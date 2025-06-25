import type { LocationQuery } from "vue-router";

// Ensure a root relative path can't start with a //
const rootRelativeRegex = /^\/[^/]/;

export function getNextPage(query: LocationQuery): string {
  const nextPage = query.next?.toString();
  // Next page must be a root relative path, if not, next page is /
  if (nextPage && !rootRelativeRegex.test(nextPage)) return "/";
  return nextPage ?? "/";
}

// TODO these are all temporary
export const urls = {
  feedback: "#",
  termsOfService: "#",
  privacyPolicy: "#",
  contact: "#",
  documentation: "#",
  help: "#",
  home: "/login",
} as const;
