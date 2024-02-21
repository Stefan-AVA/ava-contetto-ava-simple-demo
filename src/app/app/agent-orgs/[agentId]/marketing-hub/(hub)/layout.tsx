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

const routes = [{ path: "/social-media", label: "Social Media" }]

const actions = [
  { path: "/social-media", label: "Templates" },
  { path: "/social-media/saved", label: "Saved" },
]

export default function MarketingHub({ params, children }: PageProps) {
  const pathname = usePathname()

  const basePath = `/app/agent-orgs/${params.agentId}/marketing-hub`

  function activeRoute(path: string) {
    const slice = pathname.replace(basePath, "")

    return slice.includes(path)
  }

  const isTheFirstOnTheList = activeRoute(routes[0].path)

  return (
    <Stack>
      <Stack
        sx={{
          alignItems: "center",
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
                  color: currentRoute ? "gray.700" : "gray.500",
                  cursor: "pointer",
                  position: "relative",
                  borderColor: currentRoute ? "gray.300" : "transparent",
                  borderStyle: "solid",
                  borderTopWidth: "1px",
                  borderLeftWidth: "1px",
                  borderRightWidth: "1px",
                  borderTopLeftRadius: ".5rem",
                  borderTopRightRadius: ".5rem",

                  "::after": {
                    left: 0,
                    width: "100%",
                    bottom: currentRoute ? "-.125rem" : 0,
                    height: ".25rem",
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

        <Stack
          sx={{
            ml: "auto",
            gap: 2,
            alignItems: "center",
            flexDirection: "row",
          }}
        >
          <Typography
            sx={{
              py: 0.75,
              px: 2,
              border: "1px solid",
              bgcolor: "gray.200",
              fontWeight: 600,
              borderColor: "gray.300",
              borderRadius: 1.25,
            }}
            href={`${basePath}/manage-brand` as Route}
            component={Link}
          >
            Manage brand
          </Typography>

          <Typography
            sx={{
              py: 0.75,
              px: 2,
              border: "1px solid",
              bgcolor: "gray.200",
              fontWeight: 600,
              borderColor: "gray.300",
              borderRadius: 1.25,
            }}
            href={`${basePath}/manage-templates` as Route}
            component={Link}
          >
            Manage templates
          </Typography>
        </Stack>
      </Stack>

      <Stack
        sx={{
          p: 3,
          border: "1px solid",
          borderColor: "gray.300",
          borderRadius: ".5rem",
          borderTopLeftRadius: isTheFirstOnTheList ? 0 : ".5rem",
        }}
      >
        <Stack
          sx={{
            mb: 4,
            width: "fit-content",
            border: "1px solid",
            bgcolor: "gray.200",
            alignItems: "center",
            borderColor: "gray.100",
            borderRadius: "5rem",
            flexDirection: "row",
          }}
        >
          {actions.map(({ path, label }) => {
            const route = `${basePath}${path}`

            const currentRoute = route === pathname

            return (
              <Link key={path} href={route as Route}>
                <Typography
                  sx={{
                    py: 1,
                    px: 3,
                    color: currentRoute ? "white" : "gray.700",
                    bgcolor: currentRoute ? "primary.main" : "transparent",
                    fontWeight: currentRoute ? "600" : "400",
                    borderRadius: "5rem",
                  }}
                >
                  {label}
                </Typography>
              </Link>
            )
          })}
        </Stack>

        {children}
      </Stack>
    </Stack>
  )
}
