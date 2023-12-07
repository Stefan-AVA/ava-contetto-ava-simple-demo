"use client"

import React, { useMemo } from "react"
import Image from "next/image"
import Link from "next/link"
import { useParams, useRouter } from "next/navigation"
import { type RootState } from "@/redux/store"
import { Box, CircularProgress, IconButton, Stack } from "@mui/material"
import AVALogo from "~/assets/logo-ava.png"
import { MenuIcon } from "lucide-react"
import { useSelector } from "react-redux"

import { IContact } from "@/types/contact.types"
import ContactSearch from "@/components/ContactSearch"

import Menu from "./user-menu"

interface INav {
  loading: boolean
  toggleDrawer: (event?: React.KeyboardEvent | React.MouseEvent) => void
}

export default function Nav({ loading, toggleDrawer }: INav) {
  const { agentId, contactId } = useParams()
  const { push } = useRouter()

  const agentOrgs = useSelector((state: RootState) => state.app.agentOrgs)
  const contactOrgs = useSelector((state: RootState) => state.app.contactOrgs)

  const agentProfile = useMemo(
    () => agentOrgs.find((agent) => agent._id === agentId),
    [agentId, agentOrgs]
  )

  const contact = useMemo(
    () => contactOrgs.find((contact) => contact._id === contactId),
    [agentId, contactOrgs]
  )

  const orgLogo = useMemo(
    () => agentProfile?.org?.logoUrl || contact?.org?.logoUrl,
    [agentProfile, contact]
  )

  return (
    <Stack
      id="navbar"
      sx={{
        top: 0,
        width: "100%",
        height: "4rem",
        bgcolor: "background.default",
        position: "sticky",
        transition: "all .3s ease-in-out",
        alignItems: "center",
        borderBottom: "1px solid",
        flexDirection: "row",
        justifyContent: "space-between",
        borderBottomColor: "gray.300",
      }}
    >
      <Stack
        sx={{
          pl: 1.5,
          gap: 1,
          height: "100%",
          alignItems: "center",
        }}
        direction="row"
      >
        <IconButton
          sx={{
            p: 1,
            color: "gray.700",
            bgcolor: "white",
            display: {
              xs: "flex",
              md: "none",
            },

            ":hover": {
              bgcolor: "white",
            },
          }}
          onClick={toggleDrawer}
        >
          <MenuIcon />
        </IconButton>

        <Stack href="/" component={Link}>
          <Box sx={{ width: "100px", height: "2rem", position: "relative" }}>
            <Image
              src={orgLogo || AVALogo}
              alt="logo"
              fill
              objectFit="contain"
              priority
            />
          </Box>
        </Stack>
      </Stack>

      <Stack
        sx={{
          pr: 3.5,
          gap: 2,
          flex: 1,
          alignItems: "center",
          flexDirection: "row",
          justifyContent: "flex-end",
        }}
      >
        {loading && <CircularProgress size="1.25rem" />}
        {!loading && (
          <>
            {agentProfile && (
              <ContactSearch
                orgId={agentProfile.orgId}
                onContactChanged={(contact: IContact) => {
                  push(`/app/agent-orgs/${agentId}/contacts/${contact._id}`)
                }}
                showOnlyDropdown={false}
              />
            )}

            <Menu />
          </>
        )}
      </Stack>
    </Stack>
  )
}
