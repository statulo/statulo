import eslint from "@eslint/js";
import globals from "globals";
import tseslint from "typescript-eslint";
import { defineConfig } from "eslint/config";

import eslintCommentPlugin from "@eslint-community/eslint-plugin-eslint-comments/configs";
import stylisticPlugin from "@stylistic/eslint-plugin";
import vuePlugin from "eslint-plugin-vue";
import astroPlugin from "eslint-plugin-astro";
import importPlugin from "eslint-plugin-import";

const stylisticConfig = stylisticPlugin.configs.customize({
  indent: 2,
  quotes: "double",
  semi: true,
  commaDangle: "always-multiline",
  braceStyle: "1tbs",
});

export default defineConfig([
  {
    // https://eslint.org/docs/rules/
    name: "statulo/eslint-js",
    extends: [eslint.configs.recommended],
    rules: {
      "require-atomic-updates": "off", // This rule is widely controversial and causes false positives
      "no-console": "off",
      "prefer-const": ["error", {
        destructuring: "all", // Only error if all destructured variables can be const
      }],
      "no-var": "error",
      "no-unused-vars": [
        "error",
        { argsIgnorePattern: "^_", caughtErrorsIgnorePattern: "^ignore" },
      ],
      "one-var": ["error", "never"],
    },
  },
  {
    // https://typescript-eslint.io/rules/
    name: "statulo/typescript-eslint",
    extends: [tseslint.configs.recommended],
    files: ["**/*.ts", "**/*.d.ts"],
    rules: {
      "@typescript-eslint/no-unused-vars": [
        "error",
        { argsIgnorePattern: "^_", caughtErrorsIgnorePattern: "^ignore" },
      ],
      "@typescript-eslint/no-inferrable-types": "off",
      "@typescript-eslint/no-explicit-any": "off",
      "@typescript-eslint/no-import-type-side-effects": "error",
      "@typescript-eslint/consistent-type-imports": "error",
    },
  },
  {
    // https://eslint-community.github.io/eslint-plugin-eslint-comments/rules/
    name: "statulo/eslint-comments",
    extends: [eslintCommentPlugin.recommended],
    rules: {
      "@eslint-community/eslint-comments/disable-enable-pair": ["error", { allowWholeFile: true }],
      "@eslint-community/eslint-comments/require-description": "error",
    },
  },
  {
    // https://eslint.style/rules
    name: "statulo/stylistic",
    extends: [stylisticConfig],
    rules: {
      "@stylistic/no-extra-semi": "error",
      "@stylistic/yield-star-spacing": ["error", "after"],
      "@stylistic/operator-linebreak": ["error", "after", { overrides: { "?": "before", ":": "before" } }],
      "@stylistic/curly-newline": ["error", {
        multiline: true,
        consistent: true,
      }],
      "@stylistic/object-curly-newline": ["error", {
        multiline: true,
        consistent: true,
      }],
      "@stylistic/brace-style": ["error", "1tbs", { allowSingleLine: true }],
    },
  },
  {
    name: "statulo/imports",
    extends: [
      importPlugin.flatConfigs.recommended,
    ],
    rules: {
      "import/no-mutable-exports": "error",
      "import/no-self-import": "error",
      "import/first": "error",
      "import/no-duplicates": "error",
      "import/no-named-default": "error",

      "import/order": "error",
      "import/newline-after-import": ["error", { count: 1 }],

      "import/no-unresolved": "off", // This has the tendency to cause false errors
    },
  },
  {
    name: "statulo/base-globals",
    languageOptions: {
      globals: {
        ...globals.builtin,
        ...globals["shared-node-browser"],
      },
    },
  },
  {
    // https://eslint.vuejs.org/rules/
    name: "statulo/vue",
    extends: [
      vuePlugin.configs["flat/essential"],
      vuePlugin.configs["flat/recommended"],
      vuePlugin.configs["flat/strongly-recommended"],
    ],
    files: ["**/*.vue"],
    languageOptions: {
      parserOptions: {
        parser: "@typescript-eslint/parser",
      },
      globals: {
        ...globals.browser,
      },
    },
    rules: {
      "vue/multi-word-component-names": "off",
    },
  },
  {
    // https://ota-meshi.github.io/eslint-plugin-astro/rules/
    name: "statulo/astro",
    files: ["**/*.astro"],
    extends: [astroPlugin.configs["flat/recommended"]],
    rules: {},
  },
  {
    // https://eslint.org/docs/latest/use/configure/ignore
    name: "statulo/global-ignores",
    ignores: [
      "**/dist/",
      "**/.nuxt/",
    ],
  },
]);
