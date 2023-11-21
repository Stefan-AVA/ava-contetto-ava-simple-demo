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

export default function Sidebar() {
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
        path: `/app/agent-orgs/${agentId}`,
        icon: <LayoutDashboardIcon />,
        label: "Search",
        active: pathName === `/app/agent-orgs/${agentId}`,
      },
      {
        path: `/app/agent-orgs/${agentId}/contacts`,
        icon: <Contact />,
        label: "Contacts",
        active: pathName.includes("contacts"),
      },
      {
        path: `/app/agent-orgs/${agentId}/search-results`,
        icon: <Search />,
        label: "My Searches",
        active: pathName.includes("search-results"),
      },
      ...(role === AgentRole.owner || role === AgentRole.admin
        ? [
            {
              path: `/app/agent-orgs/${agentId}/settings`,
              icon: <SettingsIcon />,
              label: "Settings",
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
    </>
  )
}
