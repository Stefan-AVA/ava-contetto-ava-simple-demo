"use client"

import { type KeyboardEvent, type MouseEvent } from "react"
import Image from "next/image"
import Link from "next/link"
import { useParams, useRouter } from "next/navigation"
import { logout } from "@/redux/slices/app"
import { RootState, useAppDispatch } from "@/redux/store"
import { nameInitials } from "@/utils/format-name"
import {
  Box,
  CircularProgress,
  Drawer,
  Stack,
  Tooltip,
  Typography,
  Zoom,
} from "@mui/material"
import ContettoLogo from "~/assets/logo.png"
import { Plus, Power } from "lucide-react"
import { useSelector } from "react-redux"

import { SIDEBAR_WIDTH } from "../consts"

interface ISidebar {
  loading: boolean
  toggleDrawer: (event?: KeyboardEvent | MouseEvent) => void
  isDrawerOpen: boolean
  setOpenCreateOrgModal: Function
}

interface ISidebarList {
  expand?: boolean
  toggleDrawer?: (event?: KeyboardEvent | MouseEvent) => void
  setOpenCreateOrgModal: Function
}

function SidebarList({
  expand = false,
  toggleDrawer,
  setOpenCreateOrgModal,
}: ISidebarList) {
  const { agentId, contactId } = useParams()

  const agentOrgs = useSelector((state: RootState) => state.app.agentOrgs)
  const contactOrgs = useSelector((state: RootState) => state.app.contactOrgs)

  return (
    <>
      {agentOrgs.map((agent) => (
        <Link
          key={agent._id}
          href={`/app/agent-orgs/${agent._id}`}
          onClick={() => {
            if (toggleDrawer) toggleDrawer()
          }}
          style={{ width: "100%" }}
        >
          <Stack
            sx={{ color: "white", alignItems: "center" }}
            spacing={2}
            direction="row"
          >
            <Tooltip
              arrow
              title={
                <Box sx={{ p: 1 }}>
                  <Typography
                    sx={{
                      mb: 0.5,
                      fontWeight: 600,
                      textTransform: "captilize",
                    }}
                  >
                    {agent.org?.name}
                  </Typography>
                  <Typography sx={{ color: "gray.500" }} variant="body2">
                    {agent.role}
                  </Typography>
                </Box>
              }
              placement="right"
              TransitionComponent={Zoom}
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
                  overflow: "hidden",
                  justifyContent: "center",
                  ":hover": {
                    cursor: "pointer",
                  },
                  ...(agentId === agent._id && {
                    border: "4px solid rgba(255, 255, 255, 0.8)",
                  }),
                }}
              >
                {agent.org?.logoUrl ? (
                  <Image
                    src={agent.org.logoUrl}
                    alt="logo"
                    width={64}
                    height={64}
                  />
                ) : (
                  <Typography variant="h4">
                    {nameInitials(String(agent.org?.name))}
                  </Typography>
                )}
              </Box>
            </Tooltip>

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
          onClick={() => {
            if (toggleDrawer) toggleDrawer()
          }}
        >
          <Stack
            direction="row"
            spacing={2}
            alignItems="center"
            sx={{ color: "white" }}
          >
            <Tooltip
              arrow
              title={
                <Box sx={{ p: 1 }}>
                  <Typography
                    sx={{
                      mb: 0.5,
                      fontWeight: 600,
                      textTransform: "captilize",
                    }}
                  >
                    {contact.org?.name}
                  </Typography>
                  <Typography sx={{ color: "gray.500" }} variant="body2">
                    Contact of {contact.agentName}
                  </Typography>
                </Box>
              }
              placement="right"
              TransitionComponent={Zoom}
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
                  overflow: "hidden",
                  justifyContent: "center",
                  ":hover": {
                    cursor: "pointer",
                  },
                  ...(contactId === contact._id && {
                    border: "4px solid rgba(255, 255, 255, 0.8)",
                  }),
                }}
              >
                {contact.org?.logoUrl ? (
                  <Image
                    src={contact.org.logoUrl}
                    alt="logo"
                    width={64}
                    height={64}
                  />
                ) : (
                  <Typography variant="h4">
                    {nameInitials(String(contact.org?.name))}
                  </Typography>
                )}
              </Box>
            </Tooltip>

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

      <Box
        sx={{
          mt: 2,
          color: "white",
          ":hover": {
            cursor: "pointer",
          },
        }}
        component={"button"}
        onClick={() => {
          setOpenCreateOrgModal(true)
          if (toggleDrawer) toggleDrawer()
        }}
      >
        <Plus />
      </Box>
    </>
  )
}

export default function Sidebar({
  loading,
  toggleDrawer,
  isDrawerOpen,
  setOpenCreateOrgModal,
}: ISidebar) {
  const { replace } = useRouter()
  const dispatch = useAppDispatch()

  function onLogout() {
    dispatch(logout())

    replace("/")
  }

  return (
    <>
      <Stack
        id="sidebar"
        sx={{
          p: 1.5,
          pt: 18,
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
            lg: "flex",
          },
          bgcolor: "primary.main",
          position: "fixed",
          minHeight: "100vh",
          alignItems: "center",
        }}
        spacing={2}
      >
        <Stack
          sx={{
            py: 2,
            px: 4,
            top: "1.5rem",
            left: 0,
            bgcolor: "white",
            position: "absolute",
            boxShadow: "0px 16px 24px 16px rgba(0, 0, 0, .12)",
            borderTopRightRadius: "1.25rem",
            borderBottomRightRadius: "1.25rem",
          }}
        >
          <Stack href="/" component={Link}>
            <Box sx={{ width: "8rem", height: "3rem", position: "relative" }}>
              <Image
                src={ContettoLogo}
                alt="logo"
                fill
                style={{ objectFit: "contain" }}
                priority
              />
            </Box>
          </Stack>
        </Stack>

        {loading && <CircularProgress size="1.25rem" />}

        {!loading && (
          <SidebarList setOpenCreateOrgModal={setOpenCreateOrgModal} />
        )}

        <Box
          sx={{
            p: 3,
            mt: "auto !important",
            color: "white",
            display: "flex",
          }}
          onClick={onLogout}
          component="button"
        >
          <Power />
        </Box>
      </Stack>

      <Drawer open={isDrawerOpen} onClose={() => toggleDrawer()} keepMounted>
        <Stack
          sx={{
            p: 1.5,
            width: 250,
            zIndex: 5,
            height: "100vh",
            alignItems: "center",
            backgroundColor: "secondary.main",
          }}
          spacing={2}
        >
          <SidebarList
            expand
            toggleDrawer={toggleDrawer}
            setOpenCreateOrgModal={setOpenCreateOrgModal}
          />

          <Box
            sx={{
              p: 3,
              mt: "auto !important",
              color: "white",
              display: "flex",
            }}
            onClick={onLogout}
            component="button"
          >
            <Power />
          </Box>
        </Stack>
      </Drawer>
    </>
  )
}
