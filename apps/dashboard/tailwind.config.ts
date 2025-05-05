import type { Config } from "tailwindcss";
import colors from "tailwindcss/colors";

export default {
  content: [],
  theme: {
    colors: {
      current: "currentColor",
      white: colors.white,
      neutral: {
        950: "#0A0A10",
        900: "#0D0D14",
        800: "#101019",
        700: "#171721",
        600: "#1F1F2B",
        500: "#2B2B3A",
        400: "#444458",
        300: "#5F5F78",
        250: "#71718B",
        200: "#82829D",
        150: "#A7A7C0",
        100: "#C3C3D7",
      },
      primary: {
        600: "#B96910",
        500: "#CB7A1F",
        400: "#DD8828",
        300: "#E69F4F",
      },
      status: {
        successDark: "#3ACE3F",
        successLight: "#56B838",
        errorDark: "#F3585A",
        errorLight: "#E93134",
      },
    },
    fontFamily: {
      sans: ["'DM Sans'", "sans-serif"],
      mono: ["'DM Mono'", "monospace"],
      code: ["'Cascadia Code'", "monospace"],
    },
    extend: {},
  },
  plugins: [],
} satisfies Config;
