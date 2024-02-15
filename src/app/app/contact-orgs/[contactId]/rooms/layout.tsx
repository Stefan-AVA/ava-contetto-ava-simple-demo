import type { PropsWithChildren } from "react"

import LayoutRoomPage from "@/components/rooms/layout"

export default function Layout({ children }: PropsWithChildren) {
  return <LayoutRoomPage>{children}</LayoutRoomPage>
}
