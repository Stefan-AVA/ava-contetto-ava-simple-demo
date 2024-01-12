import { useMemo, useState, type JSX } from "react"
import { Route } from "next"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Card, Stack, Typography } from "@mui/material"
import { ListFilter, MessageCircle } from "lucide-react"

import Dropdown from "./drop-down"
import Rooms from "./rooms"

type Router = {
  icon: JSX.Element
  path: string
  label: string
  active: boolean
}

interface SidebarProps {
  routes: Router[]
  orgName: string
}

export default function Sidebar({ routes, orgName }: SidebarProps) {
  const [open, setOpen] = useState(false)

  const pathname = usePathname()

  const findCurrentRoute = useMemo(() => {
    const activeRoute = routes.find((route) => route.active)

    if (activeRoute)
      return {
        icon: activeRoute.icon,
        label: activeRoute.label,
      }

    const isRoomPage = pathname.includes("/rooms")

    if (isRoomPage)
      return {
        icon: <MessageCircle />,
        label: "Messages",
      }

    return null
  }, [routes, pathname])

  return (
    <>
      <Stack
        sx={{
          py: 3.5,
          px: 3,
          height: "calc(100vh - 4rem)",
          display: { xs: "none", md: "flex" },
          minWidth: "16rem",
          overflowY: "auto",
          borderRight: "1px solid",
          borderRightColor: "gray.300",
        }}
      >
        <Typography sx={{ mt: 10, mb: 3, fontWeight: 700 }} variant="h5">
          {orgName}
        </Typography>

        {routes.map(({ label, path, icon, active }) => (
          <Stack
            sx={{
              p: 1,
              mb: 1,
              gap: 1.5,
              color: "gray.700",
              bgcolor: active ? "gray.200" : "background.default",
              alignItems: "center",
              borderRadius: 1.5,
            }}
            key={path}
            href={path as Route}
            component={Link}
            direction="row"
          >
            {icon}
            <Typography sx={{ fontWeight: 500 }}>{label}</Typography>
          </Stack>
        ))}

        <Typography
          sx={{
            mb: 3,
            mt: 4,
            pt: 4,
            color: "gray.500",
            borderTop: "1px solid",
            fontWeight: 500,
            borderTopColor: "gray.300",
          }}
          variant="body2"
        >
          MESSAGING
        </Typography>

        <Rooms />
      </Stack>

      <Dropdown
        open={open}
        onClose={() => setOpen(false)}
        ancher={
          <Stack
            padding={1.5}
            display={{ xs: "flex", md: "none" }}
            alignItems="center"
            justifyContent="space-between"
            direction="row"
            onClick={() => setOpen(true)}
            sx={{
              borderBottom: "1px solid",
              borderBottomColor: "gray.300",
              bgcolor: "gray.200",
              borderRadius: 2,
            }}
          >
            {findCurrentRoute && (
              <Stack direction="row" alignItems="center" spacing={2}>
                {findCurrentRoute.icon}
                <Typography variant="h5" fontWeight={700}>
                  {findCurrentRoute.label}
                </Typography>
              </Stack>
            )}

            <ListFilter />
          </Stack>
        }
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "right",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
      >
        <Card sx={{ padding: 2, width: "calc(100vw - 20px)" }}>
          {routes.map(({ label, path, icon, active }) => (
            <Stack
              sx={{
                p: 1,
                mb: 1,
                gap: 1.5,
                color: "gray.700",
                bgcolor: active ? "gray.200" : "white",
                alignItems: "center",
                borderRadius: 1.5,
              }}
              key={path}
              href={path as Route}
              component={Link}
              direction="row"
              onClick={() => setOpen(false)}
            >
              {icon}
              <Typography sx={{ fontWeight: 500 }}>{label}</Typography>
            </Stack>
          ))}

          <Stack
            sx={{
              mt: 4,
              py: 4,
              px: 1,
              gap: 2,
              color: "gray.500",
              borderTop: "1px solid",
              fontWeight: 500,
              borderTopColor: "gray.300",
            }}
          >
            <Typography
              sx={{
                color: "gray.500",
                fontWeight: 500,
              }}
              variant="body2"
            >
              MESSAGING
            </Typography>

            <Rooms onAction={() => setOpen(false)} />
          </Stack>
        </Card>
      </Dropdown>
    </>
  )
}
