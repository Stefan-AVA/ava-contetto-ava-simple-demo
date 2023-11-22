"use client"

import { useMemo, type PropsWithChildren } from "react"
import { useParams, usePathname } from "next/navigation"
import { Stack } from "@mui/material"
import { LayoutDashboardIcon, Search } from "lucide-react"

import Sidebar from "@/components/sidebar"

export default function Layout({ children }: PropsWithChildren) {
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
    <Stack direction="row">
      <Sidebar routes={routes} />

      {children}
    </Stack>
  )
}
