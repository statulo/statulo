// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: "2025-04-15",

  future: {
    compatibilityVersion: 4,
  },

  devtools: { enabled: true },

  runtimeConfig: {
    public: {
      http: {
        browserBaseUrl: "http://localhost:8080",
      },
    },
    http: {
      baseUrl: "http://localhost:8080",
    },
  },

  components: [
    {
      path: "~/components/",
      pathPrefix: false,
    },
  ],

  typescript: {
    typeCheck: true,
    strict: true,
    tsConfig: {
      compilerOptions: {
        noUncheckedIndexedAccess: true,
        allowUnreachableCode: false,
      },
    },
  },

  eslint: {
    config: {
      // We use our own eslint config, so disable all but the nuxt generated rules
      standalone: false,
    },
  },

  experimental: {
    // This enables the nuxtApp context to be accessible in async functions
    // Especially useful for the vue-query plugin, where retries using the nuxtApp context will fail without this
    asyncContext: true,
  },

  modules: [
    "@nuxt/eslint",
    "@nuxt/fonts",
    "@nuxt/icon",
    "@nuxt/image",
    "@nuxt/scripts",
    "@nuxtjs/tailwindcss",
    "@vueuse/nuxt",
    "@pinia/nuxt",
    "pinia-plugin-persistedstate/nuxt",
    "@nuxtjs/robots",
  ],
});
