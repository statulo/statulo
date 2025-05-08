// Created to handle well-known requests so Nuxt doesn't throw a warning about them
// Namely:
// - Chrome DevTools specific route https://chromium.googlesource.com/devtools/devtools-frontend/+/main/docs/ecosystem/automatic_workspace_folders.md
export default defineEventHandler((event) => {
  setResponseStatus(event, 404);
});
