import {
  Unstable_NumberInput as BaseNumberInput,
  type NumberInputProps,
} from "@mui/base/Unstable_NumberInput"
import { styled, TextField } from "@mui/material"
import { Minus, Plus } from "lucide-react"

interface CustomNumberInputProps extends NumberInputProps {}

const Stack = styled("div")(
  () => `
  gap: .5rem;
  display: flex;
  align-items: center;

  .increment {
    order: 3;
  }

  .decrement {
    order: 1;
  }

  .text-field {
    order: 2;
  }
`
)

const Button = styled("button")(
  ({ theme }) => `
  color: ${theme.palette.grey[500]};
  width: 1.5rem;
  border: 1px solid;
  height: 1.5rem;
  display: flex;
  transition: all .3s ease-in-out;
  align-items: center;
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

export default function NumberInput(props: CustomNumberInputProps) {
  return (
    <BaseNumberInput
      {...props}
      slots={{
        root: Stack,
        input: TextField,
        incrementButton: Button,
        decrementButton: Button,
      }}
      slotProps={{
        input: {
          size: "small" as any,
          className: "text-field",
        },
        incrementButton: {
          children: <Plus />,
          className: "increment",
        },
        decrementButton: {
          children: <Minus />,
          className: "decrement",
        },
      }}
    />
  )
}
