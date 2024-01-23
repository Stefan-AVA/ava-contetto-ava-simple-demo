import { createApi } from "@reduxjs/toolkit/query/react"

import { IFile, IFolder } from "@/types/folder.types"

import { fetchAuthQuery } from "../fetch-auth-query"

interface IBaseRequest {
  orgId: string
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
  targetFolderId: string
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
    moveFolder: builder.mutation<void, IMoveFolderRequest>({
      query: ({ orgId, folderId, ...rest }) => ({
        url: `/${orgId}/folders/${folderId}/move`,
        method: "POST",
        body: rest,
      }),
    }),
    deleteFolder: builder.mutation<void, IBaseRequest>({
      query: ({ orgId, folderId, ...rest }) => ({
        url: `/${orgId}/folders/${folderId}`,
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
  }),
})

export const {
  useCreateFolderMutation,
  useGetFolderQuery,
  useRenameFolderMutation,
  useMoveFolderMutation,
  useDeleteFolderMutation,

  useGetUploadFileUrlMutation,
  useStoreFileMutation,
} = mediaApi
