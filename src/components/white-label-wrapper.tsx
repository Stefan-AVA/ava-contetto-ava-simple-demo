import { memo, useEffect, useMemo, type PropsWithChildren } from "react"
import colorMapper from "@/utils/color-mapper"
import { createTheme, ThemeProvider } from "@mui/material/styles"

import { dmsans } from "@/styles/fonts"
import defaultTheme, { components, palette, typography } from "@/styles/theme"
import {
  initialTheme,
  type DefaultAvaOrgTheme,
} from "@/styles/white-label-theme"

interface WhiteLabelProviderProps extends PropsWithChildren {
  whiteLabel?: DefaultAvaOrgTheme
}

function WhiteLabelWrapper({ children, whiteLabel }: WhiteLabelProviderProps) {
  useEffect(() => {
    const navbar = document.getElementById("navbar")!
    const sidebar = document.getElementById("sidebar")!

    if (!whiteLabel) return

    if (whiteLabel.background !== initialTheme.background) {
      navbar.style.backgroundColor = whiteLabel.background
    }

    if (whiteLabel.secondary !== initialTheme.secondary) {
      sidebar.style.backgroundColor = whiteLabel.secondary
    }

    return () => {
      navbar.style.backgroundColor = initialTheme.background
      sidebar.style.backgroundColor = initialTheme.secondary
    }
  }, [whiteLabel])

  const theme = useMemo(() => {
    if (!whiteLabel) return defaultTheme

    if (whiteLabel.fontFamily !== dmsans.style.fontFamily) {
      const link = document.createElement("link")

      link.type = "text/css"
      link.rel = "stylesheet"

      document.head.appendChild(link)

      link.href = `https://fonts.googleapis.com/css2?family=${whiteLabel.fontFamily.replaceAll(
        " ",
        "+"
      )}:wght@400;500;600;700&display=swap`
    }

    const colors = {
      ...palette,
      gray: {
        ...palette.gray,
        500: whiteLabel.description || initialTheme.description,
        700: whiteLabel.title || initialTheme.title,
      },
      primary: colorMapper({
        main: whiteLabel.primary || initialTheme.primary,
      }),
      secondary: colorMapper({
        main: whiteLabel.secondary || initialTheme.secondary,
      }),
      background: {
        paper: whiteLabel.background || initialTheme.background,
        default: whiteLabel.background || initialTheme.background,
      },
    }

    return createTheme({
      palette: colors,
      components: components(colors),
      typography: {
        ...typography,
        fontFamily: whiteLabel.fontFamily || initialTheme.fontFamily,
      },
    })
  }, [whiteLabel])

  return <ThemeProvider theme={theme}>{children}</ThemeProvider>
}

export default memo(WhiteLabelWrapper)
