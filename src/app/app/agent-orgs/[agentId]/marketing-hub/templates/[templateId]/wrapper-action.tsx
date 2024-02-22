import type { PropsWithChildren } from "react"
import { Stack, Typography } from "@mui/material"

interface WrapperActionProps {
  title: string
}

export default function WrapperAction({
  title,
  children,
}: PropsWithChildren<WrapperActionProps>) {
  return (
    <Stack
      sx={{
        p: 4,
        gap: 2,
        borderBottom: "1px solid",
        borderBottomColor: "gray.200",
      }}
    >
      <Typography variant="h6">{title}</Typography>

      {children}
    </Stack>
  )
}
