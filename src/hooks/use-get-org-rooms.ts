import { useEffect, useState } from "react"
import { RootState } from "@/redux/store"
import { useSelector } from "react-redux"

import { IRoom } from "@/types/room.types"

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
          (room) => !!room.agents.find((ap) => ap._id === agentId)
        )
      )
    }
    if (contactId) {
      setRooms(
        totalRooms.filter(
          (room) => !!room.contacts.find((cp) => cp._id === contactId)
        )
      )
    }
  }, [totalRooms, agentId, contactId])

  return rooms
}

export default useGetOrgRooms
