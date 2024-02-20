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

interface IDeleteAttachmentRequest {
  orgId: string
  roomId: string
  attachmentId: string
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
    loadBeforeMessages: builder.query<IMessage[], ILoadMoreMessageRequest>({
      query: ({ orgId, roomId, messageId }) => ({
        url: `/${orgId}/rooms/${roomId}/messages/load-before`,
        method: "GET",
        params: {
          messageId,
        },
      }),
      providesTags: ["Messages"],
    }),
    loadNextMessages: builder.query<IMessage[], ILoadMoreMessageRequest>({
      query: ({ orgId, roomId, messageId }) => ({
        url: `/${orgId}/rooms/${roomId}/messages/load-next`,
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
    loadSearchedMessages: builder.query<IMessage[], ILoadMoreMessageRequest>({
      query: ({ orgId, roomId, messageId }) => ({
        url: `/${orgId}/rooms/${roomId}/messages/load-searched`,
        method: "GET",
        params: {
          messageId,
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
    deleteAttachment: builder.mutation<
      IMsgAttachment,
      IDeleteAttachmentRequest
    >({
      query: ({ orgId, roomId, attachmentId }) => ({
        url: `/${orgId}/rooms/${roomId}/attachments/${attachmentId}`,
        method: "DELETE",
      }),
    }),
  }),
})

export const {
  useLazyGetMessagesQuery, // can also be used for scroll to bottom
  useLazyLoadBeforeMessagesQuery,
  useLazyLoadNextMessagesQuery,
  useLazySearchMessagesQuery,
  useLazyLoadSearchedMessagesQuery,
  useAddAttachmentMutation,
  useDeleteAttachmentMutation,
} = messageApi
