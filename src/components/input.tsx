import { forwardRef, type ComponentProps } from "react"
import { useFormContext } from "react-hook-form"

interface InputProps extends ComponentProps<"input"> {
  label: string
}

interface FormInputProps extends InputProps {
  name: string
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label }, ref) => {
    return (
      <div className="flex flex-col">
        <label>{label}</label>

        <input ref={ref} />
      </div>
    )
  }
)

Input.displayName = "Input"

export function FormInput({ name, ...rest }: FormInputProps) {
  const { register } = useFormContext()

  return <Input {...rest} {...register(name)} />
}
