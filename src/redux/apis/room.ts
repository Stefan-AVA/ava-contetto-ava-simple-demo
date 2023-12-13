import { createApi } from "@reduxjs/toolkit/query/react"

import { IRoom } from "@/types/room.types"

import { fetchAuthQuery } from "../fetch-auth-query"

interface ICreateChannelRequest {
  orgId: string
  name: string
}

interface ICreateDMRequest {
  orgId: string
  usernames: string[]
}

interface IUpdateChannelRequest extends ICreateChannelRequest {
  roomId: string
}

interface IAddMembersRequest {
  orgId: string
  roomId: string
  usernames: string[]
}

export const roomApi = createApi({
  reducerPath: "roomApi",
  baseQuery: fetchAuthQuery({ baseUrl: "/orgs" }),
  tagTypes: ["Rooms"],
  endpoints: (builder) => ({
    createChannel: builder.mutation<IRoom, ICreateChannelRequest>({
      query: ({ orgId, name }) => ({
        url: `/${orgId}/channels`,
        method: "POST",
        body: { name },
      }),
      invalidatesTags: ["Rooms"],
    }),
    createDM: builder.mutation<IRoom, ICreateDMRequest>({
      query: ({ orgId, usernames }) => ({
        url: `/${orgId}/dms`,
        method: "POST",
        body: {
          usernames, // usernames length should be greater than 2 including current user
        },
      }),
      invalidatesTags: ["Rooms"],
    }),
    updateChannel: builder.mutation<IRoom, IUpdateChannelRequest>({
      query: ({ orgId, name, roomId }) => ({
        url: `/${orgId}/channels/${roomId}`,
        method: "PUT",
        body: { name },
      }),
      invalidatesTags: ["Rooms"],
    }),
    getAllRooms: builder.query<IRoom[], { orgId: string }>({
      query: ({ orgId }) => ({
        url: `/${orgId}/rooms`,
        method: "GET",
      }),
      providesTags: ["Rooms"],
    }),
    addMemberToChannel: builder.mutation<void, IAddMembersRequest>({
      query: ({ orgId, roomId, usernames }) => ({
        url: `/${orgId}/channels/${roomId}/add-members`,
        method: "POST",
        body: { usernames },
      }),
      invalidatesTags: ["Rooms"],
    }),
  }),
})

export const {
  useCreateChannelMutation,
  useCreateDMMutation,
  useUpdateChannelMutation,
  useGetAllRoomsQuery,
  useAddMemberToChannelMutation,
} = roomApi
