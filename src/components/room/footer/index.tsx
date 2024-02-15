import { useEffect, useState } from "react"
import Image from "next/image"
import { useSocket } from "@/providers/SocketProvider"
import {
  useAddAttachmentMutation,
  useDeleteAttachmentMutation,
} from "@/redux/apis/message"
import type { RootState } from "@/redux/store"
import { getToken } from "@/redux/token"
import delay from "@/utils/delay"
import toBase64 from "@/utils/toBase64"
import { Box, CircularProgress, Stack } from "@mui/material"
import { Paperclip, Send, X } from "lucide-react"
import type { OptionProps } from "rc-mentions/lib/Option"
import { useSelector } from "react-redux"

import { ClientMessageType, type IMsgAttachment } from "@/types/message.types"

import scrollToBottom from "../scroll-to-bottom"
import EmojiPicker from "./emoji-picker"
import TextField, { type PasteImageParams } from "./text-field"

export default function Footer() {
  const socket = useSocket()

  const user = useSelector((state: RootState) => state.app.user)
  const room = useSelector((state: RootState) => state.rooms.currentRoom)

  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState("")
  const [fileUrl, setFileUrl] = useState<IMsgAttachment[]>([])
  const [mentions, setMentions] = useState<OptionProps[]>([])
  const [channels, setChannels] = useState<OptionProps[]>([])

  const [addAttachment, { isLoading: isLoadingAddAttachment }] =
    useAddAttachmentMutation()

  const [deleteAttachment, { isLoading: isLoadingDeleteAttachment }] =
    useDeleteAttachmentMutation()

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

    const token = getToken()

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
      attachmentIds: fileUrl.map(({ _id }) => _id),
    })

    stopTyping()

    setMessage("")

    setFileUrl([])

    await delay(300)

    scrollToBottom()

    setLoading(false)
  }

  async function onUploadFiles(files: FileList | null) {
    if (room && files) {
      for await (const file of Array.from(files)) {
        const base64 = await toBase64(file)

        const response = await addAttachment({
          name: file.name,
          size: file.size,
          orgId: room.orgId,
          roomId: room._id,
          base64,
          mimetype: file.type,
        }).unwrap()

        setFileUrl((prev) => [...prev, response])
      }
    }
  }

  async function onPastImage(params: PasteImageParams) {
    if (room) {
      const response = await addAttachment({
        name: "file",
        orgId: room.orgId,
        roomId: room._id,
        ...params,
      }).unwrap()

      setFileUrl((prev) => [...prev, response])
    }
  }

  async function onDeleteImage(attachmentId: string) {
    if (room) {
      await deleteAttachment({
        orgId: room.orgId,
        roomId: room._id,
        attachmentId,
      })

      setFileUrl((prev) => prev.filter((file) => file._id !== attachmentId))
    }
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
    <Stack
      sx={{
        px: { xs: 2, md: 5 },
        py: { xs: 2, md: 3 },
        gap: { xs: 1, md: 2 },
        height: fileUrl.length > 0 ? "9.625rem" : "6.25rem",
        alignItems: "flex-start",
        flexDirection: "row",
      }}
    >
      <EmojiPicker
        sx={{ top: ".625rem", position: "relative" }}
        onMessage={setMessage}
      />

      <TextField
        value={message}
        onSend={submit}
        onBlur={stopTyping}
        onChange={onChangeTextField}
        onPastImage={onPastImage}
        setMentions={setMentions}
        setChannels={setChannels}
      >
        <Stack sx={{ gap: 1, alignItems: "center", flexDirection: "row" }}>
          {fileUrl.map((file) => (
            <Box sx={{ position: "relative" }} key={file._id}>
              <Image
                src={file.url}
                alt=""
                width={56}
                style={{
                  width: "3.5rem",
                  height: "3.5rem",
                  objectFit: "cover",
                  borderRadius: ".5rem",
                }}
                height={56}
              />

              <Box
                sx={{
                  p: 0.25,
                  top: ".25rem",
                  right: ".25rem",
                  color: "white",
                  bgcolor: "primary.main",
                  position: "absolute",
                  borderRadius: "50%",
                }}
                onClick={() => onDeleteImage(file._id)}
                disabled={isLoadingDeleteAttachment}
                component="button"
              >
                {isLoadingDeleteAttachment ? (
                  <CircularProgress color="info" size="1rem" />
                ) : (
                  <X size={16} />
                )}
              </Box>
            </Box>
          ))}

          {isLoadingAddAttachment && (
            <Stack
              sx={{
                width: "3.5rem",
                height: "3.5rem",
                bgcolor: "gray.200",
                alignItems: "center",
                borderRadius: ".5rem",
                justifyContent: "center",
              }}
            >
              <CircularProgress size="1.25rem" />
            </Stack>
          )}
        </Stack>
      </TextField>

      <Box sx={{ top: ".625rem", color: "primary.main", position: "relative" }}>
        <Paperclip />

        <Box
          sx={{
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            cursor: "pointer",
            opacity: 0,
            position: "absolute",
          }}
          type="file"
          accept=".png, .jpg, .jpeg, .webp"
          multiple
          component="input"
          onChange={({ target }) => onUploadFiles(target.files)}
        />
      </Box>

      <Box
        sx={{ top: ".625rem", color: "secondary.main", position: "relative" }}
        onClick={submit}
        component="button"
      >
        {loading ? <CircularProgress size="1.5rem" /> : <Send />}
      </Box>
    </Stack>
  )
}
