import type { FetchOptions } from "ofetch";
import { defu } from "defu";

/**
 * Returns the correct base URL depending on whether the code is running client-side or in SSR.
 *
 * - When running in the browser, it returns config.public.http.browserBaseUrl
 * - When running on the server, it returns config.http.baseUrl
 */
export function getBaseUrl() {
  const config = useRuntimeConfig();

  return import.meta.client
    ? config.public.http.browserBaseUrl
    : config.http.baseUrl;
}

export async function httpRequest<T = never>(
  method: "get" | "patch" | "put" | "delete" | "post",
  request: string,
  config?: FetchOptions<"json">,
): Promise<T> {
  const { $ofetch } = useNuxtApp();
  const authStore = useAuthStore();

  const requestConfig = defu<FetchOptions<"json">, FetchOptions<"json">[]>(
    config,
    {
      method,
    },
    authStore.token
      ? {
          headers: {
            Authorization: `Bearer ${authStore.token}`,
          },
        }
      : {},
  );

  return await $ofetch<T>(request, requestConfig);
}
