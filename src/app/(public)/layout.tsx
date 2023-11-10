import type { PropsWithChildren } from "react"
import { Mail } from "lucide-react"

export default function Layout({ children }: PropsWithChildren) {
  return (
    <div className="flex flex-col">
      <div className="absolute flex items-center justify-end w-full pt-5 px-8 md:pt-12 md:px-16">
        <button
          type="button"
          className="flex items-center justify-center border border-solid border-green-500 rounded-full w-12 h-12 md:w-16 md:h-16"
        >
          <Mail className="text-gray-800" />
        </button>
      </div>

      <div className="flex flex-col container pt-32 pb-24 relative">
        {children}
      </div>
    </div>
  )
}
