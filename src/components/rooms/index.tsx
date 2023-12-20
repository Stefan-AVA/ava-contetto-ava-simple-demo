import { MouseEvent, useMemo } from "react"
import { useParams, useRouter } from "next/navigation"
import { setCurrentRoom } from "@/redux/slices/room"
import { useAppDispatch, type RootState } from "@/redux/store"
import { Stack } from "@mui/material"
import { Lock } from "lucide-react"
import { useSelector } from "react-redux"

import { IRoom, RoomType } from "@/types/room.types"
import useGetOrgRooms from "@/hooks/use-get-org-rooms"

import Loading from "../Loading"
import CreateChannel from "./create-channel"
import CreateDM from "./create-dm"
import ListRooms from "./list-rooms"
import RoomField from "./room-field"

export default function Rooms() {
  const { agentId, contactId } = useParams()
  const { push } = useRouter()

  const dispatch = useAppDispatch()

  const user = useSelector((state: RootState) => state.app.user)
  const agentOrgs = useSelector((state: RootState) => state.app.agentOrgs)
  const rooms = useGetOrgRooms({
    agentId: String(agentId),
    contactId: String(contactId),
  })

  const agentProfile = useMemo(
    () => agentOrgs.find((agent) => agent._id === agentId),
    [agentId, agentOrgs]
  )

  const onRoomChange = (room: IRoom) => (e: MouseEvent<HTMLElement>) => {
    dispatch(setCurrentRoom(room))
    if (agentId) {
      push(`/app/agent-orgs/${agentId}/rooms/${room._id}`)
    } else if (contactId) {
      push(`/app/contact-orgs/${contactId}/rooms/${room._id}`)
    }
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
                  numberOfMembers={room.usernames.length}
                  onClick={onRoomChange(room)}
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
                  title={room.usernames
                    .filter((u) => u !== user?.username)
                    .join(", ")}
                  onClick={onRoomChange(room)}
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
