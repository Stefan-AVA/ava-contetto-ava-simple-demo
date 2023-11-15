import { forwardRef, useState, type ComponentProps } from "react"
import { cn } from "@/utils/classname"
import { Eye, EyeOff } from "lucide-react"
import { useFormContext } from "react-hook-form"

interface InputProps extends ComponentProps<"input"> {
  label: string
  error?: string
  isPassword?: boolean
}

interface FormInputProps extends InputProps {
  name: string
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, className, isPassword, ...rest }, ref) => {
    const [eye, setEye] = useState(false)

    function type() {
      if (isPassword) {
        if (eye) return "text"

        return "password"
      }

      return rest.type
    }

    return (
      <div className={cn("flex flex-col", className)}>
        <div className="flex items-center mb-2 justify-between gap-2">
          <label className="font-medium text-gray-800">{label}</label>

          {error && <p className="text-sm text-right text-red-500">{error}</p>}
        </div>

        <div className="flex items-center relative">
          <input
            {...rest}
            ref={ref}
            type={type()}
            className={cn(
              "w-full border border-solid border-gray-300 rounded-lg py-3 pl-5 text-sm text-gray-700 placeholder:text-gray-400 outline-none transition-all duration-300 hover:border-cyan-500",
              isPassword ? "pr-12" : "pr-5"
            )}
          />

          {isPassword && (
            <button
              type="button"
              onClick={() => setEye((prev) => !prev)}
              className="absolute right-4 text-gray-500"
            >
              {eye ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          )}
        </div>
      </div>
    )
  }
)

Input.displayName = "Input"

export function FormInput({ name, ...rest }: FormInputProps) {
  const {
    register,
    formState: { errors },
  } = useFormContext()

  return (
    <Input
      {...rest}
      {...register(name)}
      error={errors[name]?.message as string}
    />
  )
}
