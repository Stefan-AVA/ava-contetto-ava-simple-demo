"use client"

import { useMemo } from "react"
import { Route } from "next"
import Link from "next/link"
import { useParams, usePathname } from "next/navigation"
import { Stack, Typography } from "@mui/material"
import { LayoutDashboardIcon, Search } from "lucide-react"

export default function Sidebar() {
  const pathName = usePathname()
  const { contactId } = useParams()

  const routes = useMemo(
    () => [
      {
        label: "Search",
        path: `/app/agent-orgs/${contactId}`,
        icon: <LayoutDashboardIcon />,
        active: pathName === `/app/agent-orgs/${contactId}`,
      },
      {
        label: "My Searches",
        path: `/app/agent-orgs/${contactId}/search-results`,
        icon: <Search />,
        active: pathName.includes("search-results"),
      },
    ],
    [pathName, contactId]
  )

  return (
    <Stack
      sx={{
        py: 3.5,
        px: 3,
        width: "19.5rem",
        height: "100%",
        display: { xs: "none", md: "flex" },
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
  )
}
