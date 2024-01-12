import { useEffect, useState } from "react"
import { RootState } from "@/redux/store"
import { useSelector } from "react-redux"

import { IRoom, RoomType } from "@/types/room.types"

interface IProps {
  agentId?: string
  contactId?: string
}

const useGetOrgRooms = ({ agentId, contactId }: IProps) => {
  const [rooms, setRooms] = useState<IRoom[] | undefined>(undefined)
  const totalRooms = useSelector((state: RootState) => state.rooms.rooms)

  useEffect(() => {
    if (agentId) {
      setRooms(
        totalRooms.filter(
          (room) =>
            !!room.agents.find((ap) => ap._id === agentId) &&
            (room.type === RoomType.channel ||
              (room.type === RoomType.dm && room.dmInitiated))
        )
      )
    }
    if (contactId) {
      setRooms(
        totalRooms.filter(
          (room) =>
            !!room.contacts.find((cp) => cp._id === contactId) &&
            (room.type === RoomType.channel ||
              (room.type === RoomType.dm && room.dmInitiated))
        )
      )
    }
  }, [totalRooms, agentId, contactId])

  return rooms
}

export default useGetOrgRooms
