import { useEffect, useRef } from "react"
import { Box, Stack, Typography } from "@mui/material"
import { format } from "date-fns"
import { User } from "lucide-react"

import { IMessage } from "@/types/message.types"
import { IUser } from "@/types/user.types"

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

interface IProps {
  messages: IMessage[]
  user: IUser | null
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
      {messages.map(({ senderName, msg, createdAt }, index) => {
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
                    {senderName}
                  </Typography>
                )}

                <Box
                  sx={{
                    color: currentUser ? "white" : "gray.700",
                    whiteSpace: "break-spaces",
                    lineHeight: "1.25rem",
                  }}
                  variant="body2"
                  component={Typography}
                  dangerouslySetInnerHTML={{ __html: messageParser(msg) }}
                />
              </Stack>

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
