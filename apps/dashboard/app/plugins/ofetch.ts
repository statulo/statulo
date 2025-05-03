import { $fetch } from "ofetch";
import { getBaseUrl } from "~/utils/http";

export default defineNuxtPlugin(() => {
  const ofetch = $fetch.create({
    baseURL: getBaseUrl(),
    retry: 0,
  });

  return {
    provide: {
      ofetch,
    },
  };
});
