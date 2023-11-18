"use client"

import type { PropsWithChildren } from "react"
import { store } from "@/redux/store"
import { Provider } from "react-redux"

import ThemeProvider from "@/components/theme"

export default function Providers({ children }: PropsWithChildren) {
  return (
    <ThemeProvider>
      <Provider store={store}>{children}</Provider>
    </ThemeProvider>
  )
}
