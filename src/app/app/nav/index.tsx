"use client"

import React, { useMemo } from "react"
import Image from "next/image"
import Link from "next/link"
import { useParams, useRouter } from "next/navigation"
import { type RootState } from "@/redux/store"
import { Box, CircularProgress, IconButton, Stack } from "@mui/material"
import Logo from "~/assets/logo-ava.png"
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
  const { agentId } = useParams()
  const { push } = useRouter()

  const state = useSelector((state: RootState) => state.app.agentOrgs)

  const agentProfile = useMemo(
    () => state.find((agent) => agent._id === agentId),
    [agentId, state]
  )

  return (
    <Stack
      sx={{
        top: 0,
        width: "100%",
        height: "4rem",
        bgcolor: "white",
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
            display: {
              xs: "flex",
              md: "none",
            },
            padding: 1,
            background: "white",
            color: "black",
            ":hover": {
              background: "white",
            },
          }}
          onClick={toggleDrawer}
        >
          <MenuIcon />
        </IconButton>

        <Stack href="/" component={Link}>
          <Box
            sx={{ width: "100%", height: "2rem", objectFit: "contain" }}
            src={Logo}
            alt="Logo Ava"
            priority
            component={Image}
          />
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
