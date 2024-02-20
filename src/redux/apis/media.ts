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

interface IShareFolderRequest extends IBaseRequest {
  folderId: string
  contactIds: string[]
  permission: FilePermission
  notify: boolean
  orgShare: boolean
  isShared: boolean
  forAgentOnly: boolean
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
  type: string
}
interface IGetUploadFileUrlResponse {
  key: string
  singedUrl: string
}

interface IStoreFileRequest extends IBaseRequest {
  folderId?: string
  name: string
  type: string
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

interface IGetPublicFileUrlRequest {
  orgId: string
  fileId: string
  isShared: boolean
}

interface IShareFilesRequest {
  orgId: string
  fileId: string
  contactIds: string[]
  permission: FilePermission
  notify: boolean
  orgShare: boolean
}

interface IShareFileLinkRequest {
  orgId: string
  fileId: string
}

interface IShareAgentOnlyFileRequest {
  orgId: string
  fileId: string
  contactId: string
}

export const mediaApi = createApi({
  reducerPath: "mediaApi",
  baseQuery: fetchAuthQuery({ baseUrl: "/orgs" }),
  tagTypes: ["Folder"],
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
      providesTags: (result) =>
        result
          ? [
              ...result.subFolders.map((folder) => ({
                id: folder._id,
                type: "Folder" as const,
              })),
              ...result.files.map((file) => ({
                id: file._id,
                type: "Folder" as const,
              })),
              "Folder",
            ]
          : ["Folder"],
    }),
    renameFolder: builder.mutation<void, IRenameFolderRequest>({
      query: ({ orgId, folderId, ...rest }) => ({
        url: `/${orgId}/folders/${folderId}`,
        method: "PUT",
        body: rest,
      }),
    }),
    shareFolder: builder.mutation<void, IShareFolderRequest>({
      query: ({ orgId, folderId, ...rest }) => ({
        url: `/${orgId}/folders/${folderId}/share`,
        method: "POST",
        body: rest,
      }),
    }),
    moveFiles: builder.mutation<void, IMoveFilesRequest>({
      query: ({ orgId, folderId, ...rest }) => ({
        url: `/${orgId}/folders/${folderId}/move`,
        method: "POST",
        body: rest,
      }),
      invalidatesTags: ["Folder"],
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
    getPublicFileUrl: builder.query<IFile, IGetPublicFileUrlRequest>({
      query: ({ orgId, fileId, isShared }) => ({
        url: `/${orgId}/files/${fileId}/public-url`,
        method: "GET",
        params: {
          isShared,
        },
      }),
    }),
    shareFile: builder.mutation<void, IShareFilesRequest>({
      query: ({ orgId, fileId, ...rest }) => ({
        url: `/${orgId}/files/${fileId}/share`,
        method: "POST",
        body: rest,
      }),
    }),
    shareAgentOnlyFile: builder.mutation<void, IShareAgentOnlyFileRequest>({
      query: ({ orgId, fileId, contactId }) => ({
        url: `/${orgId}/files/${fileId}/share/${contactId}`,
        method: "POST",
      }),
    }),
    shareFileLink: builder.query<{ link: string }, IShareFileLinkRequest>({
      query: ({ orgId, fileId }) => ({
        url: `/${orgId}/files/${fileId}/share-link`,
        method: "GET",
      }),
    }),
  }),
})

export const {
  useCreateFolderMutation,
  useGetFolderQuery,
  useLazyGetFolderQuery,
  useRenameFolderMutation,
  useShareFolderMutation,
  useMoveFilesMutation,
  useDeletefilesMutation,

  useGetUploadFileUrlMutation,
  useStoreFileMutation,
  useGetDownloadFileUrlMutation,
  useRenameFileMutation,
  useLazyGetPublicFileUrlQuery,
  useShareFileMutation,
  useShareAgentOnlyFileMutation,
  useLazyShareFileLinkQuery,
} = mediaApi
