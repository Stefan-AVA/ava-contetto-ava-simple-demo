import { PropsWithChildren } from "react"
import { Stack } from "@mui/material"

import Rooms from "."

export default function LayoutRoomPage({ children }: PropsWithChildren) {
  return (
    <Stack sx={{ height: "100%", flexDirection: "row" }}>
      <Stack
        sx={{
          p: 3,
          display: {
            xs: "none",
            md: "flex",
          },
          width: "20.5rem",
          minWidth: "20.5rem",
          overflowY: "auto",
          borderRight: "1px solid",
          borderColor: "gray.300",
        }}
      >
        <Rooms />
      </Stack>

      <Stack sx={{ width: "100%", height: "100%", flexGrow: 1 }}>
        {children}
      </Stack>
    </Stack>
  )
}
