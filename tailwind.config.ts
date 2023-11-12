import type { Config } from "tailwindcss"
import { fontFamily } from "tailwindcss/defaultTheme"

export default {
  theme: {
    colors: {
      red: {
        500: "#F5756F",
      },

      blue: {
        300: "#A1A5C1",
        500: "#4966AC",
        800: "#252B5C",
      },

      gray: {
        200: "#F5F4F8",
        300: "#DFDFDF",
        400: "#A6A6A6",
        500: "#4B5765",
        600: "#4D4D4D",
        700: "#172832",
        800: "#262626",
      },

      green: {
        500: "#43A491",
        600: "#8BC83F",
      },

      white: "#FFF",
      black: "#000",

      yellow: {
        500: "#FFFBA5",
      },

      orange: {
        500: "#FABA8A",
      },

      transparent: "transparent",
    },

    fontSize: {
      xs: [".75rem", "1.125rem"],
      sm: [".875rem", "1.5rem"],
      md: ["1rem", "1.5rem"],
      lg: ["1.125rem", "1.75rem"],
      xl: ["1.25rem", "1.875rem"],
      xxs: [".625rem", ".75rem"],
      "2xl": ["1.5rem", "2.25rem"],
      "3xl": ["2rem", "3rem"],
      "4xl": ["2.25rem", "3rem"],
      "5xl": ["2.5rem", "2.875rem"],
      "6xl": ["3rem", "4rem"],
      "7xl": ["3.5rem", "4.5rem"],
    },

    container: {
      center: true,
      padding: "1.5rem",
    },

    fontFamily: {
      sans: ["var(--font-dmsans)", ...fontFamily.sans],
    },
  },

  plugins: [],

  content: [
    "src/app/*.tsx",
    "src/app/**/*.tsx",
    "src/layouts/*.tsx",
    "src/layouts/**/*.tsx",
    "src/components/*.tsx",
    "src/components/**/*.tsx",
  ],
} satisfies Config
