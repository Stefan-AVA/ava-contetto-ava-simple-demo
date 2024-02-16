"use client"

import {
  createContext,
  PropsWithChildren,
  useContext,
  useEffect,
  useRef,
} from "react"
import { useRouter } from "next/navigation"
import { logout } from "@/redux/slices/app"
import {
  archiveRoom,
  deleteMessage,
  joinRoom,
  readMessage,
  sendMessage,
  typingMessage,
  updateMessage,
  updateRoom,
} from "@/redux/slices/room"
import { getToken, setToken } from "@/redux/token"
import { useDispatch } from "react-redux"
import io, { Socket } from "socket.io-client"

import { IMessage, ServerMessageType } from "@/types/message.types"
import { INotificationOptions } from "@/types/notificationOptions.types"
import { IRoom } from "@/types/room.types"

const socket = io(process.env.NEXT_PUBLIC_SOCKET_URL!, {
  // withCredentials: true,
  transports: ["websocket"],
})

const SocketContext = createContext<Socket>(socket)

export const useSocket = () => useContext<Socket>(SocketContext)

export const connectSocket = () => {
  socket.auth = (cb) => {
    const token = getToken()

    const object = {
      token,
    }

    cb(object)
  }

  if (socket.connected) socket.disconnect()

  socket.connect()
}

const SocketProvider = ({ children }: PropsWithChildren) => {
  const initialized = useRef(false)

  const { replace } = useRouter()
  const dispatch = useDispatch()

  useEffect(() => {
    if (!initialized.current) {
      initialized.current = true

      connectSocket()

      // welcome message when connected
      socket.on(ServerMessageType.connected, (payload: { msg: string }) => {
        console.log("socket connected =>", payload)
      })

      // Room
      socket.on(ServerMessageType.channelUpdate, (room: IRoom) => {
        dispatch(updateRoom(room))
      })

      socket.on(ServerMessageType.channelJoin, (room: IRoom) => {
        dispatch(joinRoom(room))
      })

      socket.on(ServerMessageType.channelArchive, (room: IRoom) => {
        dispatch(archiveRoom(room))
      })

      socket.on(ServerMessageType.dmCreate, (room: IRoom) => {
        dispatch(joinRoom(room))
      })

      socket.on(ServerMessageType.msgRead, (room: IRoom) => {
        dispatch(readMessage(room))
      })

      // message
      socket.on(ServerMessageType.msgSend, (message: IMessage) => {
        dispatch(sendMessage(message))
      })

      socket.on(ServerMessageType.msgUpdate, (message: IMessage) => {
        dispatch(updateMessage(message))
      })

      socket.on(ServerMessageType.msgDelete, (message: IMessage) => {
        dispatch(deleteMessage(message))
      })

      socket.on(
        ServerMessageType.msgTyping,
        (payload: { roomId: string; username: string; typing: boolean }) => {
          const { typing, ...rest } = payload

          dispatch(typingMessage(typing ? rest : null))
        }
      )

      // electron notification
      socket.on(
        ServerMessageType.electronNotification,
        (payload: INotificationOptions) => {
          const electron = window.Electron
          if (electron) {
            electron.sendNotification(payload)
          }
        }
      )

      // update token
      socket.on(ServerMessageType.updateToken, (payload: { token: string }) => {
        setToken(payload.token)
      })

      // error handling
      socket.on(ServerMessageType.authError, () => {
        // logout
        dispatch(logout())
        replace("/")
      })

      socket.on(ServerMessageType.invalidRequest, () => {
        console.log("socket invalidRequest missing params")
      })

      socket.on(ServerMessageType.unknownError, () => {
        console.log("socket unknown error =>")
      })

      socket.on(ServerMessageType.notFoundError, (payload: { msg: string }) => {
        console.log("socket notFoundError =>", payload.msg)
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
  }, [dispatch, replace])

  return (
    <SocketContext.Provider value={socket}>{children}</SocketContext.Provider>
  )
}

export default SocketProvider
