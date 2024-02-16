import { IRoom } from "./room.types"
import { IUser } from "./user.types"

export interface IMsgAttachment {
  _id: string
  roomId: string
  name: string
  url: string
  s3Key: string
  mimetype: string
  size: number
  timestamp: number
  creator: string
}

export interface IMessage {
  _id: string
  orgId: string
  roomId: string
  msg?: string
  senderName: string // sender username
  sender?: IUser
  createdAt: number // milliseconds timestamp
  updatedAt?: number // milliseconds timestamp
  attachmentIds: string[]
  attachments?: IMsgAttachment[]
  edited: boolean
  mentions: string[] // usernames
  channels: string[] // channel names
  editable: boolean
  sharelink?: string
  agentLink?: string
  contactLink?: string
}

export interface IMessagePayload {
  room: IRoom
  user: IUser
  msg?: string
  messageId?: string
  attachmentIds?: string[]
  deletAttachmentId?: string
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
  channelArchive = 'channel:archive',

  // message
  msgSend = "msg:send",
  msgUpdate = "msg:update",
  msgDelete = "msg:delete",
  msgRead = "msg:read",
  msgTyping = "msg:typing",

  // notification for electron app
  electronNotification = "electron:notification",

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
  attachmentDelete = "attachment:delete",
}
