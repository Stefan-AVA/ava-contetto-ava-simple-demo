import type { PropsWithChildren } from "react"
import { Stack, Typography } from "@mui/material"

export default function RoomLayout({ children }: PropsWithChildren) {
  return (
    <Stack sx={{ gap: 2, flex: 1, width: "100%" }}>
      <Stack
        sx={{
          gap: 1,
          alignItems: "center",
          flexDirection: "row",
        }}
      >
        <Typography
          sx={{ color: "gray.700", fontWeight: 500 }}
          variant="h4"
          component="h1"
        >
          Messages
        </Typography>
      </Stack>

      <Stack
        sx={{
          flex: 1,
          border: "1px solid",
          borderColor: "gray.300",
          borderRadius: ".75rem",
        }}
      >
        {children}
      </Stack>
    </Stack>
  )
}
