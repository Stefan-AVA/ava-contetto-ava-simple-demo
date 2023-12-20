import { useEffect, useState } from "react"
import { useSocket } from "@/providers/SocketProvider"
import { getToken } from "@/redux/fetch-auth-query"
import type { RootState } from "@/redux/store"
import { Box, CircularProgress, Stack } from "@mui/material"
import { Send } from "lucide-react"
import { OptionProps } from "rc-mentions/lib/Option"
import { useSelector } from "react-redux"

import { ClientMessageType, ServerMessageType } from "@/types/message.types"

import EmojiPicker from "./emoji-picker"
import TextField from "./text-field"

export default function Footer() {
  const socket = useSocket()

  const user = useSelector((state: RootState) => state.app.user)
  const room = useSelector((state: RootState) => state.rooms.currentRoom)

  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState("")
  const [mentions, setMentions] = useState<OptionProps[]>([])
  const [channels, setChannels] = useState<OptionProps[]>([])

  useEffect(() => {
    return () => {
      socket.emit(ServerMessageType.msgTyping, null)
    }
  }, [socket])

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

    setLoading(false)

    setMessage("")
  }

  function onChangeTextField(text: string) {
    setMessage(text)

    if (room && user) {
      socket.emit(ServerMessageType.msgTyping, {
        roomId: room._id,
        username: user.username,
      })
    }
  }

  return (
    <Stack sx={{ px: 5, py: 3, gap: 4, flexDirection: "row" }}>
      <EmojiPicker onMessage={setMessage} />

      <TextField
        value={message}
        onSend={submit}
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
