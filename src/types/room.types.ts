import { IUser } from "./user.types"

export interface IRoomUserStatus {
  [username: string]: {
    online: boolean
    notis: number // the number of mentions and messages in DM
    unRead: boolean // unread messages exists or not
    firstUnReadmessage?: string
    firstNotiMessage?: string
    socketId?: string
  }
}

export enum RoomType {
  channel = "channel",
  dm = "dm",
}

export interface IRoom {
  _id: string
  orgId: string
  name?: string // optional for dm
  usernames: string[] // username
  users?: IUser[]
  creator: string // creator username
  type: RoomType
  userStatus: IRoomUserStatus
  dmInitiated?: boolean
  createdAt: number // unix timestamp
  updatedAt?: number // unix timestamp
}
