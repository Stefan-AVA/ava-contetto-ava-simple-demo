"use client"

import type { PropsWithChildren } from "react"
import { Route } from "next"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Stack, Typography } from "@mui/material"

interface PageProps extends PropsWithChildren {
  params: {
    agentId: string
    contact_id: string
  }
}

const routes = [
  { path: "/foragent", label: "Private" },
  { path: "/forcontact", label: "For Contact" },
]

export default function FolderLayout({
  params: { agentId, contact_id },
  children,
}: PageProps) {
  const pathname = usePathname()

  const basePath = `/app/agent-orgs/${agentId}/contacts/${contact_id}/folders`

  function activeRoute(path: string) {
    const slice = pathname.replace(basePath, "")

    return slice.includes(path)
  }

  return (
    <Stack>
      <Stack direction="row" alignItems="center" spacing={2}>
        {routes.map(({ path, label }) => (
          <Link key={label} href={`${basePath}${path}` as Route}>
            <Typography
              sx={{
                width: 120,
                height: 44,
                borderRadius: 12,
                border: "1px solid black",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: activeRoute(path) ? "white" : "black",
                background: activeRoute(path) ? "#4B628E" : "white",
              }}
            >
              {label}
            </Typography>
          </Link>
        ))}
      </Stack>

      <Stack
        sx={{
          pt: 2,
        }}
      >
        {children}
      </Stack>
    </Stack>
  )
}
