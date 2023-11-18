import "@/styles/main.scss"

import type { PropsWithChildren } from "react"
import type { Metadata } from "next"

import Providers from "./providers"

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
          name="viewport"
          content="width=device-width, initial-scale=1, maximum-scale=1"
        />
      </head>

      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}
