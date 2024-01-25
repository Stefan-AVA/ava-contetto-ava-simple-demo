"use client"

import type { PropsWithChildren } from "react"
import { Route } from "next"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Stack, Typography } from "@mui/material"

interface PageProps extends PropsWithChildren {
  params: {
    agentId: string
  }
}

const routes = [
  { path: "/shared", label: "Shared files" },
  { path: "/me", label: "My files" },
]

export default function FolderLayout({ params, children }: PageProps) {
  const pathname = usePathname()

  const basePath = `/app/agent-orgs/${params.agentId}/folders`

  function activeRoute(path: string) {
    const slice = pathname.replace(basePath, "")

    return path === slice
  }

  const isTheFirstOnTheList = activeRoute(routes[0].path)

  return (
    <Stack>
      <Stack
        sx={{
          flexDirection: "row",
        }}
      >
        {routes.map(({ path, label }) => {
          const currentRoute = activeRoute(path)

          return (
            <Link key={label} href={`${basePath}${path}` as Route}>
              <Typography
                sx={{
                  py: 2,
                  px: 5,
                  color: currentRoute ? "gray.800" : "gray.500",
                  cursor: "pointer",
                  position: "relative",
                  borderColor: currentRoute ? "gray.300" : "transparent",
                  borderStyle: "solid",
                  borderTopWidth: "1px",
                  borderLeftWidth: "1px",
                  borderRightWidth: "1px",
                  borderTopLeftRadius: "1rem",
                  borderTopRightRadius: "1rem",

                  "::after": {
                    left: 0,
                    width: "100%",
                    bottom: currentRoute ? "-.0625rem" : 0,
                    height: ".125rem",
                    bgcolor: "white",
                    content: "''",
                    position: "absolute",
                  },
                }}
              >
                {label}
              </Typography>
            </Link>
          )
        })}
      </Stack>

      <Stack
        sx={{
          p: 3,
          border: "1px solid",
          borderColor: "gray.300",
          borderRadius: "1rem",
          borderTopLeftRadius: isTheFirstOnTheList ? 0 : "1rem",
        }}
      >
        {children}
      </Stack>
    </Stack>
  )
}
