import "linkify-plugin-hashtag"
import "linkify-plugin-mention"

import { useRef, useState, type KeyboardEvent } from "react"
import { useSocket } from "@/providers/SocketProvider"
import type { RootState } from "@/redux/store"
import { getToken } from "@/redux/token"
import { Box, CircularProgress, Stack, Typography } from "@mui/material"
import Linkify from "linkify-react"
import { Pencil, Send, Trash } from "lucide-react"
import { useSelector } from "react-redux"

import { ClientMessageType } from "@/types/message.types"
import useOutsideClick from "@/hooks/use-outside-click"

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
  const [loadingEdit, setLoadingEdit] = useState(false)
  const [loadingRemove, setLoadingRemove] = useState(false)

  const ref = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const socket = useSocket()

  const room = useSelector((state: RootState) => state.rooms.currentRoom)

  useOutsideClick(ref, () => setEdit(false))

  async function submit() {
    setLoadingEdit(true)

    const token = getToken()

    socket.emit(ClientMessageType.msgUpdate, {
      msg: inputRef.current?.value ?? "",
      token,
      orgId: room?.orgId,
      roomId: room?._id,
      messageId,
    })

    if (inputRef.current) inputRef.current.value = ""

    setEdit(false)

    setLoadingEdit(false)
  }

  async function onDelete() {
    setLoadingRemove(true)

    /**
     * @todo
     * Delete message.
     */

    setLoadingRemove(false)
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
              {message}
            </Linkify>
          </Box>
        )}
      </Stack>
    </Stack>
  )
}
