import "@/styles/preflight.css"

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

        <link rel="preconnect" href="https://fonts.googleapis.com" />

        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin=""
        />
      </head>

      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}
