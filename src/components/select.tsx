import { forwardRef } from "react"
import { cn } from "@/utils/classname"
import { useController, useFormContext } from "react-hook-form"
import ReactSelect, {
  GroupBase,
  type Props,
  type SelectInstance,
} from "react-select"
import { tv } from "tailwind-variants"

type Option = {
  label: string
  value: string
}

interface SelectProps extends Props<Option, boolean, GroupBase<Option>> {
  label: string
  error?: string
}

interface FormSelectProps extends SelectProps {
  name: string
}

export const Select = forwardRef<
  SelectInstance<Option, boolean, GroupBase<Option>>,
  SelectProps
>(({ id, label, error, className, ...rest }, ref) => {
  return (
    <div className={cn("flex flex-col", className)}>
      <div className="flex items-center mb-2 justify-between gap-2">
        <label className="font-medium text-gray-800">{label}</label>

        {error && <p className="text-sm text-right text-red-500">{error}</p>}
      </div>

      <ReactSelect
        id={id}
        ref={ref}
        {...rest}
        className="w-full"
        instanceId={id}
        // classNames={{
        //   menu: () => menu(),
        //   option: () => option(),
        //   control: () => control({ focused: focus, invalid: !!errors[name] }),
        //   singleValue: () => singleValue(),
        //   valueContainer: () => valueContainer(),
        //   indicatorSeparator: () => "!hidden",
        // }}
      />
    </div>
  )
})

Select.displayName = "Select"

export function FormSelect({ name, ...rest }: FormSelectProps) {
  const {
    field,
    formState: { errors },
  } = useController({ name })

  return (
    <Select
      id={name}
      {...rest}
      {...field}
      error={errors[name]?.message as string}
    />
  )
}
