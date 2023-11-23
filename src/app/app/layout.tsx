"use client"

import {
  useEffect,
  useState,
  type KeyboardEvent,
  type MouseEvent,
  type PropsWithChildren,
} from "react"
import { Route } from "next"
import { useParams, useRouter } from "next/navigation"
import { useLazyGetMeQuery } from "@/redux/apis/auth"
import { useLazyGetOrgsQuery } from "@/redux/apis/org"
import { logout, setOrgs } from "@/redux/slices/app"
import { useAppDispatch, type RootState } from "@/redux/store"
import { Box, CircularProgress, Stack } from "@mui/material"
import { useSelector } from "react-redux"

import { AgentRole } from "@/types/agentProfile.types"

import { SIDEBAR_WIDTH } from "./consts"
import Nav from "./nav"
import Sidebar from "./sidebar"

export default function Layout({ children }: PropsWithChildren) {
  const { agentId, contactId } = useParams()
  const { replace } = useRouter()

  const [isDrawerOpen, setIsDrawerOpen] = useState(false)

  const dispatch = useAppDispatch()

  const state = useSelector((state: RootState) => state.app)

  const [getme, { isLoading: isLoadingMe }] = useLazyGetMeQuery()
  const [getOrgs, { isLoading: isLoadingOrgs }] = useLazyGetOrgsQuery()

  const isLoading =
    isLoadingMe ||
    isLoadingOrgs ||
    (state.agentOrgs.length <= 0 && state.contactOrgs.length <= 0)

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

  const toggleDrawer = (event?: KeyboardEvent | MouseEvent) => {
    if (
      event &&
      event.type === "keydown" &&
      ((event as KeyboardEvent).key === "Tab" ||
        (event as KeyboardEvent).key === "Shift")
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
          pl: {
            xs: 0,
            md: `${SIDEBAR_WIDTH}px`,
          },
          width: "100%",
        }}
      >
        <Nav loading={isLoading} toggleDrawer={toggleDrawer} />

        <Stack
          sx={{
            flex: 1,
          }}
        >
          {isLoading && (
            <Stack
              sx={{ p: 5, alignItems: "center", justifyContent: "center" }}
            >
              <CircularProgress size="1.25rem" />
            </Stack>
          )}
          {!isLoading && children}
        </Stack>
      </Box>
    </Box>
  )
}
