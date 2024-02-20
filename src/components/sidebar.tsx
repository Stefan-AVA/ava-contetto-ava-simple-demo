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
import {
  Box,
  Unstable_Grid2 as Grid,
  Stack,
  SwipeableDrawer,
  Typography,
} from "@mui/material"
import { ChevronLeft, MessageCircle, User } from "lucide-react"

import Rooms from "./rooms"

type Router = {
  icon: JSX.Element
  path?: string
  label: string
  active: boolean
  onClick?: () => void
  badge?: number
}

interface SidebarProps {
  name: string
  email: string | null
  routes: Router[]
}

type MobileRoute = {
  icon: JSX.Element
  label: string
  path?: Route
}

export default function Sidebar({ name, email, routes }: SidebarProps) {
  const [minimize, setMinimize] = useState(false)
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

  const mobileRoutes = routes.map((route) =>
    route.label === "Messages"
      ? {
          icon: route.icon,
          label: route.label,
        }
      : route
  ) as MobileRoute[]

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
          pt: minimize ? 10 : 3.5,
          pb: 3.5,
          px: minimize ? 2 : 3,
          width: minimize ? "5rem" : "19.5rem",
          height: "calc(100vh - 4rem)",
          display: { xs: "none", lg: "flex" },
          minWidth: minimize ? "5rem" : "19.5rem",
          overflowY: "auto",
          alignItems: "center",
          transition: "all .3s ease-in-out",
          borderRight: "1px solid",
          borderRightColor: "gray.300",
        }}
      >
        <Stack
          sx={{
            width: "2.25rem",
            border: "1px solid",
            minHeight: "2.25rem",
            alignItems: "center",
            marginLeft: "auto",
            borderColor: "gray.300",
            borderRadius: "50%",
            justifyContent: "center",
          }}
          onClick={() => setMinimize((prev) => !prev)}
          component="button"
        >
          <Box
            sx={{
              color: "gray.700",
              transform: minimize ? "rotate(180deg)" : "rotate(0deg)",
              transition: "all .3s ease-in-out",
            }}
            size={16}
            component={ChevronLeft}
          />
        </Stack>

        <Stack
          sx={{
            mt: 2,
            width: minimize ? "4rem" : "8rem",
            border: "2px solid",
            minHeight: minimize ? "4rem" : "8rem",
            transition: "all .3s ease-in-out",
            alignItems: "center",
            borderColor: "gray.200",
            borderRadius: "50%",
            justifyContent: "center",
          }}
        >
          <Stack
            sx={{
              width: minimize ? "3rem" : "6.5rem",
              height: minimize ? "3rem" : "6.5rem",
              bgcolor: "gray.200",
              transition: "all .3s ease-in-out",
              alignItems: "center",
              borderRadius: "50%",
              justifyContent: "center",
            }}
          >
            <Box
              sx={{ color: "gray.500" }}
              size={minimize ? 24 : 32}
              component={User}
            />
          </Stack>
        </Stack>

        {!minimize && (
          <Typography
            sx={{
              mt: 2,
              color: "gray.700",
              textAlign: "center",
              fontWeight: 700,
            }}
          >
            {name}
          </Typography>
        )}

        {email && !minimize && (
          <Typography
            sx={{ color: "gray.500", textAlign: "center" }}
            variant="body2"
          >
            {email}
          </Typography>
        )}

        <Grid
          sx={{
            mt: 6,
            width: "100%",
            border: "1px solid",
            borderColor: minimize ? "transparent" : "gray.300",
            borderRadius: "1rem",
          }}
          container
        >
          {routes.map(({ label, path, icon, active, onClick, badge }) => (
            <Grid
              sx={
                !minimize
                  ? {
                      ":not(&:nth-child(1)):not(&:nth-child(2))": {
                        borderTop: "1px solid",
                        borderTopColor: "gray.300",
                      },

                      "&:nth-child(odd)": {
                        borderRight: "1px solid",
                        borderRightColor: "gray.300",
                      },
                    }
                  : undefined
              }
              xs={minimize ? 12 : 6}
              key={label}
            >
              <Stack
                sx={{
                  py: minimize ? 2 : 4,
                  px: minimize ? 2 : 3,
                  mb: 1,
                  gap: 1.5,
                  color: active ? "gray.700" : "gray.500",
                  bgcolor: active ? "background.default" : "transparent",
                  boxShadow: active
                    ? "4px 4px 16px rgba(0, 0, 0, .1)"
                    : undefined,
                  transform: active ? "scale(1.1)" : "scale(1)",
                  transition: "all .3s ease-in-out",
                  alignItems: "center",
                  ":hover": {
                    cursor: "pointer",
                  },
                }}
                href={path as Route}
                onClick={onClick}
                component={path ? Link : "div"}
              >
                {icon}

                {!minimize && (
                  <Typography
                    sx={{ textAlign: "center", fontWeight: 500 }}
                    variant="caption"
                  >
                    {label}
                  </Typography>
                )}

                {badge && badge > 0 ? (
                  <Stack
                    sx={{
                      top: "-.5rem",
                      right: "-.5rem",
                      width: "1.25rem",
                      height: "1.25rem",
                      zIndex: 2,
                      position: "absolute",
                      alignItems: "center",
                      borderRadius: "50%",
                      justifyContent: "center",
                      backgroundColor: "secondary.main",
                    }}
                  >
                    <Typography
                      sx={{
                        color: "white",
                        textAlign: "center",
                        fontWeight: 500,
                      }}
                      variant="caption"
                    >
                      {badge}
                    </Typography>
                  </Stack>
                ) : undefined}
              </Stack>
            </Grid>
          ))}
        </Grid>
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
