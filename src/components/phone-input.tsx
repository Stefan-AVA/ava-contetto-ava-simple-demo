import "react-phone-number-input/style.css"

import {
  forwardRef,
  type Component,
  type ComponentProps,
  type PropsWithChildren,
} from "react"
import { cn } from "@/utils/classname"
import { useController } from "react-hook-form"
import CustomPhoneInput, {
  type DefaultInputComponentProps,
  type Props,
  type State,
} from "react-phone-number-input"
import PhoneInputWithReactHookForm from "react-phone-number-input/react-hook-form"

type CustomInputProps = Props<DefaultInputComponentProps>

type PhoneInputRef = Component<CustomInputProps, State<CustomInputProps>>

interface WrapperProps
  extends PropsWithChildren,
    Pick<ComponentProps<"input">, "className"> {
  label: string
  error?: string
}

interface PhoneInputProps extends CustomInputProps, WrapperProps {}

interface FormPhoneInputProps extends Omit<PhoneInputProps, "onChange"> {
  name: string
}

function Wrapper({ error, label, children, className }: WrapperProps) {
  return (
    <div className={cn("flex flex-col", className)}>
      <div className="flex items-center mb-2 justify-between gap-2">
        <label className="font-medium text-gray-800">{label}</label>

        {error && <p className="text-sm text-right text-red-500">{error}</p>}
      </div>

      {children}
    </div>
  )
}

const PhoneInput = forwardRef<PhoneInputRef, PhoneInputProps>(
  ({ error, label, className, ...rest }, ref) => {
    const wrapper = {
      error,
      label,
      className,
    }

    return (
      <Wrapper {...wrapper}>
        <CustomPhoneInput
          ref={ref}
          international={false}
          defaultCountry="CA"
          {...rest}
        />
      </Wrapper>
    )
  }
)

PhoneInput.displayName = "PhoneInput"

export function FormPhoneInput({
  name,
  error,
  label,
  className,
  ...rest
}: FormPhoneInputProps) {
  const wrapper = {
    error,
    label,
    className,
  }

  const {
    field,
    formState: { errors },
  } = useController({ name })

  return (
    <Wrapper {...wrapper}>
      <PhoneInputWithReactHookForm
        error={errors[name]?.message as string}
        international
        defaultCountry="CA"
        {...rest}
        {...field}
      />
    </Wrapper>
  )
}
