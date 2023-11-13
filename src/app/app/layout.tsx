import type { PropsWithChildren } from "react"
import Image from "next/image"
import Link from "next/link"
import AuthLayout from "@/layouts/AuthLayout"
import Logo from "~/assets/logo-revault.png"
import { Mail } from "lucide-react"

import DropdownOptions from "./dropdown-options"

export default function Layout({ children }: PropsWithChildren) {
  return (
    <AuthLayout>
      <div className="flex flex-col">
        <div className="absolute flex items-center justify-between w-full pt-5 px-8 md:pt-8 md:px-16">
          <Link href="/" className="flex">
            <Image src={Logo} alt="Logo Revault" className="w-auto h-12" />
          </Link>

          <div className="flex items-center gap-4">
            <button
              type="button"
              className="flex items-center justify-center border border-solid border-green-500 rounded-full w-12 h-12 md:w-16 md:h-16"
            >
              <Mail className="text-blue-800" />
            </button>

            <div className="flex group flex-col items-center relative">
              <button
                type="button"
                className="flex items-center justify-center border border-solid border-gray-300 rounded-full p-0.5 w-12 h-12 md:w-16 md:h-16"
              >
                <Image
                  src="/assets/avatar.png"
                  alt=""
                  width={60}
                  height={60}
                  className="object-cover rounded-full"
                />
              </button>

              <div className="flex flex-col gap-2 opacity-0 absolute transition-all duration-300 bg-white shadow-2xl shadow-blue-800/20 p-2 rounded-lg top-10 pointer-events-none group-focus-within:opacity-100 group-focus-within:pointer-events-auto group-focus-within:top-20 w-60 right-0">
                <DropdownOptions />
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col container pt-40 pb-24 relative">
          {children}
        </div>
      </div>
    </AuthLayout>
  )
}
