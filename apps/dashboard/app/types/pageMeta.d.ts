import "nuxt/dist/pages/runtime/composables";

declare module "nuxt/dist/pages/runtime/composables" {
  interface PageMeta {
    auth?: boolean | "guest";
  }
}
