import {
  Fragment,
  useMemo,
  useState,
  type JSX,
  type KeyboardEvent,
  type MouseEvent,
} from "react"
import { Route } from "next"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Box, Stack, SwipeableDrawer, Typography } from "@mui/material"
import { MessageCircle, MessageCircleMore } from "lucide-react"

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

type MobileRoute = {
  icon: JSX.Element
  label: string
  path?: Route
}

export default function Sidebar({ routes, orgName }: SidebarProps) {
  const [popupMessage, setPopupMessage] = useState(false)

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

  const mobileRoutes = [
    ...routes,
    {
      icon: <MessageCircleMore />,
      label: "Messages",
    },
  ] as MobileRoute[]

  const toggleDrawer =
    (state: boolean) => (event: KeyboardEvent | MouseEvent) => {
      if (
        event &&
        event.type === "keydown" &&
        ((event as KeyboardEvent).key === "Tab" ||
          (event as KeyboardEvent).key === "Shift")
      ) {
        return
      }

      setPopupMessage(state)
    }

  return (
    <>
      <Stack
        sx={{
          py: 3.5,
          px: 3,
          height: "calc(100vh - 4rem)",
          display: { xs: "none", lg: "flex" },
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
      </Stack>

      <SwipeableDrawer
        anchor="bottom"
        open={popupMessage}
        onClose={toggleDrawer(false)}
        onOpen={toggleDrawer(true)}
      >
        <Stack
          sx={{
            py: 4,
            px: 1,
            gap: 2,
            color: "gray.500",
            width: "100%",
            fontWeight: 500,
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

          <Rooms onAction={() => setPopupMessage(false)} />
        </Stack>
      </SwipeableDrawer>

      <Stack
        sx={{
          px: 4,
          pt: 2,
          pb: 5,
          left: 0,
          width: "100%",
          bottom: 0,
          zIndex: 999,
          display: { xs: "flex", lg: "none" },
          bgcolor: "white",
          position: "fixed",
          borderTop: "1px solid",
          alignItems: "center",
          flexDirection: "row",
          borderTopColor: "gray.300",
          justifyContent: "space-between",
        }}
      >
        {mobileRoutes.map(({ icon, label, path }) => (
          <Fragment key={label}>
            {path && (
              <Box
                sx={{
                  color:
                    findCurrentRoute?.label === label
                      ? "primary.main"
                      : "black",

                  svg: {
                    width: "1.75rem",
                    height: "1.75rem",
                  },
                }}
                href={path as Route}
                component={Link}
              >
                {icon}
              </Box>
            )}

            {!path && (
              <Box
                sx={{
                  color: popupMessage ? "primary.main" : "black",
                  border: "none",

                  svg: {
                    width: "1.75rem",
                    height: "1.75rem",
                  },
                }}
                onClick={() => setPopupMessage(true)}
                component="button"
              >
                {icon}
              </Box>
            )}
          </Fragment>
        ))}
      </Stack>
    </>
  )
}
