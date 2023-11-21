"use client"

import { useMemo } from "react"
import { Route } from "next"
import Link from "next/link"
import { useParams, usePathname } from "next/navigation"
import { Stack, Typography } from "@mui/material"
import { LayoutDashboardIcon, Search } from "lucide-react"

const Sidebar = () => {
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
      width="200px"
      spacing={1}
      padding={2}
      borderRight="1px solid #D9D9D9"
      minHeight="100vh"
    >
      {routes.map(({ label, path, icon, active }) => (
        <Stack
          direction="row"
          spacing={2}
          key={path}
          href={path as Route}
          component={Link}
          padding={1}
          alignItems="center"
          sx={{
            background: active ? "#EBEBEB" : "white",
          }}
        >
          {icon}
          <Typography>{label}</Typography>
        </Stack>
      ))}
    </Stack>
  )
}

export default Sidebar
