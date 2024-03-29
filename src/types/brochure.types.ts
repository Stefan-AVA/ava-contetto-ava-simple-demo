import { IListing } from "./listing.types"
import { ITemplateLayout, TemplateType } from "./template.types"

export interface IBrochure {
  _id: string
  name: string
  orgId: string
  propertyId: string
  property: IListing
  creator: string
  data: any
  layoutId: string
  layout: ITemplateLayout
  type: TemplateType
  createdAt: number
  edited: boolean
  publicLink?: string
  s3Key?: string
  mimetype?: string
}
