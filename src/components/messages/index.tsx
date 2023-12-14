import { useMemo } from "react"
import { useParams } from "next/navigation"
import { type RootState } from "@/redux/store"
import { Stack } from "@mui/material"
import { Hash, Lock } from "lucide-react"
import { useSelector } from "react-redux"

import CreateChannel from "./create-channel"
import CreateDM from "./create-dm"
import ListMessages from "./list-messages"
import MessageField from "./message-field"

export default function Messages() {
  const { agentId } = useParams()

  const agentOrgs = useSelector((state: RootState) => state.app.agentOrgs)

  const agentProfile = useMemo(
    () => agentOrgs.find((agent) => agent._id === agentId),
    [agentId, agentOrgs]
  )

  return (
    <Stack sx={{ gap: 2 }}>
      <ListMessages type="CHANNELS">
        <MessageField
          id="1"
          icon={Hash}
          title="General"
          unreadMessages={10}
          numberOfMembers={24}
        />

        <MessageField
          id="2"
          icon={Lock}
          title="Lead Generation"
          numberOfMembers={1}
        />

        {agentProfile?.role === "owner" && (
          <CreateChannel orgId={agentProfile.orgId} />
        )}
      </ListMessages>

      <ListMessages type="DIRECT_CHATS">
        <MessageField
          id="3"
          title="Jane Doe"
          sendedAt={new Date().toISOString()}
          lastMessage="Have you completed the challenge"
          unreadMessages={10}
        />

        {agentProfile?.role === "owner" && (
          <CreateDM orgId={agentProfile.orgId} />
        )}
      </ListMessages>
    </Stack>
  )
}
