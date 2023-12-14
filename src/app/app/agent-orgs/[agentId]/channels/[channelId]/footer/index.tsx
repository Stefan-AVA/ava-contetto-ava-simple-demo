import { useState } from "react"
import { Box, CircularProgress, Stack } from "@mui/material"
import { Send } from "lucide-react"

import EmojiPicker from "./emoji-picker"
import TextField from "./text-field"

export default function Footer() {
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState("")

  async function submit() {
    setLoading(true)

    // send message.

    setLoading(false)

    setMessage("")
  }

  return (
    <Stack sx={{ px: 5, pb: 3, gap: 4, flexDirection: "row" }}>
      <EmojiPicker onMessage={setMessage} />

      <TextField
        value={message}
        onSend={submit}
        onChange={({ target }) => setMessage(target.value)}
      />

      <Box sx={{ color: "secondary.main" }} onClick={submit} component="button">
        {loading ? <CircularProgress size="1.5rem" /> : <Send />}
      </Box>
    </Stack>
  )
}
