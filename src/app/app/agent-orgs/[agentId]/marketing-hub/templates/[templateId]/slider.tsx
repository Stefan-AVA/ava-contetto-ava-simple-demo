import {
  Slider as MUISlider,
  Stack,
  type SliderProps as MUISliderProps,
} from "@mui/material"
import { Minus, Plus } from "lucide-react"

interface SliderProps extends Omit<MUISliderProps, "value"> {
  value: number
  onAdd: (value: number) => void
  onRemove: (value: number) => void
}

export default function Slider({
  value,
  onAdd,
  onRemove,
  ...rest
}: SliderProps) {
  return (
    <Stack
      sx={{
        gap: 3,
        alignItems: "center",
        flexDirection: "row",
      }}
    >
      <Stack
        sx={{
          width: "1.5rem",
          color: "primary.main",
          height: "1.5rem",
          cursor: value <= 0.1 ? "not-allowed" : "pointer",
          border: "1px solid",
          alignItems: "center",
          borderColor: "primary.main",
          borderRadius: "50%",
          justifyContent: "center",
        }}
        onClick={() => onRemove(value > 0.1 ? value - 0.1 : value)}
        disabled={value <= 0.1}
        component="button"
      >
        <Minus />
      </Stack>

      <MUISlider {...rest} value={value} valueLabelDisplay="auto" />

      <Stack
        sx={{
          width: "1.5rem",
          color: "primary.main",
          height: "1.5rem",
          cursor: value >= 2 ? "not-allowed" : "pointer",
          border: "1px solid",
          alignItems: "center",
          borderColor: "primary.main",
          borderRadius: "50%",
          justifyContent: "center",
        }}
        onClick={() => onAdd(value < 2 ? value + 0.1 : value)}
        disabled={value >= 2}
        component="button"
      >
        <Plus />
      </Stack>
    </Stack>
  )
}
