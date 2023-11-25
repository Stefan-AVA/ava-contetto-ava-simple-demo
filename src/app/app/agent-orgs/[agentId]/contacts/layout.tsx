import { PropsWithChildren } from "react"

import Breadcrumb from "@/components/breadcrumb"

export default function Layout({ children }: PropsWithChildren) {
  return (
    <>
      <Breadcrumb initialPosition={3} />

      {children}
    </>
  )
}
