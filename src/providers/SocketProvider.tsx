"use client"

import { createContext, PropsWithChildren, useEffect, useRef } from "react"
import { tokenKey } from "@/redux/fetch-auth-query"
import io, { Socket } from "socket.io-client"

import { ServerMessageType } from "@/types/message.types"

const socket = io(String(process.env.NEXT_PUBLIC_SOCKET_URL), {
  // withCredentials: true,
  transports: ["websocket"],
})

export const SocketContext = createContext<Socket>(socket)

export const connectSocket = () => {
  socket.auth = (cb) => {
    const token = window ? window.localStorage.getItem(tokenKey) : undefined
    cb({ token })
  }

  if (socket.connected) {
    socket.disconnect()
  }

  socket.connect()
}

const SocketProvider = ({ children }: PropsWithChildren) => {
  const initialized = useRef(false)

  useEffect(() => {
    if (!initialized.current) {
      initialized.current = true

      connectSocket()
      socket.on(ServerMessageType.connected, (payload: any) => {
        console.log("connected =>", payload)
      })

      socket.on(ServerMessageType.updateToken, (payload: any) => {
        console.log("updateToken =>", payload)
      })

      socket.on("connect_error", (err: any) => {
        console.log("socket connect error ==>", err.message)
        if (err.message === "not authorized") {
          setTimeout(() => {
            connectSocket()
          }, 2000)
        }
      })

      // // may consider later, not for now
      // socket.on("disconnect", (reason) => {
      //   console.log("disconnect", reason)
      // })
    }
  }, [])

  return (
    <SocketContext.Provider value={socket}>{children}</SocketContext.Provider>
  )
}

export default SocketProvider
