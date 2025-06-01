import type { Config } from "tailwindcss";
import colors from "tailwindcss/colors";

export default {
  content: [],
  theme: {
    colors: {
      current: "currentColor",
      white: colors.white,
      neutral: {
        gradientTop: "#9696A1",
        950: "#08080D",
        900: "#0E0E16",
        800: "#16161F",
        700: "#1C1C25",
        600: "#23232D",
        500: "#2B2B36",
        400: "#343440",
        300: "#545463",
        250: "#7B7B87",
        200: "#9696A1",
        150: "#B9B9C4",
        100: "#E9E9F3",
      },
      primary: {
        600: "#AD6311",
        500: "#C87920",
        400: "#DD8828",
        300: "#E69F4F",
        100: "#FFE9D0",
      },
      status: {
        success: "#52BF55",
        danger: "#FF6063",
      },
    },
    fontFamily: {
      sans: ["'DM Sans'", "Helvetica", "Arial", "sans-serif"],
      mono: ["'DM Mono'", "monospace"],
      code: ["'Cascadia Code'", "monospace"],
    },
    boxShadow: {
      md: "0 4px 4px 0px rgba(0, 0, 0, 0.15)",
    },
    extend: {},
  },
  plugins: [],
} satisfies Config;
