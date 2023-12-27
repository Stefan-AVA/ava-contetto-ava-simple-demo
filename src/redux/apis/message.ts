import { createApi } from "@reduxjs/toolkit/query/react"

import { IMessage } from "@/types/message.types"

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
        url: `/${orgId}/rooms/${roomId}/messages`,
        method: "GET",
        params: {
          messageId,
        },
      }),
      providesTags: ["Messages"],
    }),
  }),
})

export const { useLazyGetMessagesQuery, useLazyLoadMoreMessagesQuery } =
  messageApi
