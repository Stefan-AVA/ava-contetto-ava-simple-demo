import { useState, type Dispatch, type SetStateAction } from "react"
import dynamic from "next/dynamic"
import { Box, type StackProps } from "@mui/material"
import { Smile } from "lucide-react"

import Dropdown from "@/components/drop-down"

const Picker = dynamic(
  () => {
    return import("emoji-picker-react")
  },
  { ssr: true }
)

interface EmojiPickerProps extends StackProps {
  onMessage: Dispatch<SetStateAction<string>>
}

export default function EmojiPicker({ sx, onMessage }: EmojiPickerProps) {
  const [open, setOpen] = useState(false)

  return (
    <Dropdown
      sx={{ ...sx, display: "flex" }}
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
      <Box style={{ minWidth: "21.875rem", minHeight: "28.125rem" }}>
        <Picker
          onEmojiClick={({ emoji }) => onMessage((prev) => `${prev} ${emoji}`)}
          lazyLoadEmojis
        />
      </Box>
    </Dropdown>
  )
}
