import {
  AlignCenter,
  AlignJustify,
  AlignLeft,
  AlignRight,
  Bold,
  Italic,
  Underline,
} from "lucide-react"

export const styles = [
  {
    key: "700",
    icon: Bold,
    type: "fontWeight",
  },
  {
    key: "italic",
    icon: Italic,
    type: "fontStyle",
  },
  {
    key: true,
    icon: Underline,
    type: "underline",
  },
]

export const textAligns = [
  {
    key: "left",
    icon: AlignLeft,
  },
  {
    key: "center",
    icon: AlignCenter,
  },
  {
    key: "right",
    icon: AlignRight,
  },
  {
    key: "justify",
    icon: AlignJustify,
  },
]
