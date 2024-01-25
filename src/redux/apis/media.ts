import { createApi } from "@reduxjs/toolkit/query/react"

import { IFile, IFolder } from "@/types/folder.types"

import { fetchAuthQuery } from "../fetch-auth-query"

interface IBaseRequest {
  orgId: string
  agentId?: string
  contactId?: string
  folderId?: string
}

interface IGetFolderRequest extends IBaseRequest {
  isShared: boolean
  forAgentOnly: boolean
}

interface IGetFolderResponse {
  folder?: IFolder
  subFolders: IFolder[]
  files: IFile[]
}

interface ICreateFolderRequest extends IGetFolderRequest {
  name: string
}

interface IRenameFolderRequest extends IBaseRequest {
  name: string
}

interface IMoveFolderRequest extends IBaseRequest {
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
  name: string
  isShared: boolean
  forAgentOnly: boolean
  s3Key: string
  size: number
}

interface IGetDownloadFileUrlRequest extends IBaseRequest {
  fileId: string
}
interface IGetDownloadFileUrlResponse {
  url: string
}

interface IRenameFileRequest extends IBaseRequest {
  fileId: string
  name: string
}

interface IShareFilesRequest {
  orgId: string
  contactId: string
  fileIds: string[]
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
    moveFiles: builder.mutation<void, IMoveFolderRequest>({
      query: ({ orgId, folderId, contactId, folderIds, fileIds }) => ({
        url: `/${orgId}/folders/${folderId}/move`,
        method: "POST",
        body: {
          contactId,
          folderIds,
          fileIds,
        },
      }),
    }),
    deletefiles: builder.mutation<void, IMoveFolderRequest>({
      query: ({ orgId, contactId, folderIds, fileIds }) => ({
        url: `/${orgId}/folders`,
        method: "DELETE",
        body: {
          contactId,
          folderIds,
          fileIds,
        },
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
      query: ({ orgId, contactId, folderId, fileId }) => ({
        url: `/${orgId}/files/${fileId}/download-url`,
        method: "POST",
        body: {
          contactId,
          folderId,
        },
      }),
    }),
    renameFile: builder.mutation<void, IRenameFileRequest>({
      query: ({ orgId, contactId, folderId, fileId, name }) => ({
        url: `/${orgId}/files/${fileId}/rename`,
        method: "PUT",
        body: {
          name,
          contactId,
          folderId,
        },
      }),
    }),
    shareFiles: builder.mutation<void, IShareFilesRequest>({
      query: ({ orgId, contactId, fileIds }) => ({
        url: `/${orgId}/files/share`,
        method: "POST",
        body: {
          contactId,
          fileIds,
        },
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
} = mediaApi
