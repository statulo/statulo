import { FetchError } from "ofetch";
import { getNextPage } from "~/utils/urls";

export default defineNuxtRouteMiddleware(async (to) => {
  const nuxtApp = useNuxtApp();

  // We can skip the middleware if we are in the client and the app is hydrating from SSR
  if (
    import.meta.client &&
      nuxtApp.isHydrating &&
      nuxtApp.payload.serverRendered
  ) {
    return;
  }

  const authStore = useAuthStore();

  if (authStore.token) {
    try {
      await authStore.fetchUser();
    } catch (e: any) {
      if (e instanceof FetchError) {
        if (e.statusCode === 401) {
          authStore.resetAuth();
        } else {
          throw e;
        }
      } else {
        throw e;
      }
    }
  }

  // If auth disabled for this route, skip auth check
  if (to.meta.auth === false) {
    return;
  }

  const pageIsInGuestMode = to.meta.auth === "guest";
  const nextPage = getNextPage(to.query);

  const isPage = (page: `/${string}`) => to.path === page;

  if (authStore.isLoggedIn && authStore.user) {
    // If the user is logged in, redirect them away from guest pages
    if (isPage("/login") && pageIsInGuestMode) {
      return navigateTo(nextPage);
    }

    // The user is logged in, so we can skip the middleware
    return;
  }

  // If the user is not logged in, but the page is in guest mode, skip the middleware
  if (isPage("/login") || pageIsInGuestMode) {
    return;
  }

  return navigateTo({
    path: "/login",
    query: {
      next: to.fullPath,
    },
  });
});
