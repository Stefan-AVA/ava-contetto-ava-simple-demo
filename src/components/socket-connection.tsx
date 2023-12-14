import { useEffect, type PropsWithChildren } from "react"
import { tokenKey } from "@/redux/fetch-auth-query"
import io from "socket.io-client"

export default function SocketConnection({ children }: PropsWithChildren) {
  useEffect(() => {
    const token = window
      ? String(window.localStorage.getItem(tokenKey))
      : undefined

    const socket = io(process.env.NEXT_PUBLIC_SOCKET_URL!, {
      auth: { token },
      withCredentials: true,
    })

    // socket.on("message", (message) => {
    //   console.log({ message })
    // })

    return () => {
      socket.disconnect()
    }
  }, [])

  return children
}
