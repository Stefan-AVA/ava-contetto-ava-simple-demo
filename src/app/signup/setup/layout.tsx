import type { PropsWithChildren } from "react"
import Image from "next/image"
import Logo from "~/assets/logo-ava.svg"

export default function Layout({ children }: PropsWithChildren) {
  return (
    <div className="flex flex-col">
      <div className="py-3 flex items-center justify-between w-full px-8 bg-gray-200 border-b border-solid border-b-gray-300 md:px-16">
        <Image src={Logo} alt="Logo Ava" className="w-auto h-8" />
      </div>

      <div className="flex flex-col mx-auto max-w-2xl my-12 w-full px-6">
        <h1 className="text-3xl text-center font-semibold text-gray-800">
          Profile Setup
        </h1>

        <p className="text-center text-sm text-gray-600">
          Setup your profile to start today.
        </p>

        {children}
      </div>
    </div>
  )
}
