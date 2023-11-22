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
    MuiTab: {
      styleOverrides: {
        textColorPrimary: {
          color: palette.gray[500],

          "&.Mui-selected": {
            color: palette.cyan[500],
          },
        },
      },
    },

    MuiTabs: {
      styleOverrides: {
        indicator: {
          backgroundColor: palette.cyan[500],
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

    MuiInputBase: {
      styleOverrides: {
        sizeSmall: {
          paddingTop: ".5rem !important",
          paddingBottom: ".5rem !important",

          ".MuiOutlinedInput-notchedOutline": {
            height: "3rem",
            borderColor: palette.gray[300],
            backgroundColor: palette.gray[100],
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

        sizeSmall: {
          top: 1,
          color: palette.gray[500],
          fontWeight: 500,
        },
      },
    },

    MuiCssBaseline: {
      styleOverrides: {
        ".swiper": {
          "&-pagination-bullet": {
            opacity: ".4 !important",
            backgroundColor: `${palette.white} !important`,

            "&-active": {
              opacity: "1 !important",
              backgroundColor: `${palette.white} !important`,
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
