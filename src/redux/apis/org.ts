import { createApi } from "@reduxjs/toolkit/query/react"

import type { IAgentProfile } from "@/types/agentProfile.types"
import type { IContact } from "@/types/contact.types"
import type { IOrg } from "@/types/org.types"

import { fetchAuthQuery } from "../fetch-auth-query"
import type { IBaseResponse } from "./auth"

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
  tagTypes: ["Orgs", "Members", "Contacts"],
  endpoints: (builder) => ({
    createOrg: builder.mutation<
      { orgId: string; agentProfileId: string },
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
    acceptInvite: builder.mutation<IAgentProfile, IAcceptInviteRequest>({
      query: ({ id, code }) => ({
        url: `/${id}/invite-accept`,
        method: "POST",
        body: {
          code,
        },
      }),
    }),

    // for contacts
    createContact: builder.mutation<IContact, Partial<IContact>>({
      query: ({ orgId, name, note }) => ({
        url: `/${orgId}/contacts`,
        method: "POST",
        body: {
          name,
          note,
        },
      }),
      invalidatesTags: ["Contacts"],
    }),
    updateContact: builder.mutation<IContact, Partial<IContact>>({
      query: ({ _id, orgId, name, note }) => ({
        url: `/${orgId}/contacts/${_id}`,
        method: "PUT",
        body: {
          name,
          note,
        },
      }),
      invalidatesTags: ["Contacts"],
    }),
    getContacts: builder.query<IContact[], Partial<IContact>>({
      query: ({ orgId }) => ({
        url: `/${orgId}/contacts`,
        method: "GET",
      }),
      providesTags: ["Contacts"],
    }),
    getContact: builder.query<IContact, Partial<IContact>>({
      query: ({ _id, orgId }) => ({
        url: `/${orgId}/contacts/${_id}`,
        method: "GET",
      }),
      providesTags: ["Contacts"],
    }),
    searchContacts: builder.query<IContact[], Partial<IContact>>({
      query: ({ _id, orgId }) => ({
        url: `/${orgId}/contacts/search`,
        method: "GET",
      }),
      providesTags: ["Contacts"],
    }),
    deleteContact: builder.mutation<IContact, Partial<IContact>>({
      query: ({ _id, orgId }) => ({
        url: `/${orgId}/contacts/${_id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Contacts"],
    }),
    shareContact: builder.mutation<IContact, Partial<IContact>>({
      query: ({ _id, orgId }) => ({
        url: `/${orgId}/contacts/${_id}/share`,
        method: "POST",
      }),
      invalidatesTags: ["Contacts"],
    }),
    bindContact: builder.mutation<IContact, Partial<IContact>>({
      query: ({ _id, orgId, inviteCode }) => ({
        url: `/${orgId}/contacts/${_id}/bind`,
        method: "POST",
        body: {
          inviteCode,
        },
      }),
      invalidatesTags: ["Contacts"],
    }),
  }),
})

export const {
  useCreateOrgMutation,
  useUpdateOrgMutation,
  useGetOrgsQuery,
  useGetOrgQuery,
  useGetMembersQuery,
  useLazyGetOrgsQuery,
  useInviteAgentMutation,
  useInviteContactMutation,
  useAcceptInviteMutation,

  // contacts
  useSearchContactsQuery,
  useBindContactMutation,
  useCreateContactMutation,
} = orgApi