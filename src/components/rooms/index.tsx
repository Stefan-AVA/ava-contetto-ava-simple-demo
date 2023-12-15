import { useMemo } from "react"
import { useParams } from "next/navigation"
import { type RootState } from "@/redux/store"
import { Stack } from "@mui/material"
import { Hash, Lock } from "lucide-react"
import { useSelector } from "react-redux"

import CreateChannel from "./create-channel"
import CreateDM from "./create-dm"
import ListRooms from "./list-rooms"
import RoomField from "./room-field"

export default function Rooms() {
  const { agentId } = useParams()

  const agentOrgs = useSelector((state: RootState) => state.app.agentOrgs)

  const agentProfile = useMemo(
    () => agentOrgs.find((agent) => agent._id === agentId),
    [agentId, agentOrgs]
  )

  return (
    <Stack sx={{ gap: 2 }}>
      <ListRooms type="CHANNELS">
        <RoomField
          id="1"
          icon={Hash}
          title="General"
          unreadMessages={10}
          numberOfMembers={24}
        />

        <RoomField
          id="2"
          icon={Lock}
          title="Lead Generation"
          numberOfMembers={1}
        />

        {agentProfile?.role === "owner" && (
          <CreateChannel orgId={agentProfile.orgId} />
        )}
      </ListRooms>

      <ListRooms type="DIRECT_CHATS">
        <RoomField
          id="3"
          title="Jane Doe"
          sendedAt={new Date().toISOString()}
          lastMessage="Have you completed the challenge"
          unreadMessages={10}
        />

        {agentProfile?.role === "owner" && (
          <CreateDM orgId={agentProfile.orgId} />
        )}
      </ListRooms>
    </Stack>
  )
}
