import Image from "next/image"
import { Box, Stack } from "@mui/material"

import routes from "./routes"

interface BottomBarProps {
  orgId: string
}

export default function BottomBar({ orgId }: BottomBarProps) {
  return (
    <Stack
      sx={{
        py: 2.5,
        px: 8,
        left: 0,
        width: "100%",
        bottom: 0,
        bgcolor: "gray.100",
        display: {
          xs: "flex",
          md: "none",
        },
        position: "fixed",
        alignItems: "center",
        flexDirection: "row",
        justifyContent: "space-between",
        borderTopLeftRadius: ".75rem",
        borderTopRightRadius: ".75rem",
      }}
    >
      {routes.map(({ icon, path, label }) => (
        <Box key={label}>
          <Image src={icon} alt="" width={32} height={32} />
        </Box>
      ))}
    </Stack>
  )
}
