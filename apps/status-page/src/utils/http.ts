import { defu } from "defu";
import { $fetch, FetchError, type FetchOptions } from "ofetch";
import { API_URL } from "astro:env/server";
import isNetworkError from "is-network-error";

export class NetworkError extends Error {
  constructor(cause: Error) {
    super("Network error");
    this.name = "NetworkError";
    this.message = cause.message || "Network error occurred";
    this.cause = cause;
  }
}

export async function httpRequest<T = never>(
  method: "get" | "patch" | "put" | "delete" | "post",
  request: string,
  config?: FetchOptions<"json">,
): Promise<T> {
  const requestConfig = defu<FetchOptions<"json">, FetchOptions<"json">[]>(
    config,
    {
      method,
      baseURL: API_URL,
    },
  );

  try {
    return await $fetch<T>(request, requestConfig);
  } catch (e) {
    if (e instanceof FetchError && isNetworkError(e.cause)) {
      throw new NetworkError(e);
    }
    throw e;
  }
}
