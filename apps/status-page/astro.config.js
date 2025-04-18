// @ts-check
import { defineConfig } from "astro/config";
import tailwind from "@astrojs/tailwind";
import node from "@astrojs/node";
import icon from "astro-icon";

// https://astro.build/config
export default defineConfig({
  integrations: [tailwind(), icon()],

  adapter: node({
    mode: "standalone",
  }),

  env: {
    schema: {

    },
  },
});
