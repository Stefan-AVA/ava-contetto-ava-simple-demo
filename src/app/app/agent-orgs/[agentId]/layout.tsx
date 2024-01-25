"use client"

import { useMemo, type PropsWithChildren } from "react"
import { useParams, usePathname } from "next/navigation"
import { RootState } from "@/redux/store"
import { Stack } from "@mui/material"
import { Contact, FolderHeart, LayoutDashboardIcon, Search } from "lucide-react"
import { useSelector } from "react-redux"

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
      {
        path: `/app/agent-orgs/${agentId}/folders/me`,
        icon: <FolderHeart />,
        label: "Files",
        active: pathName.includes("folders"),
      },
    ],
    [pathName, agentId]
  )

  const hasWhiteLabelDefined = currentOrg.org?.whiteLabel

  const orgName = currentOrg.org?.name

  return (
    <WhiteLabelWrapper whiteLabel={hasWhiteLabelDefined}>
      <Stack
        sx={{
          p: { xs: 1, md: 0 },
          gap: { xs: 2, md: 0 },
          bgcolor: "background.default",
          flexDirection: { xs: "column", md: "row" },
        }}
      >
        <Sidebar routes={routes} orgName={orgName ?? ""} />

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
