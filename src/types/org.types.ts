import type { DefaultAvaOrgTheme } from "@/styles/white-label-theme"

export enum MLSSource {
  crea = "crea",
  kvcore = "kvcore",
}

export interface IMLSFeed {
  source: MLSSource
  api_key: string
  api_secret: string
}

export interface IOrg {
  _id: string
  name: string
  owner: string // username
  logoUrl?: string
  deleted: boolean
  mlsFeeds?: IMLSFeed[]
  deletedAt?: number
  whiteLabel?: DefaultAvaOrgTheme
}
