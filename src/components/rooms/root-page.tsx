"use client"

import { useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { setCurrentRoom } from "@/redux/slices/room"
import { useAppDispatch } from "@/redux/store"

import { IRoom } from "@/types/room.types"
import useGetOrgRooms from "@/hooks/use-get-org-rooms"

export default function RootRoomsPage() {
  const { agentId, contactId } = useParams()
  const { push } = useRouter()

  const dispatch = useAppDispatch()

  const rooms = useGetOrgRooms({
    agentId: agentId as string,
    contactId: contactId as string,
  })

  useEffect(() => {
    function onRoomChange(room: IRoom) {
      dispatch(setCurrentRoom(room))

      if (agentId) {
        push(`/app/agent-orgs/${agentId}/rooms/${room._id}`)
      } else if (contactId) {
        push(`/app/contact-orgs/${contactId}/rooms/${room._id}`)
      }
    }

    if (rooms && rooms.length > 0) onRoomChange(rooms[0])
  }, [agentId, contactId, dispatch, push, rooms])

  return null
}
