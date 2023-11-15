import "@/styles/main.scss"

import type { PropsWithChildren } from "react"
import type { Metadata } from "next"
import { DM_Sans } from "next/font/google"

import Providers from "./Provider"

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
    <html lang="en-US">
      <head>
        <meta
          content="upgrade-insecure-requests"
          httpEquiv="Content-Security-Policy"
        />

        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, maximum-scale=1"
        />
      </head>

      <body className={`${dmsans.variable} font-sans`}>
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}
