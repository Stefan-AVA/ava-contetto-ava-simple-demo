import { IAgentProfile } from "./agentProfile.types"
import { IContact } from "./contact.types"
import { IOrg } from "./org.types"

export interface ISearchResult {
  _id: string
  queryString: string /// the string they typed
  queryJSON: any /// GPT interpreted version
  orgId: string // orgId
  org?: IOrg
  username: string // username of person doing the search
  agentProfileId?: string
  agentProfile?: IAgentProfile
  contactId?: string // contact this search has been saved to
  contact?: IContact
  searchName?: string // if user manually saves the search they can add a name to it
  savedForAgent: boolean // if the agent saves it in their personal "my saves searches"
  watched: boolean // whether our cron is searching this periodically in the background and alerting contact+agent to new results
  rejects: string[] // properties that were rejected fom this search results
  shortlists: string[] // properties that were liked from this search results
  newListings: string[] // properties that the cron discovered we want to show the user quickly when they click a push notification/email link
  timestamp: number
}
