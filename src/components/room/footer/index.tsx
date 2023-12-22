import { useEffect, useState } from "react"
import { useSocket } from "@/providers/SocketProvider"
import type { RootState } from "@/redux/store"
import { getToken } from "@/redux/token"
import { Box, CircularProgress, Stack } from "@mui/material"
import { Send } from "lucide-react"
import type { OptionProps } from "rc-mentions/lib/Option"
import { useSelector } from "react-redux"

import { ClientMessageType } from "@/types/message.types"

import scrollToBottom from "../scroll-to-bottom"
import EmojiPicker from "./emoji-picker"
import TextField from "./text-field"

async function delay(ms = 1) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms)
  })
}

export default function Footer() {
  const socket = useSocket()

  const user = useSelector((state: RootState) => state.app.user)
  const room = useSelector((state: RootState) => state.rooms.currentRoom)

  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState("")
  const [mentions, setMentions] = useState<OptionProps[]>([])
  const [channels, setChannels] = useState<OptionProps[]>([])

  useEffect(() => {
    if (room) {
      const token = getToken()

      socket.emit(ClientMessageType.msgRead, {
        token,
        orgId: room.orgId,
        roomId: room._id,
      })
    }
  }, [room, socket])

  function stopTyping() {
    const token = getToken()

    socket.emit(ClientMessageType.msgTyping, {
      token,
      orgId: room?.orgId,
      roomId: room?._id,
      typing: false,
    })
  }

  async function submit() {
    setLoading(true)

    // send message.
    const token = getToken()

    // TODO: please implement mentions/channels correctly
    socket.emit(ClientMessageType.msgSend, {
      token,
      orgId: room?.orgId,
      roomId: room?._id,
      msg: message,
      mentions: mentions
        .map((m) => m.value)
        .filter((val) => message.includes(`@${val} `)), // usernames
      channels: channels
        .map((c) => c.value)
        .filter((val) => message.includes(`#${val} `)), // channel ids
    })

    stopTyping()

    setMessage("")

    await delay(300)

    scrollToBottom()

    setLoading(false)
  }

  function onChangeTextField(text: string) {
    if (text.length <= 0) stopTyping()

    setMessage(text)

    if (room && user) {
      const token = getToken()

      socket.emit(ClientMessageType.msgTyping, {
        token,
        orgId: room?.orgId,
        roomId: room._id,
        typing: true,
      })
    }
  }

  return (
    <Stack sx={{ px: 5, py: 3, gap: 4, flexDirection: "row" }}>
      <EmojiPicker onMessage={setMessage} />

      <TextField
        value={message}
        onSend={submit}
        onBlur={stopTyping}
        onChange={onChangeTextField}
        setMentions={setMentions}
        setChannels={setChannels}
      />

      <Box sx={{ color: "secondary.main" }} onClick={submit} component="button">
        {loading ? <CircularProgress size="1.5rem" /> : <Send />}
      </Box>
    </Stack>
  )
}
