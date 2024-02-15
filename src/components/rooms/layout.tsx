import { PropsWithChildren } from "react"
import { Box, Stack } from "@mui/material"

import Rooms from "."

export default function LayoutRoomPage({ children }: PropsWithChildren) {
  return (
    <Stack sx={{ height: "100%", flexDirection: "row" }}>
      <Stack
        sx={{
          p: 3,
          minWidth: "20.5rem",
          overflowY: "auto",
          borderRight: "1px solid",
          borderColor: "gray.300",
        }}
      >
        <Rooms />
      </Stack>

      <Box sx={{ height: "100%", flexGrow: 1 }}>{children}</Box>
    </Stack>
  )
}
