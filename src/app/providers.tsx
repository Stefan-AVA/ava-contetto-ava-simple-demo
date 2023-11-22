"use client"

import type { PropsWithChildren } from "react"
import { store } from "@/redux/store"
import { SnackbarProvider } from "notistack"
import { Provider } from "react-redux"

import ThemeProvider from "@/components/theme"

export default function Providers({ children }: PropsWithChildren) {
  return (
    <ThemeProvider>
      <Provider store={store}>
        <SnackbarProvider
          maxSnack={4}
          anchorOrigin={{
            vertical: "bottom",
            horizontal: "right",
          }}
        >
          {children}
        </SnackbarProvider>
      </Provider>
    </ThemeProvider>
  )
}
