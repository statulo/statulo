// This middleware makes sure that you cannot reach organisation scoped pages if you don't have any joined organisations
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

  // Only apply no-org check on org-scoped auth pages
  if (to.meta.auth !== "org-scoped") {
    return;
  }

  // user has to be loaded to do this check
  if (!authStore.user) {
    return;
  }

  // If user has organisatios, don't do anything
  const hasOrg = authStore.user?.orgMembers.length > 0;
  if (!hasOrg) {
    return;
  }

  // user is missing organisations, redirect to organisation creation page
  return navigateTo({
    path: "/start",
  });
});
