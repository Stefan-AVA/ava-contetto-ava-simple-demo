"use client"

import React, { useEffect, useState, type PropsWithChildren } from "react"
import { Route } from "next"
import { useParams, useRouter } from "next/navigation"
import { useLazyGetMeQuery } from "@/redux/apis/auth"
import { useLazyGetOrgsQuery } from "@/redux/apis/org"
import { logout, setOrgs } from "@/redux/slices/app"
import { useAppDispatch } from "@/redux/store"
import { Box, Stack } from "@mui/material"

import { AgentRole } from "@/types/agentProfile.types"

import { SIDEBAR_WIDTH } from "./consts"
import Nav from "./nav"
import Sidebar from "./sidebar"

export default function Layout({ children }: PropsWithChildren) {
  const { agentId, contactId } = useParams()
  const { replace } = useRouter()

  const [isDrawerOpen, setIsDrawerOpen] = useState(false)

  const dispatch = useAppDispatch()

  const [getme, { isLoading: isLoadingMe }] = useLazyGetMeQuery()
  const [getOrgs, { isLoading: isLoadingOrgs }] = useLazyGetOrgsQuery()
  const isLoading = isLoadingMe || isLoadingOrgs

  useEffect(() => {
    if (agentId || contactId) setIsDrawerOpen(false)
  }, [agentId, contactId])

  useEffect(() => {
    async function run() {
      try {
        await getme().unwrap()
        const orgs = await getOrgs().unwrap()

        dispatch(setOrgs(orgs))

        if (!agentId && !contactId) {
          const ownerAgent = orgs.agentProfiles.find(
            (agent) => agent.role === AgentRole.owner
          )
          replace(`/app/agent-orgs/${ownerAgent?._id}` as Route)
        }
      } catch (error) {
        dispatch(logout())
        replace("/")
      }
    }

    run()
  }, [replace, dispatch, getme, getOrgs])

  const toggleDrawer = (event?: React.KeyboardEvent | React.MouseEvent) => {
    if (
      event &&
      event.type === "keydown" &&
      ((event as React.KeyboardEvent).key === "Tab" ||
        (event as React.KeyboardEvent).key === "Shift")
    ) {
      return
    }

    setIsDrawerOpen(!isDrawerOpen)
  }

  return (
    <Box sx={{ display: "flex" }}>
      <Sidebar
        loading={isLoading}
        toggleDrawer={toggleDrawer}
        isDrawerOpen={isDrawerOpen}
      />

      <Box
        sx={{
          flex: 1,
          pl: {
            xs: 0,
            md: `${SIDEBAR_WIDTH}px`,
          },
        }}
      >
        <Nav loading={isLoading} toggleDrawer={toggleDrawer} />

        <Stack
          sx={{
            flex: 1,
          }}
        >
          {children}
        </Stack>
      </Box>
    </Box>
  )
}
