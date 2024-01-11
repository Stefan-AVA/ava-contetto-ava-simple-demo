"use client"

import { useMemo, type PropsWithChildren } from "react"
import { useParams, usePathname } from "next/navigation"
import { RootState } from "@/redux/store"
import { Stack } from "@mui/material"
import {
  Contact,
  LayoutDashboardIcon,
  Search,
  SettingsIcon,
  UserPlus,
} from "lucide-react"
import { useSelector } from "react-redux"

import { AgentRole } from "@/types/agentProfile.types"
import Breadcrumb from "@/components/breadcrumb"
import Sidebar from "@/components/sidebar"
import WhiteLabelWrapper from "@/components/white-label-wrapper"

export default function Layout({ children }: PropsWithChildren) {
  const pathName = usePathname()

  const { agentId } = useParams()

  const agentOrgs = useSelector((state: RootState) => state.app.agentOrgs)

  const currentOrg = useMemo(
    () => agentOrgs.find((agent) => agent._id === agentId)!,
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
      ...(currentOrg.role === AgentRole.owner ||
      currentOrg.role === AgentRole.admin
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
    [pathName, agentId, currentOrg.role]
  )

  const hasWhiteLabelDefined = currentOrg.org?.whiteLabel

  return (
    <WhiteLabelWrapper whiteLabel={hasWhiteLabelDefined}>
      <Stack
        sx={{
          p: { xs: 1, md: 0 },
          gap: { xs: 2, md: 0 },
          bgcolor: "background.default",
        }}
        direction={{ xs: "column", md: "row" }}
      >
        <Sidebar routes={routes} />

        <Stack
          sx={{
            p: { xs: 1, md: 5 },
            gap: 2,
            width: "100%",
            height: "calc(100vh - 4rem)",
            overflowY: "auto",
            overflowX: "hidden",
          }}
        >
          <Breadcrumb initialPosition={3} />

          {children}
        </Stack>
      </Stack>
    </WhiteLabelWrapper>
  )
}
