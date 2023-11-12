import { forwardRef } from "react"
import { cn } from "@/utils/classname"
import { useController } from "react-hook-form"
import ReactSelect, {
  GroupBase,
  type Props,
  type SelectInstance,
} from "react-select"
import { tv } from "tailwind-variants"
import { z } from "zod"

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

const style = tv({
  slots: {
    option: "!text-sm !text-gray-600 transition-all duration-300",
    control:
      "w-full !border-gray-300 !rounded-lg !outline-none !ring-0 hover:!border-blue-500 transition-all duration-300",
    placeholder: "!text-gray-400",
    valueContainer: "!py-2 !px-5 !text-sm !text-gray-700",
  },

  variants: {
    focused: {
      true: {
        option: "!bg-gray-200",
      },

      false: {
        option: "!bg-transparent",
      },
    },

    selected: {
      true: {
        option: "!bg-blue-500 !text-white",
      },
    },
  },
})

export function schema(errorMessage?: string) {
  return z.object(
    {
      value: z.string(),
      label: z.string(),
    },
    { required_error: errorMessage }
  )
}

export const Select = forwardRef<
  SelectInstance<Option, boolean, GroupBase<Option>>,
  SelectProps
>(({ id, label, error, className, ...rest }, ref) => {
  const { option, control, placeholder, valueContainer } = style()

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
        classNames={{
          option: ({ isFocused, isSelected }) =>
            option({ focused: isFocused, selected: isSelected }),
          control: () => control(),
          placeholder: () => placeholder(),
          valueContainer: () => valueContainer(),
          indicatorSeparator: () => "!hidden",
        }}
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
