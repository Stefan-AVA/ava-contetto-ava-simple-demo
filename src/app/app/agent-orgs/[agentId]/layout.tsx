"use client"

import { useEffect, useMemo, type PropsWithChildren } from "react"
import { useParams, usePathname } from "next/navigation"
import { initialTheme } from "@/redux/slices/theme"
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
import { components, palette, typography } from "@/styles/theme"

export default function Layout({ children }: PropsWithChildren) {
  const pathName = usePathname()

  const { agentId } = useParams()

  const defaultTheme = useSelector((state: RootState) => state.app.theme)

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

  useEffect(() => {
    const navbar = document.getElementById("navbar")!
    const sidebar = document.getElementById("sidebar")!

    if (defaultTheme.background !== initialTheme.background) {
      navbar.style.backgroundColor = defaultTheme.background
    }

    if (defaultTheme.secondary !== initialTheme.secondary) {
      sidebar.style.backgroundColor = defaultTheme.secondary
    }

    return () => {
      navbar.style.backgroundColor = initialTheme.background
      sidebar.style.backgroundColor = initialTheme.secondary
    }
  }, [defaultTheme.secondary, defaultTheme.background])

  const theme = useMemo(() => {
    if (defaultTheme.fontFamily !== dmsans.style.fontFamily) {
      const link = document.createElement("link")

      link.type = "text/css"
      link.rel = "stylesheet"

      document.head.appendChild(link)

      link.href = `https://fonts.googleapis.com/css2?family=${defaultTheme.fontFamily.replaceAll(
        " ",
        "+"
      )}:wght@400;500;600;700&display=swap`
    }

    const colors = {
      ...palette,
      gray: {
        ...palette.gray,
        500: defaultTheme.description,
        700: defaultTheme.title,
      },
      primary: colorMapper({ main: defaultTheme.primary }),
      secondary: colorMapper({ main: defaultTheme.secondary }),
      background: {
        paper: defaultTheme.background,
        default: defaultTheme.background,
      },
    }

    return createTheme({
      palette: colors,
      components: components(colors),
      typography: {
        ...typography,
        fontFamily: defaultTheme.fontFamily,
      },
    })
  }, [defaultTheme])

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
