import { AgentRole } from "./agentProfile.types"

export interface IInvite {
  _id: string
  email: string
  code: string
  invitorId: string // agent profileId
  invitor: string // invite username
  orgId: string
  used: boolean
  usedBy?: string // invited username
  createdAt: number
  usedAt?: number
  role: AgentRole
}
