import { ComponentProps } from "react"
import { tv, type VariantProps } from "tailwind-variants"

const spinner = tv({
  base: "animate-spin",

  variants: {
    size: {
      sm: "h-5 w-5",
      md: "h-8 w-8",
    },
    variant: {
      gray: "text-gray-500",
      white: "text-white",
      primary: "text-cyan-500",
    },
  },
  defaultVariants: {
    size: "sm",
    variant: "gray",
  },
})

export interface SpinnerProps
  extends ComponentProps<"svg">,
    VariantProps<typeof spinner> {}

export default function Spinner({ size, variant, ...rest }: SpinnerProps) {
  return (
    <svg
      {...rest}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      className={spinner({ size, variant })}
    >
      <circle
        r="10"
        cx="12"
        cy="12"
        stroke="currentColor"
        className="opacity-25"
        strokeWidth="4"
      />
      <path
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
        fill="currentColor"
        className="opacity-75"
      />
    </svg>
  )
}
