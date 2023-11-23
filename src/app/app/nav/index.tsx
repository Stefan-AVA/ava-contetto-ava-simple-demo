"use client"

import React, { useMemo } from "react"
import Image from "next/image"
import Link from "next/link"
import { useParams } from "next/navigation"
import { type RootState } from "@/redux/store"
import { Box, CircularProgress, IconButton, Stack } from "@mui/material"
import Logo from "~/assets/logo-ava.png"
import { MenuIcon } from "lucide-react"
import { useSelector } from "react-redux"

import CreateClient from "./create-client"
import Search from "./search"
import Menu from "./user-menu"

interface INav {
  loading: boolean
  toggleDrawer: (event?: React.KeyboardEvent | React.MouseEvent) => void
}

export default function Nav({ loading, toggleDrawer }: INav) {
  const { agentId } = useParams()

  const state = useSelector((state: RootState) => state.app)

  const agentProfile = useMemo(
    () => state.agentOrgs.find((agent) => agent._id === agentId),
    [agentId, state.agentOrgs]
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
          pl: 3.5,
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
          }}
          onClick={toggleDrawer}
        >
          <MenuIcon />
        </IconButton>

        <Stack href="/" component={Link}>
          <Box
            sx={{ width: "100%", height: "2rem" }}
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
            {agentProfile && <Search orgId={agentProfile.orgId} />}

            {agentProfile && <CreateClient orgId={agentProfile.orgId} />}

            <Menu />
          </>
        )}
      </Stack>
    </Stack>
  )
}