// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-04-15',

  future: {
    compatibilityVersion: 4
  },

  devtools: { enabled: true },

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
      standalone: false
    }
  },

  modules: [
    '@nuxt/eslint',
    '@nuxt/fonts',
    '@nuxt/icon',
    '@nuxt/image',
    '@nuxt/scripts',
    '@nuxtjs/tailwindcss',
    '@vueuse/nuxt',
    '@pinia/nuxt',
    'pinia-plugin-persistedstate/nuxt',
    '@nuxtjs/robots'
  ]
})
