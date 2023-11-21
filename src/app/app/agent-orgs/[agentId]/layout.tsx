import { type PropsWithChildren } from "react"
import { Box, Stack } from "@mui/material"

import Sidebar from "./sidebar"

export default function Layout({ children }: PropsWithChildren) {
  return (
    <Stack
      padding={{ xs: 1, md: 0 }}
      spacing={{ xs: 2, md: 0 }}
      direction={{ xs: "column", md: "row" }}
    >
      <Sidebar />

      <Box sx={{ p: 5 }}>{children}</Box>
    </Stack>
  )
}
