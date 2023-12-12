import { Stack } from "@mui/material"
import { Hash, Lock } from "lucide-react"

import ListMessages from "./list-messages"
import MessageField from "./message-field"

export default function Messages() {
  return (
    <Stack sx={{ gap: 2 }}>
      <ListMessages type="CHANNELS">
        <MessageField
          icon={Hash}
          title="General"
          onNavigate={() => null}
          unreadMessages={10}
          numberOfMembers={24}
        />

        <MessageField
          icon={Lock}
          title="Lead Generation"
          onNavigate={() => null}
          numberOfMembers={1}
        />
      </ListMessages>

      <ListMessages type="DIRECT_CHATS" />
    </Stack>
  )
}
