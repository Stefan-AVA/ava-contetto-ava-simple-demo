import { createApi } from "@reduxjs/toolkit/query/react"

import { IMessage, IMsgAttachment } from "@/types/message.types"

import { fetchAuthQuery } from "../fetch-auth-query"

interface IGetMessageRequest {
  orgId: string
  roomId: string
}

interface ILoadMoreMessageRequest {
  orgId: string
  roomId: string
  messageId: string
}

interface ISearchMessagesRequest {
  orgId: string
  roomId: string
  search: string
}

interface IAddAttachmentRequest {
  orgId: string
  roomId: string
  name: string // file name
  base64: string // base64 encoded file
  mimetype: string // file.type
  size: number // file size byte
}

export const messageApi = createApi({
  reducerPath: "messageApi",
  baseQuery: fetchAuthQuery({ baseUrl: "/orgs" }),
  tagTypes: ["Messages"],
  endpoints: (builder) => ({
    getMessages: builder.query<IMessage[], IGetMessageRequest>({
      query: ({ orgId, roomId }) => ({
        url: `/${orgId}/rooms/${roomId}/messages`,
        method: "GET",
      }),
      providesTags: ["Messages"],
    }),
    loadMoreMessages: builder.query<IMessage[], ILoadMoreMessageRequest>({
      query: ({ orgId, roomId, messageId }) => ({
        url: `/${orgId}/rooms/${roomId}/messages/more`,
        method: "GET",
        params: {
          messageId,
        },
      }),
      providesTags: ["Messages"],
    }),
    searchMessages: builder.query<IMessage[], ISearchMessagesRequest>({
      query: ({ orgId, roomId, search }) => ({
        url: `/${orgId}/rooms/${roomId}/messages/search`,
        method: "GET",
        params: {
          search,
        },
      }),
      providesTags: ["Messages"],
    }),
    addAttachment: builder.mutation<IMsgAttachment, IAddAttachmentRequest>({
      query: ({ orgId, roomId, ...rest }) => ({
        url: `/${orgId}/rooms/${roomId}/attachments`,
        method: "POST",
        body: rest,
      }),
    }),
  }),
})

export const {
  useLazyGetMessagesQuery,
  useLazyLoadMoreMessagesQuery,
  useLazySearchMessagesQuery,
  useAddAttachmentMutation,
} = messageApi
