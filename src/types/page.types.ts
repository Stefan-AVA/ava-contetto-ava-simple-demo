export interface IPage {
  _id: string
  orgId: string
  creator: string
  title: string // unique field
  slug: string // unique field
  html: string
  css: string
  isPublished: boolean
  timestamp: number
}
