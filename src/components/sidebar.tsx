import { type JSX } from "react"
import { Route } from "next"
import Link from "next/link"
import { Stack, Typography } from "@mui/material"

type Router = {
  icon: JSX.Element
  path: string
  label: string
  active: boolean
}

interface SidebarProps {
  routes: Router[]
}

export default function Sidebar({ routes }: SidebarProps) {
  return (
    <>
      <Stack
        sx={{
          py: 3.5,
          px: 3,
          height: "100%",
          display: { xs: "none", md: "flex" },
          minWidth: "16rem",
          minHeight: "100vh",
          borderRight: "1px solid",
          borderRightColor: "gray.300",
        }}
      >
        <Typography
          sx={{ mb: 2, color: "gray.500", fontWeight: 500 }}
          variant="body2"
        >
          MAIN MENU
        </Typography>

        {routes.map(({ label, path, icon, active }) => (
          <Stack
            sx={{
              p: 1,
              mb: 1,
              gap: 1.5,
              color: "gray.800",
              bgcolor: active ? "gray.200" : "white",
              alignItems: "center",
              borderRadius: 1.5,
            }}
            key={path}
            href={path as Route}
            component={Link}
            direction="row"
          >
            {icon}
            <Typography sx={{ fontWeight: 500 }}>{label}</Typography>
          </Stack>
        ))}
      </Stack>
    </>
  )
}
