import { createApi } from "@reduxjs/toolkit/query/react"

import { IAgentProfile } from "@/types/agentProfile.types"
import { IContact } from "@/types/contact.types"
import { IOrg } from "@/types/org.types"

import { fetchAuthQuery } from "../fetchAuthQuery"
import { IBaseResponse } from "./auth"

export interface IRequestWithId {
  id: string
}

interface IINviteAgentRquest {
  id: string
  email: string
  role: string
}

interface IINviteContactRquest {
  id: string
  email: string
}

interface IAcceptInviteRequest {
  id: string
  code: string
}

export const orgApi = createApi({
  reducerPath: "orgApi",
  baseQuery: fetchAuthQuery({ baseUrl: "/orgs" }),
  tagTypes: ["Orgs", "Members"],
  endpoints: (builder) => ({
    createOrg: builder.mutation<
      { orgId: string },
      Omit<IOrg, "_id" | "owner" | "deleted">
    >({
      query: (data) => ({
        url: "",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Orgs"],
    }),
    updateOrg: builder.mutation<IBaseResponse, IOrg>({
      query: ({ _id, ...rest }) => ({
        url: `/${_id}`,
        method: "PUT",
        body: rest,
      }),
      invalidatesTags: ["Orgs"],
    }),
    deleteOrg: builder.mutation<IBaseResponse, IRequestWithId>({
      query: ({ id }) => ({
        url: `/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Orgs"],
    }),
    getOrgs: builder.query<
      {
        agentProfiles: IAgentProfile[]
        contacts: IContact[]
      },
      void
    >({
      query: () => ({
        url: "",
        method: "GET",
      }),
      providesTags: ["Orgs"],
    }),
    getOrg: builder.query<
      {
        org: IOrg
        agentProfile: IAgentProfile
      },
      IRequestWithId
    >({
      query: ({ id }) => ({
        url: `/${id}`,
        method: "GET",
      }),
      providesTags: ["Orgs"],
    }),
    getMembers: builder.query<IAgentProfile[], IRequestWithId>({
      query: ({ id }) => ({
        url: `/${id}/members`,
        method: "GET",
      }),
      providesTags: ["Orgs", "Members"],
    }),
    inviteAgent: builder.mutation<IBaseResponse, IINviteAgentRquest>({
      query: ({ id, ...rest }) => ({
        url: `/${id}/invite-agent`,
        method: "POST",
        body: rest,
      }),
    }),
    inviteContact: builder.mutation<IBaseResponse, IINviteContactRquest>({
      query: ({ id, ...rest }) => ({
        url: `/${id}/invite-contact`,
        method: "POST",
        body: rest,
      }),
    }),
    acceptInvite: builder.mutation<IBaseResponse, IAcceptInviteRequest>({
      query: ({ id, code }) => ({
        url: `/${id}/invite-accept`,
        method: "POST",
        body: {
          code,
        },
      }),
    }),
  }),
})

export const {
  useCreateOrgMutation,
  useUpdateOrgMutation,
  useGetOrgsQuery,
  useGetOrgQuery,
  useGetMembersQuery,
  useInviteAgentMutation,
  useInviteContactMutation,
  useAcceptInviteMutation,
} = orgApi
