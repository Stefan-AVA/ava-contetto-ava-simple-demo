"use client"

import { useCallback, useMemo, type PropsWithChildren } from "react"
import { Route } from "next"
import { useParams, usePathname, useRouter } from "next/navigation"
import { setCurrentRoom } from "@/redux/slices/room"
import { RootState, useAppDispatch } from "@/redux/store"
import { Stack } from "@mui/material"
import {
  Contact,
  FolderHeart,
  LayoutDashboardIcon,
  MessageCircleMore,
  Search,
  Table2,
} from "lucide-react"
import { useSelector } from "react-redux"

import useGetOrgRooms from "@/hooks/use-get-org-rooms"
import Breadcrumb from "@/components/breadcrumb"
import Sidebar from "@/components/sidebar"
import WhiteLabelWrapper from "@/components/white-label-wrapper"

export default function Layout({ children }: PropsWithChildren) {
  const { push } = useRouter()

  const pathName = usePathname()

  const { agentId, templateId } = useParams()

  const agentOrgs = useSelector((state: RootState) => state.app.agentOrgs)

  const currentOrg = useMemo(
    () => agentOrgs.find((agent) => agent._id === agentId)!,
    [agentId, agentOrgs]
  )

  const rooms = useGetOrgRooms({
    agentId: agentId as string,
  })

  const dispatch = useAppDispatch()

  const onRoomChange = useCallback(() => {
    const baseURL = `/app/agent-orgs/${agentId}/rooms` as Route

    const sortRooms = rooms
      ? rooms.sort((a, b) => (a.createdAt >= b.createdAt ? 1 : -1))
      : null

    if (!sortRooms || (sortRooms && sortRooms.length <= 0)) {
      push(baseURL)

      return
    }

    const currRoom = sortRooms[0]

    dispatch(setCurrentRoom(currRoom))

    push(`${baseURL}/${currRoom._id}` as Route)
  }, [agentId, dispatch, push, rooms])

  const unReadMessages = useMemo(
    () =>
      rooms && currentOrg
        ? rooms.reduce(
            (total, room) => total + room.userStatus[currentOrg.username].notis,
            0
          )
        : 0,
    [rooms]
  )

  const routes = useMemo(
    () => [
      {
        path: `/app/agent-orgs/${agentId}`,
        icon: <LayoutDashboardIcon />,
        label: "Search",
        active: pathName === `/app/agent-orgs/${agentId}`,
      },
      {
        path: `/app/agent-orgs/${agentId}/contacts`,
        icon: <Contact />,
        label: "Contacts",
        active: pathName.includes("contacts"),
      },
      {
        path: `/app/agent-orgs/${agentId}/search-results`,
        icon: <Search />,
        label: "My Searches",
        active: pathName.includes("search-results"),
      },
      {
        icon: <MessageCircleMore />,
        label: "Messages",
        active: pathName.includes("rooms"),
        onClick: onRoomChange,
        badge: unReadMessages,
      },
      {
        path: `/app/agent-orgs/${agentId}/folders/me`,
        icon: <FolderHeart />,
        label: "Files",
        active: pathName.includes("folders"),
      },
      {
        path: `/app/agent-orgs/${agentId}/marketing-hub/social-media`,
        icon: <Table2 />,
        label: "Marketing Hub",
        active: pathName.includes("marketing-hub"),
      },
    ],
    [pathName, agentId, onRoomChange]
  )

  const hasWhiteLabelDefined = currentOrg.org?.whiteLabel

  const isRoomPath = pathName.includes("/rooms")

  return (
    <WhiteLabelWrapper whiteLabel={hasWhiteLabelDefined}>
      <Stack
        sx={{
          p: { xs: 1, lg: 0 },
          gap: { xs: 2, lg: 0 },
          bgcolor: "background.default",
          flexDirection: { xs: "column", lg: "row" },
        }}
      >
        <Sidebar
          name={currentOrg.username}
          email={currentOrg.email}
          routes={routes}
        />

        <Stack
          sx={{
            p: isRoomPath ? 0 : { xs: 1, lg: templateId ? 0 : 5 },
            gap: 2,
            width: "100%",
            height: "calc(100vh - 4rem)",
            overflowY: "auto",
            overflowX: "hidden",
          }}
        >
          <Breadcrumb initialPosition={3} />

          {children}
        </Stack>
      </Stack>
    </WhiteLabelWrapper>
  )
}
