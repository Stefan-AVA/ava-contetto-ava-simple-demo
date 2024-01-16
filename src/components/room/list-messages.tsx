import { useEffect, useRef, useState, type UIEvent } from "react"
import { useLazyLoadMoreMessagesQuery } from "@/redux/apis/message"
import { RootState } from "@/redux/store"
import delay from "@/utils/delay"
import { Box, Stack, Typography } from "@mui/material"
import { format } from "date-fns"
import { User } from "lucide-react"
import { useSelector } from "react-redux"

import type { IMessage } from "@/types/message.types"
import type { IUser } from "@/types/user.types"
import useIsVisible from "@/hooks/use-is-visible"

import Loading from "../Loading"
import Message from "./message"
import scrollToBottom from "./scroll-to-bottom"

interface IProps {
  user: IUser | null
  messages: IMessage[]
  agentId?: string
  contactId?: string
}

export default function ListMessages({
  user,
  messages,
  agentId,
  contactId,
}: IProps) {
  const [editMessageId, setEditMessageId] = useState<string | null>(null)

  const ref = useRef<HTMLDivElement>(null)

  const isVisible = useIsVisible(ref)

  const [loadMore, { isLoading }] = useLazyLoadMoreMessagesQuery()

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

  async function onScrollTop(e: UIEvent<HTMLDivElement>) {
    const element = e.target as HTMLDivElement

    if (messages.length > 0 && element.scrollTop === 0) {
      const { _id, orgId, roomId } = messages[0]

      const data = await loadMore({ orgId, roomId, messageId: _id }).unwrap()

      await delay()

      const currMessage = document.getElementById(`message-${_id}`)
      const listMessages = document.getElementById("messages-list")

      if (listMessages && currMessage && data.length > 0) {
        const { top, height } = currMessage.getBoundingClientRect()

        listMessages.scrollTo({
          top: top - height - 124,
          behavior: "smooth",
        })
      }
    }
  }

  return (
    <>
      <Stack
        id="messages-list"
        sx={{
          pt: { xs: 2, md: 3 },
          px: { xs: 2, md: 5 },
          gap: 1.5,
          height: "calc(100vh - 25.5rem)",
          overflowY: "auto",
        }}
        onScroll={onScrollTop}
      >
        {isLoading && <Loading sx={{ py: 2 }} />}

        {messages.map(
          ({ _id, senderName, msg, createdAt, editable, sharelink }, index) => {
            const currentUser = senderName === user?.username

            return (
              <Stack
                sx={{
                  ml: currentUser ? "auto" : 0,
                  gap: 1.5,
                  width: "fit-content",
                  flexDirection: "row",
                }}
                id={`message-${_id}`}
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
                    message={
                      msg
                        ? sharelink
                          ? `${msg} \n ${
                              agentId
                                ? `https://avahomeai.com/app/agent-orgs/${agentId}/${sharelink}`
                                : `https://avahomeai.com/app/contact-orgs/${contactId}/${sharelink}`
                            }`
                          : msg
                        : ""
                    }
                    username={senderName}
                    messageId={_id}
                    currentUser={currentUser}
                    editMessageId={editMessageId}
                    onEditMessageId={setEditMessageId}
                    editable={editable}
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
          }
        )}

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
