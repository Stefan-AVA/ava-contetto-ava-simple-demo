import { createApi } from "@reduxjs/toolkit/query/react"

import { IRoom, IRoomAgent, IRoomContact } from "@/types/room.types"

import { fetchAuthQuery } from "../fetch-auth-query"

interface ICreateChannelRequest {
  orgId: string
  name: string
}

interface IUpdateChannelRequest extends ICreateChannelRequest {
  roomId: string
}

interface ICreateDMRequest {
  orgId: string
  agents: IRoomAgent[]
  contacts: IRoomContact[]
}

interface IAddMembersRequest {
  orgId: string
  roomId: string
  agents: IRoomAgent[]
  contacts: IRoomContact[]
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
      query: ({ orgId, agents, contacts }) => ({
        url: `/${orgId}/dms`,
        method: "POST",
        body: {
          agents,
          contacts,
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
      query: ({ orgId, roomId, agents, contacts }) => ({
        url: `/${orgId}/channels/${roomId}/add-members`,
        method: "POST",
        body: {
          agents,
          contacts,
        },
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
