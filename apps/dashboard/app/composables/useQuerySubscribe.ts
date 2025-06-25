import { matchQuery } from "@tanstack/vue-query";
import { getQueryClient } from "~/composables/useQueryClient";

export function useQuerySubscribe<T>(
  queryKey: string | string[],
  callback: (object: T | undefined) => void,
) {
  const queryClient = getQueryClient();

  const unsubscribe = queryClient.getQueryCache().subscribe((event) => {
    if (
      event.type === "updated" &&
      event.action.type === "success" &&
      matchQuery(
        { queryKey: Array.isArray(queryKey) ? queryKey : [queryKey], exact: true },
        event.query,
      )
    ) {
      callback(event.action.data);
    }
  });

  return {
    unsubscribe,
  };
}
