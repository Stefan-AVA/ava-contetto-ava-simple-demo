import "@/styles/main.scss"

import type { PropsWithChildren } from "react"
import type { Metadata } from "next"
import { DM_Sans } from "next/font/google"
import Image from "next/image"
import { Mail } from "lucide-react"

const dmsans = DM_Sans({
  weight: ["400", "500", "700"],
  subsets: ["latin"],
  variable: "--font-dmsans",
})

export const metadata: Metadata = {
  title: {
    default: "AVA",
    template: `%s - AVA`,
  },
  description: "",
}

export default function RootLayout({ children }: PropsWithChildren) {
  return (
    <html lang="pt-BR">
      <head />

      <body className={`${dmsans.variable} font-sans`}>
        <div className="absolute flex items-center justify-end w-full pt-5 px-8 md:pt-12 md:px-16">
          <button
            type="button"
            className="flex items-center justify-center border border-solid border-green-500 rounded-full w-12 h-12 md:w-16 md:h-16"
          >
            <Mail className="text-gray-800" />
          </button>

          <button
            type="button"
            className="flex ml-4 items-center justify-center border border-solid border-gray-300 rounded-full p-0.5 w-12 h-12 md:w-16 md:h-16"
          >
            <Image
              src="/assets/avatar.png"
              alt=""
              width={60}
              height={60}
              className="object-cover rounded-full"
            />
          </button>
        </div>

        {children}
      </body>
    </html>
  )
}
