import { IRoom } from "./room.types"
import { IUser } from "./user.types"

export interface IMsgAttachMent {
  url: string
  type: "image" | "video" | "pdf"
  createdAt: number
}

export interface IMessage {
  _id: string
  orgId: string
  roomId: string
  msg?: string
  senderName: string // sender username
  sender?: IUser
  createdAt: number // unix timestamp
  updatedAt?: number // unix timestamp
  attatchMents: IMsgAttachMent[]
  edited: boolean
  // mentions:
}

export interface IMessagePayload {
  room: IRoom
  user: IUser
  msg?: string
  messageId?: string
}

export enum ServerMessageType {
  // welcome
  connected = "connected",

  // token
  updateToken = "updateToken",

  // channel
  channelUpdate = "channel:update",
  channelJoin = "channel:join",
  dmCreate = "dm:create",

  // message
  msgSend = "msg:send",
  msgUpdate = "msg:update",
  msgDelete = "msg:delete",
  msgRead = "msg:read",
  msgTyping = "msg:typing",

  // error
  invalidRequest = "error:invalid",
  authError = "error:auth",
  unknownError = "error:unknown",
  notFoundError = "error:notfound",
}

export enum ClientMessageType {
  msgSend = "msg:send",
  msgUpdate = "msg:update",
  msgDelete = "msg:delete",
  msgRead = "msg:read",
  msgTyping = "msg:typing",
}
