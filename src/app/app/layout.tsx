"use client"

import {
  Suspense,
  useEffect,
  useRef,
  useState,
  type KeyboardEvent,
  type MouseEvent,
  type PropsWithChildren,
} from "react"
import { Route } from "next"
import {
  useParams,
  usePathname,
  useRouter,
  useSearchParams,
} from "next/navigation"
import { useLazyGetMeQuery } from "@/redux/apis/auth"
import { useLazyGetOrgsQuery } from "@/redux/apis/org"
import { useLazyGetAllRoomsQuery } from "@/redux/apis/room"
import { logout, setOrgs } from "@/redux/slices/app"
import { useAppDispatch, type RootState } from "@/redux/store"
import { Box, CircularProgress, Stack } from "@mui/material"
import { useSelector } from "react-redux"

import { AgentRole } from "@/types/agentProfile.types"

import { SIDEBAR_WIDTH } from "./consts"
import Nav from "./nav"
import CreateOrgModal from "./nav/createOrg"
import Sidebar from "./nav/sidebar"

function AuthLayout({ children }: PropsWithChildren) {
  const initialized = useRef(false)

  const { agentId, contactId } = useParams()
  const { replace } = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const queryParams = searchParams.toString()

  const [isDrawerOpen, setIsDrawerOpen] = useState(false)
  const [openCreateOrgModal, setOpenCreateOrgModal] = useState(false)

  const dispatch = useAppDispatch()

  const state = useSelector((state: RootState) => state.app)

  const [getme, { isLoading: isLoadingMe }] = useLazyGetMeQuery()
  const [getOrgs, { isLoading: isLoadingOrgs }] = useLazyGetOrgsQuery()
  const [getAllRooms, { isLoading: isLoadingRooms }] = useLazyGetAllRoomsQuery()

  const isLoading =
    isLoadingMe ||
    isLoadingOrgs ||
    isLoadingRooms ||
    (state.agentOrgs.length <= 0 && state.contactOrgs.length <= 0)

  useEffect(() => {
    if (agentId || contactId) setIsDrawerOpen(false)
  }, [agentId, contactId])

  useEffect(() => {
    async function run() {
      if (!initialized.current) {
        initialized.current = true

        try {
          await getme().unwrap()
          const orgs = await getOrgs().unwrap()
          await getAllRooms().unwrap()

          dispatch(setOrgs(orgs))

          if (!agentId && !contactId) {
            const ownerAgent = orgs.agentProfiles.find(
              (agent) => agent.role === AgentRole.owner
            )
            replace(`/app/agent-orgs/${ownerAgent?._id}` as Route)
          }
        } catch (error) {
          console.log("error ===>", error)
          dispatch(logout())
          replace(`/?_next=${pathname}${queryParams ? `&${queryParams}` : ""}`)
        }
      }
    }

    run()
  }, [replace, dispatch, getme, getOrgs, agentId, contactId])

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
    <Box
      sx={{
        pb: { xs: 10, lg: 0 },
        display: "flex",
      }}
    >
      <Sidebar
        loading={isLoading}
        toggleDrawer={toggleDrawer}
        isDrawerOpen={isDrawerOpen}
        setOpenCreateOrgModal={setOpenCreateOrgModal}
      />

      <Box
        sx={{
          pl: {
            xs: 0,
            lg: `${SIDEBAR_WIDTH}px`,
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

      <CreateOrgModal
        open={openCreateOrgModal}
        setOpenCreateOrgModal={setOpenCreateOrgModal}
      />
    </Box>
  )
}

export default function Layout({ children }: PropsWithChildren) {
  return (
    <Suspense>
      <AuthLayout>{children}</AuthLayout>
    </Suspense>
  )
}
