export enum FilePermission {
  editor = "editor",
  viewer = "viewer",
}

export interface IFileConnect {
  id?: string // agentId or contactId or null for org shared
  username?: string // agent username or contact name
  type: "agent" | "contact" | "shared" | "forAgentOnly"
  permission: FilePermission
  parentId: string | "" // parentId = '' means it's root folder
}

export interface IFolderConnect extends IFileConnect {
  parentPaths: string[]
}

export interface IFolder {
  _id: string
  name: string
  orgId: string
  parentFolders?: IFolder[]
  creator: string // username
  timestamp: number
  connections: IFolderConnect[]
}

export interface IFile {
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

export interface IFileShare {
  _id: string
  orgId: string
  agentId: string
  agentName: string // agent username
  fileId: string
  code: string
}
