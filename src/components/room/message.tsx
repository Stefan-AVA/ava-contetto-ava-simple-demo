import "linkify-plugin-hashtag"
import "linkify-plugin-mention"

import {
  useCallback,
  useRef,
  useState,
  type Dispatch,
  type SetStateAction,
} from "react"
import { useSocket } from "@/providers/SocketProvider"
import type { RootState } from "@/redux/store"
import { getToken } from "@/redux/token"
import { Box, CircularProgress, Stack, Typography } from "@mui/material"
import { format } from "date-fns"
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
  editable: boolean
  createdAt: number
  messageId: string
  currentUser: boolean
  editMessageId: string | null
  onEditMessageId: Dispatch<SetStateAction<string | null>>
}

export default function Message({
  message: content,
  username,
  editable,
  messageId,
  createdAt,
  currentUser,
  editMessageId,
  onEditMessageId,
}: MessageProps) {
  const [message, setMessage] = useState("")
  const [mentions, setMentions] = useState<OptionProps[]>([])
  const [channels, setChannels] = useState<OptionProps[]>([])
  const [loadingEdit, setLoadingEdit] = useState(false)
  const [loadingRemove, setLoadingRemove] = useState(false)

  const ref = useRef<HTMLDivElement>(null)

  const socket = useSocket()

  const room = useSelector((state: RootState) => state.rooms.currentRoom)

  useOutsideClick(ref, () => onEditMessageId(null))

  async function submit() {
    if (!message) {
      onEditMessageId(null)

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

    onEditMessageId(null)

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
    onEditMessageId(messageId)

    setMessage(content)
  }

  const CreatedAt = useCallback(
    () => (
      <Typography
        sx={{
          color: "gray.500",
          textAlign: currentUser ? "right" : "left",
        }}
        variant="caption"
      >
        {format(new Date(createdAt * 1000), "HH:mm aa")}
      </Typography>
    ),
    [createdAt, currentUser]
  )

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
      {currentUser && editable && (
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
          py: currentUser ? 1.5 : 0,
          px: currentUser ? 2 : 0,
          gap: 0.25,
          textAlign: currentUser ? "right" : "left",
          borderRadius: ".75rem",
          backgroundColor: currentUser ? "gray.200" : "transparent",
        }}
      >
        {!currentUser && (
          <Typography
            sx={{
              gap: 1,
              display: "flex",
              fontWeight: 600,
              alignItems: "center",
            }}
            variant="body2"
          >
            {username}

            <CreatedAt />
          </Typography>
        )}

        {editMessageId === messageId && (
          <Stack
            sx={{
              gap: 1,
              alignItems: "center",
              flexDirection: "row",
            }}
          >
            <TextField
              value={message}
              onSend={submit}
              variant="TINY"
              onChange={setMessage}
              setMentions={setMentions}
              setChannels={setChannels}
            />

            <Box
              sx={{
                color: "secondary.main",
                cursor: loadingEdit ? "not-allowed" : "pointer",
                aspectRatio: "1/1",
              }}
              size={20}
              onClick={submit}
              component={loadingEdit ? CircularProgress : Send}
            />
          </Stack>
        )}

        {editMessageId !== messageId && (
          <Box
            sx={{
              color: "gray.700",
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

        {currentUser && <CreatedAt />}
      </Stack>
    </Stack>
  )
}
