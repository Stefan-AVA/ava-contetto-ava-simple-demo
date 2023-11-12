import { forwardRef, type ComponentProps } from "react"
import { cn } from "@/utils/classname"
import { Check } from "lucide-react"
import { useFormContext } from "react-hook-form"

type CheckboxProps = ComponentProps<"input"> & {
  label: string
  error?: string
}

type FormCheckboxProps = CheckboxProps & {
  name: string
}

export const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(
  ({ label, error, className, ...rest }, ref) => {
    return (
      <div className={cn("flex flex-col", className)}>
        <div className="flex group relative gap-2 items-center">
          <input
            ref={ref}
            {...rest}
            type="checkbox"
            className="peer appearance-none transition-colors duration-300 w-5 h-5 rounded border border-solid border-gray-300 checked:bg-blue-500 checked:border-blue-500 group-hover:border-blue-500 cursor-pointer disabled:cursor-not-allowed disabled:opacity-50"
          />

          <Check
            size={12}
            className="hidden absolute text-white left-1 pointer-events-none peer-checked:flex peer-disabled:cursor-not-allowed peer-disabled:opacity-50"
          />

          <label
            htmlFor={rest.id}
            className="text-sm text-gray-800 cursor-pointer peer-checked:text-blue-500 peer-disabled:cursor-not-allowed peer-disabled:opacity-50"
          >
            {label}
          </label>
        </div>

        {error && <p className="text-sm ml-auto mt-1 text-red-500">{error}</p>}
      </div>
    )
  }
)

Checkbox.displayName = "Checkbox"

export function FormCheckbox({ name, ...rest }: FormCheckboxProps) {
  const {
    register,
    formState: { errors },
  } = useFormContext()

  return (
    <Checkbox
      id={name}
      {...rest}
      {...register(name)}
      error={errors[name]?.message as string}
    />
  )
}
