import { createApi } from "@reduxjs/toolkit/query/react"

import { IFile } from "@/types/folder.types"

import { fetchAuthQuery } from "../fetch-auth-query"

interface IBaseRequest {
  shareId: string
  orgId: string
  code: string
}

interface IGetSharedFileResponse extends IFile {
  downloadUrl: string
}

export const fileShareApi = createApi({
  reducerPath: "fileShareApi",
  baseQuery: fetchAuthQuery({ baseUrl: "/fileshare" }),
  endpoints: (builder) => ({
    getSharedFile: builder.query<IGetSharedFileResponse, IBaseRequest>({
      query: ({ shareId, ...rest }) => ({
        url: `/${shareId}`,
        method: "GET",
        params: rest,
      }),
    }),
    copySharedFile: builder.mutation<void, IBaseRequest>({
      query: ({ shareId, ...rest }) => ({
        url: `/${shareId}/copy`,
        method: "POST",
        body: rest,
      }),
    }),
  }),
})

export const {
  useGetSharedFileQuery,
  useLazyGetSharedFileQuery,
  useCopySharedFileMutation,
} = fileShareApi
