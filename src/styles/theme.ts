import type {} from "@mui/lab/themeAugmentation"

import { createTheme } from "@mui/material/styles"

import { dmsans } from "./fonts"

export const palette = {
  red: {
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
}

const theme = createTheme({
  palette,
  typography: {
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
  },
  components: {
    MuiButton: {
      defaultProps: {
        color: "primary",
        variant: "contained",
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
          color: palette.white,
          backgroundColor: palette.cyan[500],

          ":hover": {
            backgroundColor: palette.cyan[600],
          },
        },
      },
    },

    MuiCheckbox: {
      styleOverrides: {
        root: {
          color: palette.gray[400],

          "&.Mui-checked": {
            color: palette.cyan[600],
          },
        },
      },
    },

    MuiInputLabel: {
      styleOverrides: {
        root: {
          color: palette.gray[400],

          "&.Mui-focused": {
            color: palette.cyan[500],
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
              borderColor: `${palette.gray[400]}`,
            },
          },

          "&.Mui-focused": {
            ".MuiOutlinedInput-notchedOutline": {
              borderColor: `${palette.cyan[500]}`,
            },
          },
        },
        notchedOutline: {
          borderColor: palette.gray[300],
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

    MuiCircularProgress: {
      styleOverrides: {
        root: {
          color: palette.cyan[500],
        },
      },
    },

    MuiFormControlLabel: {
      styleOverrides: {
        label: {
          color: palette.gray[800],
          fontSize: ".875rem",
          lineHeight: "1.5rem",
        },
      },
    },
  },
})

export default theme
