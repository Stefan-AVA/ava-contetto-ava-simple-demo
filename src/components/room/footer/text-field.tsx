import { CSSProperties, useMemo, useRef } from "react"
import type { RootState } from "@/redux/store"
import { Stack } from "@mui/material"
import { useTheme, type Palette } from "@mui/material/styles"
import { Mention, MentionsInput, type MentionsInputProps } from "react-mentions"
import { useSelector } from "react-redux"

import { RoomType } from "@/types/room.types"

interface TextFieldProps
  extends Pick<MentionsInputProps, "value" | "onChange"> {
  onSend: () => Promise<void>
}

function styles(palette: Palette) {
  return {
    input: {
      padding: ".875rem 1.5rem",
      outline: "none",

      "&::placeholder": {
        color: "gray.400",
      },
    },

    control: {
      fontSize: ".875rem",
    },

    highlighter: {
      padding: ".875rem 1.5rem",
    },

    suggestions: {
      list: {
        border: "1px solid #F5F4F8",
        fontSize: 14,
        borderRadius: ".25rem",
        backgroundColor: palette.background.default,
      },
      item: {
        padding: ".5rem 1rem",
        borderBottom: "1px solid #F5F4F8",

        "&focused": {
          color: palette.background.default,
          backgroundColor: palette.secondary.main,
        },
      },
    },
  } as CSSProperties
}

export default function TextField({ onSend, ...rest }: TextFieldProps) {
  const ref = useRef<HTMLTextAreaElement>(null)

  const { palette } = useTheme()

  const user = useSelector((state: RootState) => state.app.user)
  const rooms = useSelector((state: RootState) => state.rooms.rooms)
  const room = useSelector((state: RootState) => state.rooms.currentRoom)

  const formatRooms = useMemo(() => {
    if (rooms && rooms.length > 0) {
      return rooms
        .filter((room) => room.type === RoomType.channel)
        .map((room) => ({
          id: room.name!,
          display: room.name!,
        }))
    }

    return []
  }, [rooms])

  const formatContacts = useMemo(() => {
    if (room) {
      return [
        ...room.agents
          .filter((a) => a.username !== user?.username)
          .map((a) => ({ id: a.username, display: a.username })),
        ...room.contacts
          .filter((c) => c.username !== user?.username)
          .map((c) => ({ id: c.username, display: c.username })),
      ]
    }

    return []
  }, [room])

  const onKeyDown = async (code: string, shiftKey: boolean) => {
    if (code === "Enter" && !shiftKey) {
      await onSend()

      return
    }

    if (code === "Enter" && shiftKey && ref.current) {
      ref.current.rows += 1
    }
  }

  return (
    <Stack
      {...rest}
      sx={{
        width: "100%",
        color: "gray.700",
        minHeight: "2.75rem",
        fontWeight: 500,
        lineHeight: "1rem",
        borderRadius: ".5rem",
        backgroundColor: "gray.200",
      }}
      ref={ref as any}
      rows={1}
      style={styles(palette)}
      component={MentionsInput}
      onKeyDown={({ code, shiftKey }) => onKeyDown(code, shiftKey)}
      placeholder="Write your message here."
    >
      <Mention
        data={formatContacts}
        trigger="@"
        displayTransform={(id) => `@${id}`}
      />

      <Mention
        data={formatRooms}
        trigger="#"
        displayTransform={(id) => `#${id}`}
      />
    </Stack>
  )
}
