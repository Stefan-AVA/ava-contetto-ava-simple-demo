import * as React from "react"
import { Route } from "next"
import Link from "next/link"
import type { RootState } from "@/redux/store"
import { Box, Unstable_Grid2 as Grid, Stack, Typography } from "@mui/material"
import Divider from "@mui/material/Divider"
import MuiDrawer from "@mui/material/Drawer"
import List from "@mui/material/List"
import ListItem from "@mui/material/ListItem"
import ListItemButton from "@mui/material/ListItemButton"
import ListItemIcon from "@mui/material/ListItemIcon"
import ListItemText from "@mui/material/ListItemText"
import { CSSObject, styled, Theme } from "@mui/material/styles"
import { ChevronRight } from "lucide-react"
import { useSelector } from "react-redux"

import type { IOrg } from "@/types/org.types"

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

export default function Sidebar({ orgId }: SidebarProps) {
  const [open, setOpen] = React.useState(false)

  const orgs = useSelector((state: RootState) => state.app.orgs)

  const currentOrg = orgs.find((org) => org._id === orgId)

  return (
    <Drawer variant="permanent" open={open}>
      <DrawerHeader>
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
          type="button"
          onClick={() => setOpen((prev) => !prev)}
          component="button"
        >
          <Box
            sx={{
              position: "relative",
              transform: open ? "rotate(180deg)" : "rotate(0deg)",
              transition: "all .3s ease-in-out",
            }}
            size={16}
            component={ChevronRight}
          />
        </Box>
      </DrawerHeader>

      {open && currentOrg && (
        <Grid sx={{ px: 3 }} container spacing={2}>
          {orgs.map((org) => (
            <Grid xs={4} key={org._id}>
              <OrgBlock {...org} selected={org._id === currentOrg._id} />
            </Grid>
          ))}
        </Grid>
      )}

      {!open && currentOrg && (
        <Box sx={{ px: 1 }}>
          <OrgBlock {...currentOrg} selected />
        </Box>
      )}

      <List>
        {["Inbox", "Starred", "Send email", "Drafts"].map((text, index) => (
          <ListItem key={text} disablePadding sx={{ display: "block" }}>
            <ListItemButton
              sx={{
                minHeight: 48,
                justifyContent: open ? "initial" : "center",
                px: 2.5,
              }}
            >
              <ListItemIcon
                sx={{
                  minWidth: 0,
                  mr: open ? 3 : "auto",
                  justifyContent: "center",
                }}
              >
                {/* {index % 2 === 0 ? <InboxIcon /> : <MailIcon />} */}
              </ListItemIcon>
              <ListItemText primary={text} sx={{ opacity: open ? 1 : 0 }} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
      <Divider />
      <List>
        {["All mail", "Trash", "Spam"].map((text, index) => (
          <ListItem key={text} disablePadding sx={{ display: "block" }}>
            <ListItemButton
              sx={{
                minHeight: 48,
                justifyContent: open ? "initial" : "center",
                px: 2.5,
              }}
            >
              <ListItemIcon
                sx={{
                  minWidth: 0,
                  mr: open ? 3 : "auto",
                  justifyContent: "center",
                }}
              >
                {/* {index % 2 === 0 ? <InboxIcon /> : <MailIcon />} */}
              </ListItemIcon>
              <ListItemText primary={text} sx={{ opacity: open ? 1 : 0 }} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Drawer>
  )
}
