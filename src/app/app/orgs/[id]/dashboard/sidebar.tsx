import { Route } from "next"
import Image, { type ImageProps } from "next/image"
import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import type { RootState } from "@/redux/store"
import {
  Box,
  Unstable_Grid2 as Grid,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Drawer as MuiDrawer,
  Stack,
  Typography,
} from "@mui/material"
import { CSSObject, styled, Theme } from "@mui/material/styles"
import IconSettings from "~/assets/icon-settings.svg"
import { ChevronRight, Plus } from "lucide-react"
import { useSelector } from "react-redux"

import type { IOrg } from "@/types/org.types"

import routes from "./routes"

const drawerWidth = 312

const openedMixin = (theme: Theme): CSSObject => ({
  width: drawerWidth,
  transition: theme.transitions.create("width", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.enteringScreen,
  }),
  overflowX: "hidden",
})

const closedMixin = (theme: Theme): CSSObject => ({
  width: "5rem",
  overflowX: "hidden",
  transition: theme.transitions.create("width", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
})

const DrawerHeader = styled("div")(({ theme }) => ({
  display: "flex",
  padding: theme.spacing(0, 1),
  alignItems: "center",
  justifyContent: "flex-end",
  ...theme.mixins.toolbar,
}))

const Drawer = styled(MuiDrawer, {
  shouldForwardProp: (prop) => prop !== "open",
})(({ theme, open }) => ({
  width: drawerWidth,
  boxSizing: "border-box",
  flexShrink: 0,
  whiteSpace: "nowrap",
  ...(open && {
    ...openedMixin(theme),
    "& .MuiDrawer-paper": openedMixin(theme),
  }),
  ...(!open && {
    ...closedMixin(theme),
    "& .MuiDrawer-paper": closedMixin(theme),
  }),
}))

interface OrgBlockProps extends IOrg {
  selected: boolean
}

interface SidebarProps {
  orgId: string
}

interface MenuItemProps extends SidebarProps {
  open: boolean
  path: string
  icon: ImageProps["src"]
  label: string
}

function OrgBlock({ _id, name, selected }: OrgBlockProps) {
  return (
    <Stack
      sx={{
        width: "100%",
        height: "4rem",
        border: "4px solid",
        alignItems: "center",
        borderColor: selected ? "green.600" : "gray.400",
        borderRadius: ".75rem",
        justifyContent: "center",
      }}
      href={`/app/orgs/${_id}/dashboard` as Route}
      component={Link}
    >
      <Typography sx={{ fontWeight: 700, textTransform: "uppercase" }}>
        {name[0]}
      </Typography>
    </Stack>
  )
}

function MenuItem({ icon, open, path, label, orgId }: MenuItemProps) {
  const { push } = useRouter()

  return (
    <ListItem
      sx={{ display: "block" }}
      key={label}
      onClick={() => push(`/app/${orgId}/${path}` as Route)}
      disablePadding
    >
      <ListItemButton
        sx={{
          px: 3,
          minHeight: 48,
          justifyContent: open ? "initial" : "center",
        }}
      >
        <ListItemIcon
          sx={{
            mr: open ? 2 : "auto",
            minWidth: 0,
            justifyContent: "center",
          }}
        >
          <Image src={icon} alt="" width={32} height={32} />
        </ListItemIcon>

        <ListItemText primary={label} sx={{ opacity: open ? 1 : 0 }} />
      </ListItemButton>
    </ListItem>
  )
}

export default function Sidebar({ orgId }: SidebarProps) {
  const params = useSearchParams()

  const sidebar = params.get("sidebar")

  const orgs = useSelector((state: RootState) => state.app.orgs)

  const currentOrg = orgs.find((org) => org._id === orgId)

  const openSidebar = sidebar === "open"

  return (
    <Drawer
      sx={{
        display: { xs: "none", md: "inherit" },

        "& .MuiDrawer-paper": {
          bgcolor: "gray.100",
        },
      }}
      open={openSidebar}
      variant="permanent"
    >
      <DrawerHeader sx={{ mb: 3 }}>
        <Box
          sx={{
            color: "white",
            width: "3rem",
            height: "3rem",
            display: "flex",
            bgcolor: "blue.800",
            alignItems: "center",
            borderRadius: "50%",
            justifyContent: "center",
          }}
          href={{ query: { sidebar: sidebar ? "" : "open" } }}
          component={Link}
        >
          <Box
            sx={{
              position: "relative",
              transform: openSidebar ? "rotate(180deg)" : "rotate(0deg)",
              transition: "all .3s ease-in-out",
            }}
            size={16}
            component={ChevronRight}
          />
        </Box>
      </DrawerHeader>

      {openSidebar && currentOrg && (
        <Grid sx={{ px: 3 }} container spacing={2}>
          {orgs.map((org) => (
            <Grid xs={4} key={org._id}>
              <OrgBlock {...org} selected={org._id === currentOrg._id} />
            </Grid>
          ))}

          <Grid xs={4}>
            <Stack
              sx={{
                color: "gray.400",
                width: "2rem",
                height: "4rem",
                alignItems: "center",
                justifyContent: "center",
              }}
              href="/app/orgs/create"
              component={Link}
            >
              <Plus size={20} />
            </Stack>
          </Grid>
        </Grid>
      )}

      {!openSidebar && currentOrg && (
        <Box sx={{ px: 1 }}>
          <OrgBlock {...currentOrg} selected />
        </Box>
      )}

      <List sx={{ mt: 3, gap: 1, display: "flex", flexDirection: "column" }}>
        {routes.map((route) => (
          <MenuItem
            {...route}
            key={route.label}
            open={openSidebar}
            orgId={orgId}
          />
        ))}
      </List>

      <List sx={{ mt: "auto" }}>
        <MenuItem
          icon={IconSettings}
          open={openSidebar}
          path="settings"
          label="(Org) Settings"
          orgId={orgId}
        />
      </List>
    </Drawer>
  )
}
