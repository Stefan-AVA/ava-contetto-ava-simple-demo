import { useRef } from "react"
import { Stack } from "@mui/material"
import { Mention, MentionsInput, type MentionsInputProps } from "react-mentions"

interface TextFieldProps
  extends Pick<MentionsInputProps, "value" | "onChange"> {
  onSend: () => Promise<void>
}

const users = [
  {
    id: "isaac",
    display: "Isaac Newton",
  },
  {
    id: "sam",
    display: "Sam Victor",
  },
  {
    id: "emma",
    display: "emmanuel@nobody.com",
  },
]

export default function TextField({ onSend, ...rest }: TextFieldProps) {
  const ref = useRef<HTMLTextAreaElement>(null)

  async function onKeyDown(code: string, shiftKey: boolean) {
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
        py: 1.75,
        px: 3,
        width: "100%",
        color: "gray.700",
        outline: "none",
        fontSize: ".875rem",
        fontWeight: 500,
        lineHeight: "1rem",
        borderRadius: ".5rem",
        backgroundColor: "gray.200",

        "&::placeholder": {
          color: "gray.400",
        },
      }}
      ref={ref as any}
      rows={1}
      component={MentionsInput}
      onKeyDown={({ code, shiftKey }) => onKeyDown(code, shiftKey)}
      placeholder="Write your message here."
    >
      <Mention trigger="@" data={users} displayTransform={(id) => `@${id}`} />
      <Mention trigger="#" data={users} displayTransform={(id) => `#${id}`} />
    </Stack>
  )
}
