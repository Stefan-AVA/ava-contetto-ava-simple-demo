import { useRef, useState, type KeyboardEvent } from "react"
import { useSocket } from "@/providers/SocketProvider"
import type { RootState } from "@/redux/store"
import { getToken } from "@/redux/token"
import { Box, CircularProgress, Stack, Typography } from "@mui/material"
import { Pencil, Send } from "lucide-react"
import { useSelector } from "react-redux"

import { ClientMessageType } from "@/types/message.types"
import useOutsideClick from "@/hooks/use-outside-click"

function messageParser(text?: string) {
  if (!text) return ""

  let message = text

  const urls = message.match(/(https?:\/\/[^\s]+)/g)
  const channels = message.match(/#\w+/g)
  const usernames = message.match(/@\w+/g)

  if (urls && urls.length > 0) {
    urls.forEach((url) => {
      message = message.replaceAll(
        url,
        `<a href="${url}" style="text-decoration:underline;" target="_blank">${url}</a>`
      )
    })
  }

  if (channels && channels.length > 0) {
    channels.forEach((channel) => {
      message = message.replaceAll(channel, `<b>${channel}</b>`)
    })
  }

  if (usernames && usernames.length > 0) {
    usernames.forEach((username) => {
      message = message.replaceAll(username, `<b>${username}</b>`)
    })
  }

  return message
}

interface MessageProps {
  message: string
  username: string
  messageId: string
  currentUser: boolean
}

export default function Message({
  message,
  username,
  messageId,
  currentUser,
}: MessageProps) {
  const [edit, setEdit] = useState(false)
  const [loading, setLoading] = useState(false)

  const ref = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const socket = useSocket()

  const room = useSelector((state: RootState) => state.rooms.currentRoom)

  useOutsideClick(ref, () => setEdit(false))

  async function submit() {
    setLoading(true)

    const token = getToken()

    socket.emit(ClientMessageType.msgUpdate, {
      token,
      orgId: room?.orgId,
      roomId: room?._id,
      messageId,
      msg: inputRef.current?.value ?? "",
    })

    if (inputRef.current) inputRef.current.value = ""

    setEdit(false)

    setLoading(false)
  }

  function onEdit() {
    setEdit(true)

    setTimeout(() => {
      if (inputRef.current) {
        inputRef.current.value = message
        inputRef.current.focus()
      }
    }, 200)
  }

  async function onPressEnter(e: KeyboardEvent<HTMLInputElement>) {
    if (e.code === "Enter" && !e.shiftKey) await submit()
  }

  return (
    <Stack
      sx={{
        gap: 1,
        alignItems: "center",
        flexDirection: "row",

        ":hover .edit-button": {
          scale: 1,
          opacity: 1,
          pointerEvents: "auto",
        },
      }}
      ref={ref}
    >
      {currentUser && (
        <Box
          sx={{
            scale: 0.2,
            opacity: 0,
            transition: "all .3s ease-in-out",
            pointerEvents: "none",
          }}
          onClick={onEdit}
          component="button"
          className="edit-button"
        >
          <Box sx={{ color: "gray.500" }} size={16} component={Pencil} />
        </Box>
      )}

      <Stack
        sx={{
          py: 1.5,
          px: 2,
          gap: 0.25,
          borderRadius: ".75rem",
          backgroundColor: currentUser ? "secondary.main" : "gray.200",
          borderTopLeftRadius: !currentUser ? 0 : ".75rem",
          borderBottomRightRadius: currentUser ? 0 : ".75rem",
        }}
      >
        {!currentUser && (
          <Typography sx={{ fontWeight: 600 }} variant="caption">
            {username}
          </Typography>
        )}

        {edit && (
          <Stack
            sx={{
              gap: 1,
              alignItems: "center",
              flexDirection: "row",
            }}
          >
            <Box
              sx={{
                color: "white",
                border: "none",
                outline: "none",
                fontSize: ".875rem",
                lineHeight: "1.25rem",
                backgroundColor: "transparent",
              }}
              ref={inputRef}
              onKeyDown={(e) => onPressEnter(e)}
              component="input"
            />

            <Box
              sx={{ color: "white" }}
              size={14}
              onClick={submit}
              component={loading ? CircularProgress : Send}
            />
          </Stack>
        )}

        {!edit && (
          <Box
            sx={{
              color: currentUser ? "white" : "gray.700",
              whiteSpace: "break-spaces",
              lineHeight: "1.25rem",
            }}
            variant="body2"
            component={Typography}
            dangerouslySetInnerHTML={{ __html: messageParser(message) }}
          />
        )}
      </Stack>
    </Stack>
  )
}
