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

export const orgApi = createApi({
  reducerPath: "orgApi",
  baseQuery: fetchAuthQuery({ baseUrl: "/orgs" }),
  endpoints: (builder) => ({
    createOrg: builder.mutation<
      IBaseResponse,
      Omit<IOrg, "_id | owner | deleted">
    >({
      query: (data) => ({
        url: "",
        method: "POST",
        body: data,
      }),
    }),
    updateOrg: builder.mutation<IBaseResponse, IOrg>({
      query: ({ _id, ...rest }) => ({
        url: `/${_id}`,
        method: "PUT",
        body: rest,
      }),
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
    }),
    getMembers: builder.query<IAgentProfile[], IRequestWithId>({
      query: ({ id }) => ({
        url: `/${id}/members`,
        method: "GET",
      }),
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
} = orgApi
