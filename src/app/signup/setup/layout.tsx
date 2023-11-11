import type { PropsWithChildren } from "react"
import Image from "next/image"
import Link from "next/link"
import Logo from "~/assets/logo-revault.png"

export default function Layout({ children }: PropsWithChildren) {
  return (
    <div className="flex flex-col">
      <div className="absolute flex items-center justify-between w-full pt-5 px-8 md:pt-8 md:px-16">
        <Link href="/" className="flex">
          <Image src={Logo} alt="Logo Revault" className="w-auto h-12" />
        </Link>
      </div>

      <div className="flex flex-col container pt-40 pb-24 relative">
        {children}
      </div>
    </div>
  )
}
