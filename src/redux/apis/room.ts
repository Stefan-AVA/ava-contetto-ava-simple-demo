import { createApi } from "@reduxjs/toolkit/query/react"

import { IRoom, IRoomAgent, IRoomContact } from "@/types/room.types"

import { fetchAuthQuery } from "../fetch-auth-query"

interface ICreateChannelRequest {
  orgId: string
  name: string
  isPublic: boolean
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

interface IRemoveMemberRequest {
  orgId: string
  roomId: string
  agent?: IRoomAgent
  contact?: IRoomContact
}

interface IArchiveRoomRequest {
  orgId: string
  roomId: string
}

export const roomApi = createApi({
  reducerPath: "roomApi",
  baseQuery: fetchAuthQuery(),
  tagTypes: ["Rooms"],
  endpoints: (builder) => ({
    createChannel: builder.mutation<IRoom, ICreateChannelRequest>({
      query: ({ orgId, name }) => ({
        url: `/orgs/${orgId}/channels`,
        method: "POST",
        body: { name },
      }),
      invalidatesTags: ["Rooms"],
    }),
    createDM: builder.mutation<IRoom, ICreateDMRequest>({
      query: ({ orgId, agents, contacts }) => ({
        url: `/orgs/${orgId}/dms`,
        method: "POST",
        body: {
          agents,
          contacts,
        },
      }),
    }),
    updateChannel: builder.mutation<IRoom, IUpdateChannelRequest>({
      query: ({ orgId, name, roomId }) => ({
        url: `/orgs/${orgId}/channels/${roomId}`,
        method: "PUT",
        body: { name },
      }),
      invalidatesTags: ["Rooms"],
    }),
    // get all rooms across all orgs
    getAllRooms: builder.query<IRoom[], void>({
      query: () => ({
        url: `/rooms`,
        method: "GET",
      }),
      providesTags: ["Rooms"],
    }),
    addMemberToChannel: builder.mutation<void, IAddMembersRequest>({
      query: ({ orgId, roomId, agents, contacts }) => ({
        url: `/orgs/${orgId}/channels/${roomId}/add-members`,
        method: "POST",
        body: {
          agents,
          contacts,
        },
      }),
    }),
    removeMemberFromRoom: builder.mutation<void, IRemoveMemberRequest>({
      query: ({ orgId, roomId, agent, contact }) => ({
        url: `/orgs/${orgId}/channels/${roomId}/remove-member`,
        method: "POST",
        body: {
          agent,
          contact,
        },
      }),
    }),
    archiveRoom: builder.mutation<void, IArchiveRoomRequest>({
      query: ({ orgId, roomId }) => ({
        url: `/orgs/${orgId}/channels/${roomId}`,
        method: "DELETE",
      }),
    }),
  }),
})

export const {
  useCreateChannelMutation,
  useCreateDMMutation,
  useUpdateChannelMutation,
  useLazyGetAllRoomsQuery,
  useAddMemberToChannelMutation,
  useRemoveMemberFromRoomMutation,
  useArchiveRoomMutation,
} = roomApi
