"use client"

import { useCallback, useMemo, type PropsWithChildren } from "react"
import { Route } from "next"
import { useParams, usePathname, useRouter } from "next/navigation"
import { setCurrentRoom } from "@/redux/slices/room"
import { useAppDispatch, type RootState } from "@/redux/store"
import { Box, Stack } from "@mui/material"
import {
  FolderHeart,
  LayoutDashboardIcon,
  MessageCircleMore,
  Search,
} from "lucide-react"
import { useSelector } from "react-redux"

import useGetOrgRooms from "@/hooks/use-get-org-rooms"
import Sidebar from "@/components/sidebar"
import WhiteLabelWrapper from "@/components/white-label-wrapper"

export default function Layout({ children }: PropsWithChildren) {
  const { push } = useRouter()

  const pathName = usePathname()

  const { contactId } = useParams()

  const contactOrgs = useSelector((state: RootState) => state.app.contactOrgs)

  const contact = useMemo(
    () => contactOrgs.find((contact) => contact._id === contactId),
    [contactId, contactOrgs]
  )

  const rooms = useGetOrgRooms({
    contactId: contactId as string,
  })

  const dispatch = useAppDispatch()

  const onRoomChange = useCallback(() => {
    const baseURL = `/app/contact-orgs/${contactId}/rooms` as Route

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
  }, [contactId, dispatch, push, rooms])

  const routes = useMemo(
    () => [
      {
        label: "Search",
        path: `/app/contact-orgs/${contactId}`,
        icon: <LayoutDashboardIcon />,
        active: pathName === `/app/contact-orgs/${contactId}`,
      },
      {
        label: "My Searches",
        path: `/app/contact-orgs/${contactId}/search-results`,
        icon: <Search />,
        active: pathName.includes("search-results"),
      },
      {
        icon: <MessageCircleMore />,
        label: "Messages",
        active: pathName.includes("rooms"),
        onClick: onRoomChange,
      },
      {
        path: `/app/contact-orgs/${contactId}/folders`,
        icon: <FolderHeart />,
        label: "Files",
        active: pathName.includes("folders"),
      },
    ],
    [pathName, contactId, onRoomChange]
  )

  const hasWhiteLabelDefined = contact?.org?.whiteLabel

  const isRoomPath = pathName.includes("/rooms")

  return (
    <WhiteLabelWrapper whiteLabel={hasWhiteLabelDefined}>
      <Stack
        sx={{
          p: { xs: 1, md: 0 },
          gap: { xs: 2, md: 0 },
          flexDirection: { xs: "column", md: "row" },
        }}
      >
        <Sidebar
          name={contact?.name ?? "Name not registered"}
          email={contact?.userEmail ?? null}
          routes={routes}
        />

        <Box
          sx={{
            p: isRoomPath ? 0 : { xs: 1, md: 5 },
            width: "100%",
            height: { xs: "calc(100vh - 11rem)", md: "calc(100vh - 4rem)" },
            overflowY: "auto",
            overflowX: "hidden",
          }}
        >
          {children}
        </Box>
      </Stack>
    </WhiteLabelWrapper>
  )
}
