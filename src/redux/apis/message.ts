import { createApi } from "@reduxjs/toolkit/query/react"

import { IMessage } from "@/types/message.types"

import { fetchAuthQuery } from "../fetch-auth-query"

interface IGetMessageRequest {
  orgId: string
  roomId: string
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
  }),
})

export const { useGetMessagesQuery } = messageApi
