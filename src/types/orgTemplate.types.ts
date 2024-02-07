import { ITemplate } from "./template.types"

export interface IOrgTemplate {
  _id: string
  orgId: string
  templateId: string
  template: ITemplate
  hidden: boolean
}
