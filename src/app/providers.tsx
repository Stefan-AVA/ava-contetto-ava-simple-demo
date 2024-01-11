"use client"

import { type PropsWithChildren } from "react"
import SocketProvider from "@/providers/SocketProvider"
import { store } from "@/redux/store"
import { LocalizationProvider } from "@mui/x-date-pickers"
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFnsV3"
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
          <LocalizationProvider dateAdapter={AdapterDateFns}>
            <SocketProvider>{children}</SocketProvider>
          </LocalizationProvider>
        </SnackbarProvider>
      </Provider>
    </ThemeProvider>
  )
}
