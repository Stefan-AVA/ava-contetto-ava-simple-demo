import {
  Stack,
  styled,
  TextField,
  type OutlinedTextFieldProps,
  type SxProps,
} from "@mui/material"
import { Minus, Plus } from "lucide-react"

import { Operator } from "@/types/searchResult.types"

export type TextFieldOperatorValue = {
  value: number
  operator: Operator
}

interface InputProps
  extends Omit<OutlinedTextFieldProps, "variant" | "onChange"> {
  value: TextFieldOperatorValue | null
  onChange: (props: TextFieldOperatorValue) => void
}

const Button = styled("button")(
  ({ theme }) => `
  color: ${theme.palette.grey[500]};
  width: 1.5rem;
  border: 1px solid;
  height: 1.5rem;
  display: flex;
  padding: 0;
  transition: all .3s ease-in-out;
  align-items: center;
  aspect-ratio: 1/1;
  border-color: ${theme.palette.grey[500]};
  border-radius: 50%;
  justify-content: center;

  &:hover {
    color: ${theme.palette.grey[600]};
    cursor: pointer;
    border-color: ${theme.palette.grey[600]};
  }

  &:focus-visible {
    outline: 0;
  }
`
)

export default function TextFieldWithOperators({
  value,
  onChange,
  ...rest
}: InputProps) {
  const data = {
    value: 0,
    operator: "=" as Operator,
    ...(value ?? {}),
  }

  function onToggle(operator: Operator) {
    let key = operator

    if (data.operator === operator) key = "="

    onChange({ value: data.value, operator: key })
  }

  function applyButtonStyles(operator: Operator) {
    const styles: SxProps = {
      color: "white",
      bgcolor: "primary.main",
      borderColor: "primary.main",
    }

    if (data.operator === operator) return styles

    return undefined
  }

  return (
    <Stack
      sx={{
        gap: 0.5,
        flex: 1,
        alignItems: "center",
        flexDirection: "row",
      }}
    >
      <TextField
        {...rest}
        size={rest.size ?? "small"}
        value={data.value}
        onChange={({ target }) =>
          onChange({
            value: Number(target.value) ?? 0,
            operator: data.operator,
          })
        }
        fullWidth
        InputProps={{ type: "number" }}
      />

      <Button sx={applyButtonStyles("-")} onClick={() => onToggle("-")}>
        <Minus size={16} />
      </Button>

      <Button sx={applyButtonStyles("+")} onClick={() => onToggle("+")}>
        <Plus size={16} />
      </Button>
    </Stack>
  )
}
