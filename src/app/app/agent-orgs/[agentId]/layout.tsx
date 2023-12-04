"use client"

import { useMemo, type PropsWithChildren } from "react"
import { useParams, usePathname } from "next/navigation"
import { RootState } from "@/redux/store"
import { Box, Stack } from "@mui/material"
import { createTheme, ThemeProvider } from "@mui/material/styles"
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
import { components, palette, typography } from "@/styles/theme"

export default function Layout({ children }: PropsWithChildren) {
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
        path: `/app/agent-orgs/${agentId}/create-contact`,
        icon: <UserPlus />,
        label: "Create Contact",
        active: pathName.includes("create-contact"),
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

  const theme = useMemo(() => {
    const colors = {
      ...palette,
      // title: "#172832",
      cyan: {
        ...palette.cyan,
        500: "#5A57FF",
      },
      // background: "#FFF",
      // description: "#8C8C8C",
    }

    return createTheme({
      palette: colors,
      components: components(colors),
      typography,
    })
  }, [])

  return (
    <ThemeProvider theme={theme}>
      <Stack
        padding={{ xs: 1, md: 0 }}
        spacing={{ xs: 2, md: 0 }}
        direction={{ xs: "column", md: "row" }}
      >
        <Sidebar routes={routes} />

        <Box
          sx={{
            p: { xs: 1, md: 5 },
            width: "100%",
            height: "calc(100vh - 4rem)",
            overflowY: "auto",
            overflowX: "hidden",
          }}
        >
          <Breadcrumb initialPosition={3} />
          {children}
        </Box>
      </Stack>
    </ThemeProvider>
  )
}
