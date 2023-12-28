"use client"

import { useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { useLazyGetMessagesQuery } from "@/redux/apis/message"
import { setCurrentRoom } from "@/redux/slices/room"
import { useAppDispatch, type RootState } from "@/redux/store"
import { Box, Stack, Typography } from "@mui/material"
import { User } from "lucide-react"
import { useSelector } from "react-redux"

import { RoomType } from "@/types/room.types"
import useGetOrgRooms from "@/hooks/use-get-org-rooms"

import Loading from "../Loading"
import AddMembersToRoom from "./add-members-to-room"
import Footer from "./footer"
import ListMessages from "./list-messages"

export default function Room() {
  const { replace } = useRouter()
  const { agentId, contactId, roomId } = useParams()

  const dispatch = useAppDispatch()

  const user = useSelector((state: RootState) => state.app.user)
  const room = useSelector((state: RootState) => state.rooms.currentRoom)
  const rooms = useGetOrgRooms({
    agentId: agentId as string,
    contactId: contactId as string,
  })
  const messages = useSelector((state: RootState) => state.rooms.messages)

  const [getAllMessages, { isLoading }] = useLazyGetMessagesQuery()

  useEffect(() => {
    if (roomId && rooms) {
      const room = rooms.find((r) => r._id === roomId)

      if (room) {
        dispatch(setCurrentRoom(room))
        getAllMessages({ orgId: room.orgId, roomId: room._id })
      } else {
        if (agentId) {
          replace(`/app/agent-orgs/${agentId}`)
        } else if (contactId) {
          replace(`/app/contact-orgs/${contactId}`)
        }
      }
    }
  }, [rooms, roomId, agentId, contactId, dispatch, replace, getAllMessages])

  return (
    <>
      <Stack
        sx={{
          px: { xs: 2, md: 5 },
          py: 2.5,
          gap: 2,
          alignItems: "center",
          borderBottom: "1px solid",
          flexDirection: "row",
          borderBottomColor: "gray.300",
        }}
      >
        <Stack
          sx={{
            width: "2.25rem",
            height: "2.25rem",
            position: "relative",
            alignItems: "center",
            aspectRatio: 1 / 1,
            borderRadius: "50%",
            justifyContent: "center",
            backgroundColor: "gray.200",
          }}
        >
          <Box
            sx={{ color: "gray.500" }}
            size={16}
            component={User}
            strokeWidth={3}
          />
        </Stack>

        <Typography sx={{ color: "gray.700", fontWeight: 600 }} variant="h5">
          {room?.type === RoomType.channel
            ? room.name
            : room?.usernames.filter((u) => u !== user?.username).join(", ")}
        </Typography>

        {room?.type === RoomType.channel && <AddMembersToRoom />}
      </Stack>

      {isLoading && (
        <Stack
          sx={{
            pt: 5,
            px: 5,
            height: "calc(100vh - 25.5rem)",
          }}
        >
          <Loading />
        </Stack>
      )}

      {!isLoading && <ListMessages user={user} messages={messages} />}
      <Footer />
    </>
  )
}
