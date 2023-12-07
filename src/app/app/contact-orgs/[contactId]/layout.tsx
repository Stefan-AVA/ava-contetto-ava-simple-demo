"use client"

import { useMemo, type PropsWithChildren } from "react"
import { useParams, usePathname } from "next/navigation"
import { Box, Stack } from "@mui/material"
import { LayoutDashboardIcon, Search } from "lucide-react"

import Sidebar from "@/components/sidebar"

export default function Layout({ children }: PropsWithChildren) {
  const pathName = usePathname()
  const { contactId } = useParams()

  const routes = useMemo(
    () => [
      {
        label: "Search",
        path: `/app/contact-orgs/${contactId}`,
        icon: <LayoutDashboardIcon />,
        active: pathName === `/app/contact-orgs/${contactId}`,
      },
      {
        label: "My Searches",
        path: `/app/contact-orgs/${contactId}/search-results`,
        icon: <Search />,
        active: pathName.includes("search-results"),
      },
    ],
    [pathName, contactId]
  )

  return (
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
          height: { xs: "calc(100vh - 11rem)", md: "calc(100vh - 4rem)" },
          overflowY: "auto",
          overflowX: "hidden",
        }}
      >
        {children}
      </Box>
    </Stack>
  )
}
