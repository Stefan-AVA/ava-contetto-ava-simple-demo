import { IAgentProfile } from "./agentProfile.types"
import { IOrg } from "./org.types"
import { IUser } from "./user.types"

export interface IContact {
  _id: string
  username: string
  email: string
  phone?: string
  image?: string
  user?: IUser
  name?: string
  orgId: string
  org?: IOrg
  agentProfileId: string
  invitor: string // agent usernmae
  agent?: IAgentProfile
  createdAt: number
  updatedAt: number
  deleted: boolean
  deletedAt?: number
}
