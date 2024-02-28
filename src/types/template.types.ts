import { IIndustry } from "./industry.types"

export enum TemplateType {
  brochure = "brochure",
  social = "social",
  ads = "ads",
}

export interface ITemplateLayout {
  _id: string
  name: string
  width: number
  height: number
  type: TemplateType
}

export interface ITemplate {
  _id: string
  name: string
  orgIds: string[]
  isPublic: boolean
  price: number // 0 for free, price unit usd
  type: TemplateType
  data: any
  layoutId: string
  layout: ITemplateLayout
  industryIds: string[]
  industries?: IIndustry[]
  createdAt: number
  updatedAt: number
}

export interface ITemplateImage {
  _id: string
  name: string
  username: string
  url: string
  s3Key: string
  mimetype: string
  ext: string
  orgId: string
}
