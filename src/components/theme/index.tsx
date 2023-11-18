"use client"

import * as React from "react"
import type { PropsWithChildren } from "react"
import CssBaseline from "@mui/material/CssBaseline"
import { ThemeProvider } from "@mui/material/styles"

import theme from "@/styles/theme"

import NextAppDirEmotionCacheProvider from "./emotion-cache"

export default function ThemeRegistry({ children }: PropsWithChildren) {
  return (
    <NextAppDirEmotionCacheProvider options={{ key: "mui" }}>
      <ThemeProvider theme={theme}>
        <CssBaseline />

        {children}
      </ThemeProvider>
    </NextAppDirEmotionCacheProvider>
  )
}
