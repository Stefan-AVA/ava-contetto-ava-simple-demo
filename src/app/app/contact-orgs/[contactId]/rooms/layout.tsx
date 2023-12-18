import type { PropsWithChildren } from "react"

import RoomLayout from "@/components/room/layout"

export default function Layout({ children }: PropsWithChildren) {
  return <RoomLayout>{children}</RoomLayout>
}
