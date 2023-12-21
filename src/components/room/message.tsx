import "linkify-plugin-hashtag"
import "linkify-plugin-mention"

import { useRef, useState } from "react"
import { useSocket } from "@/providers/SocketProvider"
import type { RootState } from "@/redux/store"
import { getToken } from "@/redux/token"
import {
  Box,
  CircularProgress,
  Stack,
  Typography,
  useTheme,
} from "@mui/material"
import Linkify from "linkify-react"
import { Pencil, Send, Trash } from "lucide-react"
import type { OptionProps } from "rc-mentions/lib/Option"
import { useSelector } from "react-redux"

import { ClientMessageType } from "@/types/message.types"
import useOutsideClick from "@/hooks/use-outside-click"

import TextField from "./footer/text-field"

interface MessageProps {
  message: string
  username: string
  messageId: string
  currentUser: boolean
}

export default function Message({
  message: content,
  username,
  messageId,
  currentUser,
}: MessageProps) {
  const [edit, setEdit] = useState(false)
  const [message, setMessage] = useState("")
  const [mentions, setMentions] = useState<OptionProps[]>([])
  const [channels, setChannels] = useState<OptionProps[]>([])
  const [loadingEdit, setLoadingEdit] = useState(false)
  const [loadingRemove, setLoadingRemove] = useState(false)

  const ref = useRef<HTMLDivElement>(null)

  const { typography } = useTheme()

  const socket = useSocket()

  const room = useSelector((state: RootState) => state.rooms.currentRoom)

  useOutsideClick(ref, () => setEdit(false))

  async function submit() {
    if (!message) {
      setEdit(false)

      return
    }

    setLoadingEdit(true)

    const token = getToken()

    socket.emit(ClientMessageType.msgUpdate, {
      msg: message ?? "",
      token,
      orgId: room?.orgId,
      roomId: room?._id,
      mentions: mentions
        .map((m) => m.value)
        .filter((val) => message.includes(`@${val} `)), // usernames
      channels: channels
        .map((c) => c.value)
        .filter((val) => message.includes(`#${val} `)), // channel ids
      messageId,
    })

    setEdit(false)

    setMessage("")

    setLoadingEdit(false)
  }

  async function onDelete() {
    setLoadingRemove(true)

    const token = getToken()

    socket.emit(ClientMessageType.msgDelete, {
      token,
      orgId: room?.orgId,
      roomId: room?._id,
      messageId,
    })

    setLoadingRemove(false)
  }

  function onEdit() {
    setEdit(true)

    setMessage(content)
  }

  return (
    <Stack
      sx={{
        gap: 1,
        alignItems: "center",
        flexDirection: "row",

        ":hover .message-actions": {
          scale: 1,
          opacity: 1,
          pointerEvents: "auto",
        },
      }}
      ref={ref}
    >
      {currentUser && (
        <Stack
          sx={{
            gap: 1,
            scale: 0.2,
            opacity: 0,
            transition: "all .3s ease-in-out",
            alignItems: "center",
            pointerEvents: "none",
            flexDirection: "row",
          }}
          className="message-actions"
        >
          <Box onClick={onEdit} component="button">
            <Box sx={{ color: "gray.500" }} size={16} component={Pencil} />
          </Box>

          <Box onClick={onDelete} component="button">
            <Box
              sx={{ color: "gray.500" }}
              size={16}
              component={loadingRemove ? CircularProgress : Trash}
            />
          </Box>
        </Stack>
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
            <TextField
              sx={{
                textarea: {
                  color: "white",
                  width: "100%",
                  resize: "none",
                  outline: "none",
                  fontSize: ".875rem",
                  fontFamily: typography.fontFamily,
                  fontWeight: 500,
                  lineHeight: "1rem",
                  backgroundColor: "transparent",

                  "&::placeholder": {
                    color: "rgba(255, 255, 255, .5)",
                  },
                },
              }}
              value={message}
              onSend={submit}
              onChange={setMessage}
              setMentions={setMentions}
              setChannels={setChannels}
            />

            <Box
              sx={{ color: "white", aspectRatio: "1/1" }}
              size={20}
              onClick={submit}
              component={loadingEdit ? CircularProgress : Send}
            />
          </Stack>
        )}

        {!edit && (
          <Box
            sx={{
              color: currentUser ? "white" : "gray.700",
              fontSize: ".875rem",
              whiteSpace: "break-spaces",
              lineHeight: "1.25rem",

              a: {
                fontWeight: 700,
                transition: "all .3s ease-in-out",

                ":hover": {
                  textDecoration: "underline",
                },
              },
            }}
          >
            <Linkify
              as="p"
              options={{
                nl2br: true,
                render: {
                  mention: ({ content, attributes }) => {
                    const { href, ...rest } = attributes

                    return (
                      <Box sx={{ fontWeight: 700 }} {...rest} component="span">
                        {content}
                      </Box>
                    )
                  },
                  hashtag: ({ content, attributes }) => {
                    const { href, ...rest } = attributes

                    return (
                      <Box sx={{ fontWeight: 700 }} {...rest} component="span">
                        {content}
                      </Box>
                    )
                  },
                },
                validate: {
                  mention: (value) => {
                    const username = value.slice(1)

                    return room?.usernames.includes(username) ?? false
                  },
                },
                defaultProtocol: "https",
              }}
            >
              {content}
            </Linkify>
          </Box>
        )}
      </Stack>
    </Stack>
  )
}
