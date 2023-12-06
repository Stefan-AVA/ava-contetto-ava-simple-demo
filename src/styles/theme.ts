import type {} from "@mui/lab/themeAugmentation"

import {
  createTheme,
  type Components,
  type PaletteOptions,
  type Theme,
} from "@mui/material/styles"
import type { TypographyOptions } from "@mui/material/styles/createTypography"

import { dmsans } from "./fonts"

export const palette = {
  red: {
    200: "#EB5757",
    300: "#FA8792",
    500: "#F5756F",
  },

  blue: {
    300: "#A1A5C1",
    500: "#3A4188",
    800: "#252B5C",
  },

  cyan: {
    500: "#00B8D2",
    600: "#04A7BE",
  },

  gray: {
    100: "#F9F9FB",
    200: "#F5F4F8",
    300: "#D9D9D9",
    400: "#A6A6A6",
    500: "#8C8C8C",
    600: "#4D4D4D",
    700: "#172832",
    800: "#262626",
  },

  green: {
    500: "#43A491",
    600: "#8BC83F",
    700: "#27AE60",
  },

  white: "#FFF",
  black: "#000",

  yellow: {
    500: "#FFFBA5",
  },

  orange: {
    500: "#FABA8A",
  },

  purple: {
    500: "#5A57FF",
  },

  transparent: "transparent",
}

export const typography: TypographyOptions = {
  h1: {
    fontSize: "3rem",
    lineHeight: "4rem",
  },

  h2: {
    fontSize: "2.5rem",
    lineHeight: "3.5rem",
  },

  h3: {
    fontSize: "2rem",
    lineHeight: "3rem",
  },

  h4: {
    fontSize: "1.5rem",
    lineHeight: "2.5rem",
  },

  h5: {
    fontSize: "1.25rem",
    lineHeight: "2rem",
  },

  h6: {
    fontSize: "1.125rem",
    lineHeight: "1.75rem",
  },

  body1: {
    fontSize: "1rem",
    lineHeight: "1.5rem",
  },

  body2: {
    fontSize: ".875rem",
    lineHeight: "1.5rem",
  },

  caption: {
    fontSize: ".75rem",
    lineHeight: "1.125rem",
  },

  fontFamily: dmsans.style.fontFamily,
}

export const components = (
  colors: PaletteOptions
): Components<Omit<Theme, "components">> => ({
  MuiTab: {
    styleOverrides: {
      textColorPrimary: {
        color: colors.gray[500],

        "&.Mui-selected": {
          color: colors.cyan[500],
        },
      },
    },
  },

  MuiTabs: {
    styleOverrides: {
      indicator: {
        backgroundColor: colors.cyan[500],
      },
    },
  },

  MuiButton: {
    defaultProps: {
      color: "primary",
      variant: "contained",
      disableElevation: true,
    },

    styleOverrides: {
      root: {
        fontWeight: 600,
        borderRadius: ".5rem",
      },

      sizeMedium: {
        height: "3.5rem",
        padding: ".75rem 1.5rem",
      },

      containedPrimary: {
        color: colors.white,
        backgroundColor: colors.cyan[500],

        ":hover": {
          backgroundColor: colors.cyan[600],
        },
      },
    },
  },

  MuiTooltip: {
    styleOverrides: {
      arrow: {
        color: colors.gray[300],
      },

      tooltip: {
        color: colors.gray[800],
        boxShadow: "0 8px 32px rgba(0, 0, 0, .14)",
        borderRadius: ".75rem",
        backgroundColor: colors.gray[300],
      },
    },
  },

  MuiCheckbox: {
    styleOverrides: {
      root: {
        color: colors.gray[400],

        "&.Mui-checked": {
          color: colors.cyan[600],
        },
      },
    },
  },

  MuiInputBase: {
    styleOverrides: {
      input: {
        zIndex: 2,
      },

      sizeSmall: {
        ".MuiOutlinedInput-notchedOutline": {
          height: "3rem",
          borderColor: colors.gray[300],
          backgroundColor: colors.gray[100],
        },
      },
    },
  },

  MuiInputLabel: {
    styleOverrides: {
      root: {
        color: colors.gray[400],

        "&.Mui-focused": {
          color: colors.cyan[500],
        },
      },

      sizeSmall: {
        top: 1,
        color: colors.gray[500],
        fontWeight: 500,
      },
    },
  },

  MuiIconButton: {
    defaultProps: {
      size: "medium",
      color: "primary",
    },

    styleOverrides: {
      root: {
        borderRadius: ".75rem",
      },

      sizeMedium: {
        padding: ".625rem",
      },

      colorPrimary: {
        color: colors.white,
        backgroundColor: colors.purple[500],

        ":hover": {
          opacity: 0.9,
          backgroundColor: colors.purple[500],
        },
      },
    },
  },

  MuiCssBaseline: {
    styleOverrides: {
      ".swiper": {
        "&-pagination-bullet": {
          opacity: ".4 !important",
          backgroundColor: `${colors.white} !important`,

          "&-active": {
            opacity: "1 !important",
            backgroundColor: `${colors.white} !important`,
          },
        },
      },
    },
  },

  MuiAutocomplete: {
    styleOverrides: {
      endAdornment: {
        gap: 1,
        zIndex: 2,
        display: "flex",
        transform: "translateY(4px)",
        alignItems: "center",

        ".MuiIconButton-root": {
          color: colors.gray[400],
          padding: 0,
          backgroundColor: "transparent",

          ":hover": {
            color: colors.purple[500],
            backgroundColor: "transparent",
          },
        },
      },
    },
  },

  MuiOutlinedInput: {
    styleOverrides: {
      root: {
        borderRadius: ".5rem",

        ":hover": {
          ".MuiOutlinedInput-notchedOutline": {
            borderColor: `${colors.gray[400]}`,
          },
        },

        "&.Mui-focused": {
          ".MuiOutlinedInput-notchedOutline": {
            borderColor: `${colors.cyan[500]}`,
          },
        },
      },
      notchedOutline: {
        borderColor: colors.gray[300],
      },
    },
  },

  MuiLoadingButton: {
    defaultProps: {
      color: "primary",
      variant: "contained",
      disableElevation: true,
    },
  },

  MuiInputAdornment: {
    styleOverrides: {
      root: {
        zIndex: 2,
      },
    },
  },

  MuiCircularProgress: {
    styleOverrides: {
      root: {
        color: colors.cyan[500],
      },
    },
  },

  MuiFormControlLabel: {
    styleOverrides: {
      label: {
        color: colors.gray[800],
        fontSize: ".875rem",
        lineHeight: "1.5rem",
      },
    },
  },
})

const theme = createTheme({
  palette,
  typography,
  components: components(palette),
})

export default theme
