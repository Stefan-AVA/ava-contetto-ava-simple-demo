"use client"

import { useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { useLazyGetMessagesQuery } from "@/redux/apis/message"
import { setCurrentRoom } from "@/redux/slices/room"
import { useAppDispatch, type RootState } from "@/redux/store"
import { Stack } from "@mui/material"
import { useSelector } from "react-redux"

import useGetOrgRooms from "@/hooks/use-get-org-rooms"

import Loading from "../Loading"
import Footer from "./footer"
import HeadRoom from "./head-room"
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
      } else {
        if (agentId) {
          replace(`/app/agent-orgs/${agentId}`)
        } else if (contactId) {
          replace(`/app/contact-orgs/${contactId}`)
        }
      }
    }
  }, [rooms, roomId, agentId, contactId, dispatch, replace])

  useEffect(() => {
    if (room?._id) {
      getAllMessages({ orgId: room.orgId, roomId: room._id })
    }
  }, [room?._id, room?.orgId, getAllMessages])

  return (
    <>
      {room && <HeadRoom room={room} />}

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

      {!isLoading && (
        <ListMessages
          user={user}
          messages={messages}
          agentId={agentId as string}
          contactId={contactId as string}
        />
      )}

      <Footer />
    </>
  )
}
