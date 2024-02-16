import {
  useMemo,
  useState,
  type Dispatch,
  type KeyboardEvent,
  type PropsWithChildren,
  type SetStateAction,
} from "react"
import { useParams } from "next/navigation"
import type { RootState } from "@/redux/store"
import toBase64 from "@/utils/toBase64"
import { Box, useTheme } from "@mui/material"
import Mentions, { type MentionsProps } from "rc-mentions"
import type { OptionProps } from "rc-mentions/lib/Option"
import { useSelector } from "react-redux"

import { RoomType } from "@/types/room.types"
import useGetOrgRooms from "@/hooks/use-get-org-rooms"

const { Option } = Mentions

export type PasteImageParams = {
  size: number
  base64: string
  mimetype: string
}

interface TextFieldProps
  extends Pick<MentionsProps, "value" | "onBlur" | "onChange"> {
  onSend: () => Promise<void>
  variant?: "DEFAULT" | "TINY"
  onPastImage?: (params: PasteImageParams) => Promise<void>
  setMentions: Dispatch<SetStateAction<OptionProps[]>>
  setChannels: Dispatch<SetStateAction<OptionProps[]>>
}

export default function TextField({
  onSend,
  variant = "DEFAULT",
  children,
  setMentions,
  setChannels,
  onPastImage,
  ...rest
}: PropsWithChildren<TextFieldProps>) {
  const { agentId, contactId } = useParams()

  const { typography } = useTheme()

  const [rows, setRows] = useState(1)
  const [prefix, setPrefix] = useState("@")

  const user = useSelector((state: RootState) => state.app.user)
  const room = useSelector((state: RootState) => state.rooms.currentRoom)
  const rooms = useGetOrgRooms({
    agentId: agentId as string,
    contactId: contactId as string,
  })

  const data = useMemo(() => {
    function formatRooms() {
      if (rooms && rooms.length > 0) {
        return rooms
          .filter((room) => room.type === RoomType.channel)
          .map((room) => ({
            value: room.name!,
            label: room.name!,
          }))
      }

      return []
    }

    function formatContacts() {
      if (room) {
        return [
          ...room.agents
            .filter((a) => a.username !== user?.username)
            .map((a) => ({ value: a.username, label: a.username })),
          ...room.contacts
            .filter((c) => c.username && c.username !== user?.username)
            .map((c) => ({ value: c.username, label: c.username })),
        ]
      }

      return []
    }

    return {
      "@": formatContacts(),
      "#": formatRooms(),
    }
  }, [room, rooms, user])

  function onChange(text: string) {
    if (rest.onChange) rest.onChange(text)

    if (text.length <= 0) setRows(1)
  }

  async function onKeyDown(e: KeyboardEvent<HTMLTextAreaElement>) {
    if (onPastImage && e.code === "KeyV") {
      const clipboardItems = await navigator.clipboard.read()

      console.log({ clipboardItems })

      const findImageClipboard = clipboardItems.find((clipboardItem) =>
        clipboardItem.types.includes("image/png")
      )

      if (!findImageClipboard) return

      const blobOutput = await clipboardItems[0].getType("image/png")

      const data = URL.createObjectURL(blobOutput)

      const copiedImage = await fetch(data)

      const blob = await copiedImage.blob()

      const base64 = await toBase64(blob)

      onPastImage({
        size: blob.size,
        base64,
        mimetype: blob.type,
      })
    }
  }

  async function onPressEnter(e: KeyboardEvent<HTMLTextAreaElement>) {
    if (e.code === "Enter" && !e.shiftKey) {
      e.preventDefault()

      await onSend()

      setRows(1)

      return
    }

    if (e.code === "Enter" && e.shiftKey) setRows((prev) => prev + 1)
  }

  return (
    <Box
      sx={{
        width: "100%",

        textarea: {
          color: "gray.700",
          width: "100%",
          resize: "none",
          padding: variant === "DEFAULT" ? ".875rem 1.5rem" : 0,
          outline: "none",
          fontSize: ".875rem",
          fontFamily: typography.fontFamily,
          fontWeight: 500,
          lineHeight: "1rem",
          borderRadius: variant === "DEFAULT" ? ".5rem" : 0,
          backgroundColor: variant === "DEFAULT" ? "gray.200" : "transparent",

          "&::placeholder": {
            color: "gray.400",
          },
        },
      }}
    >
      <Mentions
        {...rest}
        rows={rows}
        prefix={["@", "#"]}
        onChange={onChange}
        onSearch={(_, prefix) => setPrefix(prefix)}
        onSelect={(option, prefix) => {
          if (prefix === "@") {
            setMentions((prev) => [
              ...prev.filter((o) => o.value !== option.value),
              option,
            ])
          }
          if (prefix === "#") {
            setChannels((prev) => [
              ...prev.filter((o) => o.value !== option.value),
              option,
            ])
          }
        }}
        placement="top"
        autoFocus
        onKeyDown={onKeyDown}
        placeholder="Write your message here."
        onPressEnter={onPressEnter}
        transitionName="motion-zoom"
      >
        {data[prefix as keyof typeof data].map((field) => (
          <Option key={field.value} value={field.value}>
            {field.label}
          </Option>
        ))}
      </Mentions>

      {children}
    </Box>
  )
}
