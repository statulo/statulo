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

export default defineNuxtPlugin((nuxt) => {
  const vueQueryState = useState<DehydratedState | null>("vue-query");

  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 5000, retry(failureCount, error) {
          // Don't retry on 4xx errors
          if (
            error instanceof FetchError &&
            error.statusCode != null &&
            error.statusCode >= 400 &&
            error.statusCode < 500
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
