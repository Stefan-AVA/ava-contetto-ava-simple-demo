"use client"

import React from "react"
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
            sx={{ color: "white", alignItems: "center" }}
            spacing={2}
            direction="row"
          >
            <Box
              sx={{
                color: "white",
                width: 64,
                height: 64,
                bgcolor: "gray.400",
                display: "flex",
                alignItems: "center",
                borderRadius: 2.5,
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
                overflow: "hidden",
                maxWidth: "140px",
                whiteSpace: "nowrap",
                textOverflow: "ellipsis",
              }}
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
                color: "white",
                width: 64,
                height: 64,
                bgcolor: "gray.400",
                display: "flex",
                alignItems: "center",
                borderRadius: 2.5,
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
                maxWidth: "140px",
                overflow: "hidden",
                whiteSpace: "nowrap",
                textOverflow: "ellipsis",
              }}
            >
              {contact.org?.name}
            </Typography>
          </Stack>
        </Link>
      ))}

      <Link href={`/app/orgs/create`}>
        <Box
          sx={{
            mt: 2,
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
          p: 1.5,
          top: 0,
          left: 0,
          width: {
            xs: 0,
            md: SIDEBAR_WIDTH,
          },
          zIndex: 5,
          height: "100%",
          display: {
            xs: "none",
            md: "flex",
          },
          bgcolor: "purple.500",
          position: "fixed",
          minHeight: "100vh",
          alignItems: "center",
        }}
        spacing={2}
      >
        <SidebarList />
      </Stack>

      <Drawer
        open={isDrawerOpen}
        anchor={"left"}
        onClose={() => toggleDrawer()}
      >
        <Stack
          sx={{
            p: 1.5,
            top: 0,
            left: 0,
            width: 250,
            zIndex: 5,
            height: "100vh",
            position: "fixed",
            background: "#5A57FF",
            alignItems: "center",
          }}
          spacing={2}
        >
          <SidebarList expand />
        </Stack>
      </Drawer>
    </>
  )
}

export default Sidebar
