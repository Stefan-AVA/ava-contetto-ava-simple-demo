"use client"

import Link from "next/link"
import { useParams } from "next/navigation"
import { RootState } from "@/redux/store"
import { nameInitials } from "@/utils/format-name"
import { Box, Drawer, Stack, Typography } from "@mui/material"
import { Plus } from "lucide-react"
import { useSelector } from "react-redux"

import { SIDEBAR_WIDTH } from "./consts"

interface ISidebar {
  loading: boolean
  toggleDrawer: (event?: React.KeyboardEvent | React.MouseEvent) => void
  isDrawerOpen: boolean
}

interface ISidebarList {
  expand?: boolean
}

const SidebarList = ({ expand = false }: ISidebarList) => {
  const { agentId, contactId } = useParams()

  const agentOrgs = useSelector((state: RootState) => state.app.agentOrgs)
  const contactOrgs = useSelector((state: RootState) => state.app.contactOrgs)

  return (
    <>
      {agentOrgs.map((agent) => (
        <Link
          key={agent._id}
          href={`/app/agent-orgs/${agent._id}`}
          style={{ width: "100%" }}
        >
          <Stack
            direction="row"
            spacing={2}
            alignItems="center"
            sx={{ color: "white" }}
          >
            <Box
              sx={{
                width: 64,
                height: 64,
                borderRadius: 2,
                background: "gray",
                color: "white",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                ":hover": {
                  cursor: "pointer",
                },
                ...(agentId === agent._id && {
                  border: "4px solid rgba(255, 255, 255, 0.8)",
                }),
              }}
            >
              <Typography variant="h4">
                {nameInitials(String(agent.org?.name))}
              </Typography>
            </Box>
            <Typography
              sx={{
                display: expand ? "block" : "none",
                textOverflow: "ellipsis",
                overflow: "hidden",
                whiteSpace: "nowrap",
                maxWidth: "140px",
              }}
              variant="body1"
            >
              {agent.org?.name}
            </Typography>
          </Stack>
        </Link>
      ))}

      {contactOrgs.map((contact) => (
        <Link
          key={contact._id}
          href={`/app/contact-orgs/${contact._id}`}
          style={{ width: "100%" }}
        >
          <Stack
            direction="row"
            spacing={2}
            alignItems="center"
            sx={{ color: "white" }}
          >
            <Box
              sx={{
                width: 64,
                height: 64,
                borderRadius: 2,
                background: "gray",
                color: "white",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                ":hover": {
                  cursor: "pointer",
                },
                ...(contactId === contact._id && {
                  border: "4px solid rgba(255, 255, 255, 0.8)",
                }),
              }}
            >
              <Typography variant="h4">
                {nameInitials(String(contact.org?.name))}
              </Typography>
            </Box>
            <Typography
              sx={{
                display: expand ? "block" : "none",
                textOverflow: "ellipsis",
                overflow: "hidden",
                whiteSpace: "nowrap",
                maxWidth: "140px",
              }}
              variant="body1"
            >
              {contact.org?.name}
            </Typography>
          </Stack>
        </Link>
      ))}

      <Link href={`/app/orgs/create`}>
        <Box
          sx={{
            marginTop: 2,
            color: "white",
            ":hover": {
              cursor: "pointer",
            },
          }}
        >
          <Plus />
        </Box>
      </Link>
    </>
  )
}
const Sidebar = ({ loading, toggleDrawer, isDrawerOpen }: ISidebar) => {
  // handle loading status properly
  return (
    <>
      <Stack
        sx={{
          position: "fixed",
          top: 0,
          left: 0,
          width: {
            xs: 0,
            md: SIDEBAR_WIDTH,
          },
          height: "100vh",
          background: "#5A57FF",
          padding: 1.5,
          zIndex: 5,
          display: {
            xs: "none",
            md: "flex",
          },
        }}
        spacing={2}
        alignItems="center"
      >
        <SidebarList />
      </Stack>
      <Drawer
        anchor={"left"}
        open={isDrawerOpen}
        onClose={() => toggleDrawer()}
      >
        <Stack
          sx={{
            position: "fixed",
            top: 0,
            left: 0,
            width: 250,
            height: "100vh",
            background: "#5A57FF",
            padding: 1.5,
            zIndex: 5,
          }}
          spacing={2}
          alignItems="center"
        >
          <SidebarList expand />
        </Stack>
      </Drawer>
    </>
  )
}

export default Sidebar
