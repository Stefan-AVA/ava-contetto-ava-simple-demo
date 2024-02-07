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

export interface IOrgBrand {
  logos: string[]
  colors: string[]
  titleFont: string
  bodyFont: string
}

export interface IOrg {
  _id: string
  name: string
  owner: string // username
  logoUrl?: string
  deleted: boolean
  mlsFeeds?: IMLSFeed[]
  createdAt: number
  deletedAt?: number
  whiteLabel?: DefaultAvaOrgTheme
  brand?: IOrgBrand
}
