import { useState, type Dispatch, type SetStateAction } from "react"
import dynamic from "next/dynamic"
import { Box } from "@mui/material"
import { Smile } from "lucide-react"

import Dropdown from "@/components/drop-down"

const Picker = dynamic(
  () => {
    return import("emoji-picker-react")
  },
  { ssr: false }
)

interface EmojiPickerProps {
  onMessage: Dispatch<SetStateAction<string>>
}

export default function EmojiPicker({ onMessage }: EmojiPickerProps) {
  const [open, setOpen] = useState(false)

  return (
    <Dropdown
      sx={{ display: "flex" }}
      open={open}
      ancher={
        <Box
          sx={{ color: "gray.500" }}
          onClick={() => setOpen(true)}
          component="button"
        >
          <Smile />
        </Box>
      }
      onClose={() => setOpen(false)}
      anchorOrigin={{
        vertical: "top",
        horizontal: "left",
      }}
    >
      <Picker
        onEmojiClick={({ emoji }) => onMessage((prev) => `${prev} ${emoji}`)}
        lazyLoadEmojis
      />
    </Dropdown>
  )
}
