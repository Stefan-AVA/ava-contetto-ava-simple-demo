import {
  Dispatch,
  SetStateAction,
  useMemo,
  useRef,
  useState,
  type KeyboardEvent,
} from "react"
import type { RootState } from "@/redux/store"
import { Box } from "@mui/material"
import { useTheme } from "@mui/material/styles"
import Mentions, { type MentionsProps } from "rc-mentions"
import { MentionsRef } from "rc-mentions/lib/Mentions"
import { OptionProps } from "rc-mentions/lib/Option"
import { useSelector } from "react-redux"

import { RoomType } from "@/types/room.types"

const { Option } = Mentions

interface TextFieldProps extends Pick<MentionsProps, "value" | "onChange"> {
  onSend: () => Promise<void>
  setMentions: Dispatch<SetStateAction<OptionProps[]>>
  setChannels: Dispatch<SetStateAction<OptionProps[]>>
}

export default function TextField({
  onSend,
  setMentions,
  setChannels,
  ...rest
}: TextFieldProps) {
  const ref = useRef<MentionsRef | null>(null)

  const [rows, setRows] = useState(1)
  const [prefix, setPrefix] = useState("@")

  const { typography } = useTheme()

  const user = useSelector((state: RootState) => state.app.user)
  const rooms = useSelector((state: RootState) => state.rooms.rooms)
  const room = useSelector((state: RootState) => state.rooms.currentRoom)

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
            .filter((c) => c.username !== user?.username)
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
          padding: ".875rem 1.5rem",
          outline: "none",
          fontSize: ".875rem",
          fontFamily: typography.fontFamily,
          fontWeight: 500,
          lineHeight: "1rem",
          borderRadius: ".5rem",
          backgroundColor: "gray.200",

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
        placement="top"
        autoFocus
        onPressEnter={onPressEnter}
        placeholder="Write your message here."
        transitionName="motion-zoom"
        onSelect={(option, prefix) => {
          console.log(option, prefix)
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
        ref={ref}
      >
        {data[prefix as keyof typeof data].map((field) => (
          <Option key={field.value} value={field.value}>
            {field.label}
          </Option>
        ))}
      </Mentions>
    </Box>
  )
}
