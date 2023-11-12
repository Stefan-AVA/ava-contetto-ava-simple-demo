import { forwardRef, type ComponentProps } from "react"
import { cn } from "@/utils/classname"
import { tv, type VariantProps } from "tailwind-variants"

import Spinner from "./spinner"

const button = tv({
  base: "inline-flex h-12 py-3 px-6 items-center justify-center rounded-lg font-medium transition-colors disabled:pointer-events-none disabled:opacity-50",

  variants: {
    variant: {
      primary: "bg-blue-500 text-white hover:bg-blue-800",
    },
  },
  defaultVariants: {
    variant: "primary",
  },
})

export interface ButtonProps
  extends ComponentProps<"button">,
    VariantProps<typeof button> {
  loading?: boolean
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, loading, children, ...props }, ref) => {
    return (
      <button
        ref={ref}
        {...props}
        className={cn(button({ variant, className }))}
      >
        {loading && <Spinner variant="white" />}

        {!loading && children}
      </button>
    )
  }
)

Button.displayName = "Button"

export default Button
