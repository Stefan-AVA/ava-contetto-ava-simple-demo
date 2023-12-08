"use client"

import { useEffect, useMemo, type PropsWithChildren } from "react"
import { useParams, usePathname } from "next/navigation"
import { RootState } from "@/redux/store"
import colorMapper from "@/utils/color-mapper"
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
import { dmsans } from "@/styles/fonts"
import defaultTheme, { components, palette, typography } from "@/styles/theme"
import { initialTheme } from "@/styles/white-label-theme"

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

  useEffect(() => {
    const navbar = document.getElementById("navbar")!
    const sidebar = document.getElementById("sidebar")!

    if (!hasWhiteLabelDefined) return

    if (hasWhiteLabelDefined.background !== initialTheme.background) {
      navbar.style.backgroundColor = hasWhiteLabelDefined.background
    }

    if (hasWhiteLabelDefined.secondary !== initialTheme.secondary) {
      sidebar.style.backgroundColor = hasWhiteLabelDefined.secondary
    }

    return () => {
      navbar.style.backgroundColor = initialTheme.background
      sidebar.style.backgroundColor = initialTheme.secondary
    }
  }, [hasWhiteLabelDefined])

  const theme = useMemo(() => {
    if (!hasWhiteLabelDefined) return defaultTheme

    if (hasWhiteLabelDefined.fontFamily !== dmsans.style.fontFamily) {
      const link = document.createElement("link")

      link.type = "text/css"
      link.rel = "stylesheet"

      document.head.appendChild(link)

      link.href = `https://fonts.googleapis.com/css2?family=${hasWhiteLabelDefined.fontFamily.replaceAll(
        " ",
        "+"
      )}:wght@400;500;600;700&display=swap`
    }

    const colors = {
      ...palette,
      gray: {
        ...palette.gray,
        500: hasWhiteLabelDefined.description || initialTheme.description,
        700: hasWhiteLabelDefined.title || initialTheme.title,
      },
      primary: colorMapper({
        main: hasWhiteLabelDefined.primary || initialTheme.primary,
      }),
      secondary: colorMapper({
        main: hasWhiteLabelDefined.secondary || initialTheme.secondary,
      }),
      background: {
        paper: hasWhiteLabelDefined.background || initialTheme.background,
        default: hasWhiteLabelDefined.background || initialTheme.background,
      },
    }

    return createTheme({
      palette: colors,
      components: components(colors),
      typography: {
        ...typography,
        fontFamily: hasWhiteLabelDefined.fontFamily || initialTheme.fontFamily,
      },
    })
  }, [hasWhiteLabelDefined])

  return (
    <>
      <ThemeProvider theme={theme}>
        <Stack
          sx={{
            p: { xs: 1, md: 0 },
            gap: { xs: 2, md: 0 },
            bgcolor: "background.default",
          }}
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
    </>
  )
}
