import { forwardRef, type ComponentProps } from "react"
import { cn } from "@/utils/classname"
import { useFormContext } from "react-hook-form"

interface InputProps extends ComponentProps<"input"> {
  label: string
}

interface FormInputProps extends InputProps {
  name: string
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, className }, ref) => {
    return (
      <div className={cn("flex flex-col", className)}>
        <label className="mb-2 font-medium text-gray-800">{label}</label>

        <div className="flex items-center relative">
          <input
            ref={ref}
            className="w-full border border-solid border-gray-300 rounded-lg py-3 px-5 text-sm text-gray-700 placeholder:text-gray-400 outline-none transition-all duration-300 hover:border-blue-500"
          />
        </div>
      </div>
    )
  }
)

Input.displayName = "Input"

export function FormInput({ name, ...rest }: FormInputProps) {
  const { register } = useFormContext()

  return <Input {...rest} {...register(name)} />
}
