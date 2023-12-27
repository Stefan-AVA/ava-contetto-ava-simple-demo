import { useEffect, useRef, useState } from "react"
import { RootState } from "@/redux/store"
import { Box, Stack, Typography } from "@mui/material"
import { format } from "date-fns"
import { User } from "lucide-react"
import { useSelector } from "react-redux"

import type { IMessage } from "@/types/message.types"
import type { IUser } from "@/types/user.types"
import useIsVisible from "@/hooks/use-is-visible"

import Message from "./message"
import scrollToBottom from "./scroll-to-bottom"

interface IProps {
  user: IUser | null
  messages: IMessage[]
}

export default function ListMessages({ messages, user }: IProps) {
  const [editMessageId, setEditMessageId] = useState<string | null>(null)

  const ref = useRef<HTMLDivElement>(null)

  const isVisible = useIsVisible(ref)

  const room = useSelector((state: RootState) => state.rooms.currentRoom)
  const userTyping = useSelector((state: RootState) => state.rooms.userTyping)

  useEffect(scrollToBottom, [])

  useEffect(() => {
    const list = document.getElementById("messages-list")

    function scroll() {
      if (isVisible && !editMessageId) scrollToBottom()
    }

    if (list) list.addEventListener("DOMNodeInserted", scroll)

    return () => {
      if (list) list.removeEventListener("DOMNodeInserted", scroll)
    }
  }, [isVisible, editMessageId])

  return (
    <>
      <Stack
        id="messages-list"
        sx={{
          pt: { xs: 2, md: 5 },
          px: { xs: 2, md: 5 },
          gap: 1.5,
          height: "calc(100vh - 25.5rem)",
          overflowY: "auto",
        }}
      >
        {messages.map(({ _id, senderName, msg, createdAt }, index) => {
          const currentUser = senderName === user?.username

          return (
            <Stack
              sx={{
                ml: currentUser ? "auto" : 0,
                gap: 1.5,
                width: "fit-content",
                flexDirection: "row",
              }}
              key={index}
            >
              {!currentUser && (
                <Stack
                  sx={{
                    width: "2.25rem",
                    height: "2.25rem",
                    position: "relative",
                    alignItems: "center",
                    aspectRatio: 1 / 1,
                    borderRadius: "50%",
                    justifyContent: "center",
                    backgroundColor: "gray.200",
                  }}
                >
                  <Box
                    sx={{ color: "gray.500" }}
                    size={16}
                    component={User}
                    strokeWidth={3}
                  />
                </Stack>
              )}

              <Stack sx={{ gap: 0.5 }}>
                <Message
                  message={msg ?? ""}
                  username={senderName}
                  messageId={_id}
                  currentUser={currentUser}
                  editMessageId={editMessageId}
                  onEditMessageId={setEditMessageId}
                />

                <Typography
                  sx={{
                    color: "gray.600",
                    textAlign: currentUser ? "right" : "left",
                  }}
                  variant="caption"
                >
                  {format(new Date(createdAt * 1000), "HH:mm aa")}
                </Typography>
              </Stack>
            </Stack>
          )
        })}

        <div ref={ref} />
      </Stack>

      {room && userTyping && room._id === userTyping.roomId && (
        <Typography
          sx={{
            left: 40,
            color: "gray.500",
            bottom: "-1.25rem",
            position: "absolute",
            pointerEvents: "none",
          }}
          variant="caption"
        >
          {userTyping.username} is typing...
        </Typography>
      )}
    </>
  )
}
