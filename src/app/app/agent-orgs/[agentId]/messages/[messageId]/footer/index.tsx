import { useState, type FormEvent } from "react"
import { Box, Stack } from "@mui/material"
import { Send } from "lucide-react"

import EmojiPicker from "./emoji-picker"

export default function Footer() {
  const [message, setMessage] = useState("")

  async function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()

    // send message.

    setMessage("")
  }

  return (
    <Stack sx={{ px: 5, pb: 3, gap: 4, flexDirection: "row" }}>
      <EmojiPicker onMessage={setMessage} />

      <Box
        sx={{
          flex: 1,
        }}
        onSubmit={submit}
        component="form"
      >
        <Stack
          sx={{
            py: 1.75,
            px: 3,
            width: "100%",
            color: "gray.700",
            outline: "none",
            fontSize: ".875rem",
            fontWeight: 500,
            lineHeight: "1rem",
            borderRadius: ".5rem",
            backgroundColor: "gray.200",

            "&::placeholder": {
              color: "gray.400",
            },
          }}
          value={message}
          onChange={({ target }) => setMessage(target.value)}
          component="input"
          placeholder="Write your message here."
        />
      </Box>

      <Box sx={{ color: "secondary.main" }} type="submit" component="button">
        <Send />
      </Box>
    </Stack>
  )
}
