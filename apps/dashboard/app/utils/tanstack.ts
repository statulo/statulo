import type { QueryClient } from "@tanstack/vue-query";

type InvalidateFilters = Parameters<QueryClient["invalidateQueries"]>[0];
type InvalidateOptions = Parameters<QueryClient["invalidateQueries"]>[1];

export function invalidateQueries(
  queryKey: string | string[],
  filters?: InvalidateFilters,
  options?: InvalidateOptions,
) {
  return getQueryClient().invalidateQueries(
    {
      ...filters,
      queryKey: Array.isArray(queryKey) ? queryKey : [queryKey],
    },
    options,
  );
}
