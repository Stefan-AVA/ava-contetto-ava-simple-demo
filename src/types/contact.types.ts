import { IAgentProfile } from "./agentProfile.types"
import { IOrg } from "./org.types"
import { IUser } from "./user.types"

export interface IContact {
  _id: string
  name: string // contact name
  note: string
  username?: string // shared username
  user?: IUser
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
