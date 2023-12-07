import { IAgentProfile } from "./agentProfile.types"
import { IOrg } from "./org.types"
import { IUser } from "./user.types"

export interface IContactNote {
  _id: string
  contactId: string
  note: string
  timestamp: number
}

export interface IContact {
  _id: string
  name: string // contact name
  notes?: IContactNote[]
  username?: string // shared username
  user?: IUser
  userEmail?: string
  userPhone?: string
  userImage?: string
  email?: string
  phone?: string
  image?: string
  orgId: string
  org?: IOrg
  agentProfileId: string
  agentName: string // agent usernmae
  agent?: IAgentProfile
  createdAt: number
  updatedAt: number
  inviteCode?: string
}
