import type {
  DehydratedState,
  VueQueryPluginOptions,
} from "@tanstack/vue-query";
import {
  VueQueryPlugin,
  QueryClient,
  hydrate,
  dehydrate,
} from "@tanstack/vue-query";
import { FetchError } from "ofetch";

// Taken from https://github.com/unjs/ofetch/blob/main/src/fetch.ts
// https://developer.mozilla.org/en-US/docs/Web/HTTP/Status
const retryStatusCodes = new Set([
  408, // Request Timeout
  409, // Conflict
  425, // Too Early (Experimental)
  429, // Too Many Requests
  500, // Internal Server Error
  502, // Bad Gateway
  503, // Service Unavailable
  504, // Gateway Timeout
]);

export default defineNuxtPlugin((nuxt) => {
  const vueQueryState = useState<DehydratedState | null>("vue-query");

  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 5000, retry(failureCount, error) {
          // Don't retry on error codes that aren't in the retry status codes
          if (
            error instanceof FetchError &&
            error.statusCode != null &&
            !retryStatusCodes.has(error.statusCode)
          ) {
            return false;
          }

          return failureCount < 3;
        },
      },
    },
  });
  const options: VueQueryPluginOptions = { queryClient, enableDevtoolsV6Plugin: true };

  nuxt.vueApp.use(VueQueryPlugin, options);

  if (import.meta.server) {
    nuxt.hooks.hook("app:rendered", () => {
      vueQueryState.value = dehydrate(queryClient);
    });
  }

  if (import.meta.client) {
    nuxt.hooks.hook("app:created", () => {
      hydrate(queryClient, vueQueryState.value);
    });
  }

  return {
    provide: {
      queryClient,
    },
  };
});
