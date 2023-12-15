import { CSSProperties, useMemo, useRef } from "react"
import { useGetContactsQuery } from "@/redux/apis/org"
import { useGetAllRoomsQuery } from "@/redux/apis/room"
import { Stack } from "@mui/material"
import { useTheme, type Palette } from "@mui/material/styles"
import { Mention, MentionsInput, type MentionsInputProps } from "react-mentions"

interface TextFieldProps
  extends Pick<MentionsInputProps, "value" | "onChange"> {
  orgId: string
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

export default function TextField({ orgId, onSend, ...rest }: TextFieldProps) {
  const ref = useRef<HTMLTextAreaElement>(null)

  const { palette } = useTheme()

  const { data: rooms } = useGetAllRoomsQuery(
    {
      orgId,
    },
    {
      skip: !orgId,
    }
  )

  const { data: contacts } = useGetContactsQuery(
    {
      orgId,
    },
    {
      skip: !orgId,
    }
  )

  async function onKeyDown(code: string, shiftKey: boolean) {
    if (code === "Enter" && !shiftKey) {
      await onSend()

      return
    }

    if (code === "Enter" && shiftKey && ref.current) {
      ref.current.rows += 1
    }
  }

  const formatRooms = useMemo(() => {
    if (rooms && rooms.length > 0) {
      return rooms.map((room) => ({
        id: room.name!,
        display: room.name!,
      }))
    }

    return []
  }, [rooms])

  const formatContacts = useMemo(() => {
    if (contacts && contacts.length > 0) {
      return contacts.map((contact) => ({
        id: contact.username || contact.name,
        display: contact.name,
      }))
    }

    return []
  }, [contacts])

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