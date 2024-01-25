import { createApi } from "@reduxjs/toolkit/query/react"

import { FilePermission, IFile, IFolder } from "@/types/folder.types"

import { fetchAuthQuery } from "../fetch-auth-query"

interface IBaseRequest {
  orgId: string
  agentId?: string
  contactId?: string
}

interface IGetFolderRequest extends IBaseRequest {
  folderId?: string
  isShared: boolean
  forAgentOnly: boolean
}

interface IGetFolderResponse {
  folder?: IFolder
  subFolders: IFolder[]
  files: IFile[]
}

interface ICreateFolderRequest extends IBaseRequest {
  folderId?: string
  isShared: boolean
  forAgentOnly: boolean
  name: string
}

interface IRenameFolderRequest extends IBaseRequest {
  folderId: string
  name: string
}

interface IMoveFilesRequest extends IBaseRequest {
  folderId: string
  isShared: boolean
  forAgentOnly: boolean
  folderIds: string[]
  fileIds: string[]
}

interface IDeleteFilesRequest extends IBaseRequest {
  isShared: boolean
  forAgentOnly: boolean
  folderIds: string[]
  fileIds: string[]
}

// files
interface IGetUploadFileUrlRequest extends IBaseRequest {
  name: string
}
interface IGetUploadFileUrlResponse {
  key: string
  singedUrl: string
}

interface IStoreFileRequest extends IBaseRequest {
  folderId?: string
  name: string
  isShared: boolean
  forAgentOnly: boolean
  s3Key: string
  size: number
}

interface IGetDownloadFileUrlRequest extends IBaseRequest {
  fileId: string
  isShared: boolean
  forAgentOnly: boolean
}
interface IGetDownloadFileUrlResponse {
  url: string
}

interface IRenameFileRequest extends IBaseRequest {
  fileId: string
  name: string
  isShared: boolean
  forAgentOnly: boolean
}

interface IShareFilesRequest {
  orgId: string
  fileId: string
  contactIds: string[]
  permission: FilePermission
}

export const mediaApi = createApi({
  reducerPath: "mediaApi",
  baseQuery: fetchAuthQuery({ baseUrl: "/orgs" }),
  endpoints: (builder) => ({
    // folders
    createFolder: builder.mutation<void, ICreateFolderRequest>({
      query: ({ orgId, ...rest }) => ({
        url: `/${orgId}/folders`,
        method: "POST",
        body: rest,
      }),
    }),
    getFolder: builder.query<IGetFolderResponse, IGetFolderRequest>({
      query: ({ orgId, folderId, ...rest }) => ({
        url: `/${orgId}/folders${folderId ? `/${folderId}` : ""}`,
        method: "GET",
        params: rest,
      }),
    }),
    renameFolder: builder.mutation<void, IRenameFolderRequest>({
      query: ({ orgId, folderId, ...rest }) => ({
        url: `/${orgId}/folders/${folderId}`,
        method: "PUT",
        body: rest,
      }),
    }),
    moveFiles: builder.mutation<void, IMoveFilesRequest>({
      query: ({ orgId, folderId, ...rest }) => ({
        url: `/${orgId}/folders/${folderId}/move`,
        method: "POST",
        body: rest,
      }),
    }),
    deletefiles: builder.mutation<void, IDeleteFilesRequest>({
      query: ({ orgId, ...rest }) => ({
        url: `/${orgId}/folders`,
        method: "DELETE",
        body: rest,
      }),
    }),

    // files
    getUploadFileUrl: builder.mutation<
      IGetUploadFileUrlResponse,
      IGetUploadFileUrlRequest
    >({
      query: ({ orgId, ...rest }) => ({
        url: `/${orgId}/files/upload-url`,
        method: "POST",
        body: rest,
      }),
    }),
    storeFile: builder.mutation<void, IStoreFileRequest>({
      query: ({ orgId, ...rest }) => ({
        url: `/${orgId}/files`,
        method: "POST",
        body: rest,
      }),
    }),
    getDownloadFileUrl: builder.mutation<
      IGetDownloadFileUrlResponse,
      IGetDownloadFileUrlRequest
    >({
      query: ({ orgId, fileId, ...rest }) => ({
        url: `/${orgId}/files/${fileId}/download-url`,
        method: "POST",
        body: rest,
      }),
    }),
    renameFile: builder.mutation<void, IRenameFileRequest>({
      query: ({ orgId, fileId, ...rest }) => ({
        url: `/${orgId}/files/${fileId}/rename`,
        method: "PUT",
        body: rest,
      }),
    }),
    shareFile: builder.mutation<void, IShareFilesRequest>({
      query: ({ orgId, fileId, ...rest }) => ({
        url: `/${orgId}/files/${fileId}/share`,
        method: "POST",
        body: rest,
      }),
    }),
  }),
})

export const {
  useCreateFolderMutation,
  useGetFolderQuery,
  useRenameFolderMutation,
  useMoveFilesMutation,
  useDeletefilesMutation,

  useGetUploadFileUrlMutation,
  useStoreFileMutation,
  useGetDownloadFileUrlMutation,
  useRenameFileMutation,
  useShareFileMutation,
} = mediaApi
