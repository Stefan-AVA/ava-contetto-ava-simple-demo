import { useEffect, useRef } from "react"
import { Box, Stack, Typography } from "@mui/material"
import { format } from "date-fns"
import { User } from "lucide-react"

import { IMessage } from "@/types/message.types"
import { IUser } from "@/types/user.types"

import Message from "./message"

interface IProps {
  user: IUser | null
  messages: IMessage[]
}

export default function ListMessages({ messages, user }: IProps) {
  const blockRef = useRef<HTMLDivElement>(null)
  const messagesRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (blockRef.current && messagesRef.current) {
      const { top } = blockRef.current.getBoundingClientRect()

      messagesRef.current.scroll({
        top,
        behavior: "smooth",
      })
    }
  }, [])

  useEffect(() => {
    if (messagesRef.current) {
      messagesRef.current.addEventListener("DOMNodeInserted", (event) => {
        const { currentTarget: target } = event
        if (target) {
          const elemTarget = target as HTMLElement

          elemTarget.scroll({
            top: elemTarget.scrollHeight,
            behavior: "smooth",
          })
        }
      })
    }
  }, [])

  return (
    <Stack
      sx={{
        pt: 5,
        px: 5,
        gap: 1.5,
        height: "calc(100vh - 25.5rem)",
        overflowY: "auto",
      }}
      ref={messagesRef}
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

      <div ref={blockRef} />
    </Stack>
  )
}
