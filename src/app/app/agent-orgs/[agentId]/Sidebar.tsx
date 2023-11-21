"use client"

import { useMemo } from "react"
import { Route } from "next"
import Link from "next/link"
import { useParams, usePathname } from "next/navigation"
import { RootState } from "@/redux/store"
import { Stack, Typography } from "@mui/material"
import {
  Contact,
  LayoutDashboardIcon,
  Search,
  SettingsIcon,
} from "lucide-react"
import { useSelector } from "react-redux"

import { AgentRole } from "@/types/agentProfile.types"

const Sidebar = () => {
  const pathName = usePathname()
  const { agentId } = useParams()
  const agentOrgs = useSelector((state: RootState) => state.app.agentOrgs)
  const role = useMemo(
    () => agentOrgs.find((agent) => agent._id === agentId)?.role,
    [agentId, agentOrgs]
  )

  const routes = useMemo(
    () => [
      {
        label: "Search",
        path: `/app/agent-orgs/${agentId}`,
        icon: <LayoutDashboardIcon />,
        active: pathName === `/app/agent-orgs/${agentId}`,
      },
      {
        label: "Contacts",
        path: `/app/agent-orgs/${agentId}/contacts`,
        icon: <Contact />,
        active: pathName.includes("contacts"),
      },
      {
        label: "My Searches",
        path: `/app/agent-orgs/${agentId}/search-results`,
        icon: <Search />,
        active: pathName.includes("search-results"),
      },
      ...(role === AgentRole.owner || role === AgentRole.admin
        ? [
            {
              label: "Settings",
              path: `/app/agent-orgs/${agentId}/settings`,
              icon: <SettingsIcon />,
              active: pathName.includes("settings"),
            },
          ]
        : []),
    ],
    [pathName, agentId, role]
  )

  return (
    <>
      <Stack
        width="200px"
        spacing={1}
        padding={2}
        borderRight="1px solid #D9D9D9"
        minHeight="100vh"
        sx={{ display: { xs: "none", md: "flex" } }}
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
            borderRadius={1}
          >
            {icon}
            <Typography variant="body1">{label}</Typography>
          </Stack>
        ))}
      </Stack>
    </>
  )
}

export default Sidebar
