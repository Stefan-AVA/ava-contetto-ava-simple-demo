import { useMemo } from "react"
import { useParams, useRouter } from "next/navigation"
import { setCurrentRoom } from "@/redux/slices/room"
import { useAppDispatch, type RootState } from "@/redux/store"
import { Stack } from "@mui/material"
import { Lock } from "lucide-react"
import { useSelector } from "react-redux"

import { RoomType, type IRoom } from "@/types/room.types"
import useGetOrgRooms from "@/hooks/use-get-org-rooms"

import Loading from "../Loading"
import CreateChannel from "./create-channel"
import CreateDM from "./create-dm"
import ListRooms from "./list-rooms"
import RoomField from "./room-field"

interface RoomsProps {
  onAction?: () => void
}

export default function Rooms({ onAction }: RoomsProps) {
  const { agentId, contactId } = useParams()
  const { push } = useRouter()

  const dispatch = useAppDispatch()

  const user = useSelector((state: RootState) => state.app.user)
  const agentOrgs = useSelector((state: RootState) => state.app.agentOrgs)
  const rooms = useGetOrgRooms({
    agentId: agentId as string,
    contactId: contactId as string,
  })

  const agentProfile = useMemo(
    () => agentOrgs.find((agent) => agent._id === agentId),
    [agentId, agentOrgs]
  )

  function onRoomChange(room: IRoom) {
    dispatch(setCurrentRoom(room))

    if (agentId) {
      push(`/app/agent-orgs/${agentId}/rooms/${room._id}`)
    } else if (contactId) {
      push(`/app/contact-orgs/${contactId}/rooms/${room._id}`)
    }
  }

  function navigate(room: IRoom) {
    onRoomChange(room)

    if (onAction) onAction()
  }

  return (
    <Stack sx={{ gap: 2 }}>
      {!rooms && <Loading />}

      {rooms && (
        <>
          <ListRooms type="CHANNELS">
            {rooms
              .filter((room) => room.type === RoomType.channel)
              .map((room) => (
                <RoomField
                  key={room._id}
                  icon={Lock}
                  title={String(room.name)}
                  onClick={() => navigate(room)}
                  numberOfMembers={room.usernames.length}
                  unreadMessages={
                    user?.username
                      ? room.userStatus[user.username].notis
                      : undefined
                  }
                />
              ))}

            {agentProfile && <CreateChannel agentProfile={agentProfile} />}
          </ListRooms>

          <ListRooms type="DIRECT_CHATS">
            {rooms
              .filter((room) => room.type === RoomType.dm)
              .map((room) => (
                <RoomField
                  key={room._id}
                  icon={Lock}
                  title={[
                    ...room.agents.map((a) => a.username),
                    ...room.contacts.map((c) => c.username || c.name),
                  ]
                    .filter((u) => u !== user?.username)
                    .join(", ")}
                  onClick={() => navigate(room)}
                  unreadMessages={
                    user?.username
                      ? room.userStatus[user.username].notis
                      : undefined
                  }
                />
              ))}
            {agentProfile && <CreateDM agentProfile={agentProfile} />}
          </ListRooms>
        </>
      )}
    </Stack>
  )
}
