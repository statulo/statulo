// Chrome DevTools specific route
// https://chromium.googlesource.com/devtools/devtools-frontend/+/main/docs/ecosystem/automatic_workspace_folders.md
export default defineEventHandler((event) => {
  setResponseStatus(event, 204);
});
