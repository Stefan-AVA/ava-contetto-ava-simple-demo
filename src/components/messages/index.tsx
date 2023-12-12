import { Stack } from "@mui/material"

import ListMessages from "./list-messages"

export default function Messages() {
  return (
    <Stack sx={{ gap: 4 }}>
      <ListMessages type="CHANNELS" />

      <ListMessages type="DIRECT_CHATS" />
    </Stack>
  )
}
