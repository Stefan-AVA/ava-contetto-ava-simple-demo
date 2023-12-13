import { Stack, Typography } from "@mui/material"
import { Hash, Lock, Plus } from "lucide-react"

import ListMessages from "./list-messages"
import MessageField from "./message-field"

export default function Messages() {
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

        <Typography
          sx={{
            mt: 2,
            gap: 0.5,
            color: "secondary.main",
            display: "flex",
            alignItems: "center",
            fontWeight: 600,
          }}
          component="button"
        >
          <Plus size={20} />
          Create Channel
        </Typography>
      </ListMessages>

      <ListMessages type="DIRECT_CHATS">
        <MessageField
          id="3"
          title="Jane Doe"
          sendedAt={new Date().toISOString()}
          lastMessage="Have you completed the challenge"
          unreadMessages={10}
        />
      </ListMessages>
    </Stack>
  )
}
