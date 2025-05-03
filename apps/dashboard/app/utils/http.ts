import { FetchError, type FetchOptions } from "ofetch";
import { defu } from "defu";
import isNetworkError from "is-network-error";

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

export class NetworkError extends Error {
  constructor(cause: Error) {
    super("Network error");
    this.name = "NetworkError";
    this.cause = cause;
  }
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

  try {
    return await $ofetch<T>(request, requestConfig);
  } catch (e) {
    if (e instanceof FetchError && isNetworkError(e.cause)) {
      throw new NetworkError(e);
    }
    throw e;
  }
}
