import "react-phone-number-input/style.css"

import {
  forwardRef,
  type Component,
  type ComponentProps,
  type PropsWithChildren,
} from "react"
import { cn } from "@/utils/classname"
import CustomPhoneInput, {
  type DefaultInputComponentProps,
  type Props,
  type State,
} from "react-phone-number-input"

type CustomInputProps = Props<DefaultInputComponentProps>

type PhoneInputRef = Component<CustomInputProps, State<CustomInputProps>>

interface WrapperProps
  extends PropsWithChildren,
    Pick<ComponentProps<"input">, "className"> {
  label: string
  error?: string
}

interface PhoneInputProps extends CustomInputProps, WrapperProps {}

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

export const PhoneInput = forwardRef<PhoneInputRef, PhoneInputProps>(
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
