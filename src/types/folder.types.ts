export interface IFolder {
  _id: string
  name: string
  orgId: string
  isShared: boolean // if true, it's shared across all org agents
  contactId?: string // if exists, it's shared with contact (isShared must be false in this case)
  forAgentOnly: boolean // for contact shared only, if true, it's only visible for agent only, not contacts
  parentId: string | "" // parentId = '' means it's root folder
  parentPaths: string[]
  parentFolders?: IFolder[]
  creator: string // username
  agentName?: string // exists if it's created by agent
  timestamp: number
}

export enum FilePermission {
  editor = "editor",
  viewer = "viewer",
  commentor = "commentor",
}

export interface IFileConnect {
  id?: string // agentId or contactId or null for org shared
  username: string // agent username or contact name
  type: "agent" | "contact" | "shared" | "forAgentOnly"
  permission: FilePermission
  parentId: string | "" // parentId = '' means it's root folder
}

export interface IFile extends IFolder {
  _id: string
  name: string
  orgId: string
  s3Key: string
  ext: string
  mimetype: string
  size: number // byte
  timestamp: number
  creator: string
  connections: IFileConnect[]
}
