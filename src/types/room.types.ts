import type { IAgentProfile } from "./agentProfile.types"
import type { IContact } from "./contact.types"

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

export interface IRoomAgent {
  _id: string // agentProfile id
  username: string
}

export interface IRoomContact {
  _id: string // contactId
  name: string
  username?: string
  agentId: string
  agentName: string
}

export interface IRoom {
  _id: string
  orgId: string
  name?: string // optional for dm
  usernames: string[] // unique usernames in room
  agents: IRoomAgent[]
  agentProfiles?: IAgentProfile[]
  contacts: IRoomContact[]
  contactProfiles?: IContact[]
  creator: string // creator username
  type: RoomType
  userStatus: IRoomUserStatus
  dmInitiated?: boolean
  createdAt: number // unix timestamp
  updatedAt?: number // unix timestamp
  isPublic: boolean
  deleted: boolean
}
