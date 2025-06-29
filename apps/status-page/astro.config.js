// @ts-check
import { defineConfig, envField } from "astro/config";
import tailwind from "@astrojs/tailwind";
import node from "@astrojs/node";
import icon from "astro-icon";

// https://astro.build/config
export default defineConfig({
  integrations: [tailwind(), icon()],

  output: "server",

  adapter: node({
    mode: "standalone",
  }),

  env: {
    schema: {
      API_URL: envField.string({ url: true, context: "server", access: "public" }),
    },
  },
});
