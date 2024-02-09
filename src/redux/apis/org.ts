import { createApi } from "@reduxjs/toolkit/query/react"

import type { IAgentProfile } from "@/types/agentProfile.types"
import type { IContact, IContactNote } from "@/types/contact.types"
import { IInvite } from "@/types/invite.types"
import type { IOrg, IOrgBrand } from "@/types/org.types"
import type { DefaultAvaOrgTheme } from "@/styles/white-label-theme"

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

interface IShareContactResponse {
  link: string
}

interface ISearchContactRequest {
  orgId: string
  search: string
}

interface ICreateOrgRequest {
  name: string
  industryId: string
  logoUrl?: string
  logoFileType?: string
}

interface IUpdateOrgRequest {
  _id: string
  name: string
  logoUrl?: string
  logoFileType?: string
}

interface ICreateContactRequest {
  orgId: string
  name: string
  _id?: string
  email?: string
  phone?: string
  image?: string
  imageFileType?: string
  note?: string
}

interface IContactRequest {
  orgId: string
  contactId: string
  _id?: string
  note?: string
}

interface ISetWhiteLableRequest extends DefaultAvaOrgTheme {
  orgId: string
}

interface IUploadBrandLogoRequest {
  orgId: string
  logoUrl: string
  logoFileType: string
}

interface ISetBrandRequest extends IOrgBrand {
  orgId: string
  name: string // org name
}

export const orgApi = createApi({
  reducerPath: "orgApi",
  baseQuery: fetchAuthQuery({ baseUrl: "/orgs" }),
  tagTypes: ["Orgs", "Members", "Contacts", "Notes"],
  endpoints: (builder) => ({
    createOrg: builder.mutation<
      { orgId: string; agentProfileId: string },
      ICreateOrgRequest
    >({
      query: (data) => ({
        url: "",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Orgs"],
    }),
    updateOrg: builder.mutation<IBaseResponse, IUpdateOrgRequest>({
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
    setWhiteLabel: builder.mutation<IAgentProfile, ISetWhiteLableRequest>({
      query: ({ orgId, ...rest }) => ({
        url: `/${orgId}/set-whitelabel`,
        method: "POST",
        body: rest,
      }),
      invalidatesTags: ["Orgs"],
    }),
    uploadBrandLogo: builder.mutation<{ url: string }, IUploadBrandLogoRequest>(
      {
        query: ({ orgId, ...rest }) => ({
          url: `/${orgId}/brand/logo`,
          method: "POST",
          body: rest,
        }),
      }
    ),
    setBrand: builder.mutation<IBaseResponse, ISetBrandRequest>({
      query: ({ orgId, ...rest }) => ({
        url: `/${orgId}/brand`,
        method: "POST",
        body: rest,
      }),
      invalidatesTags: ["Orgs"],
    }),

    // agent
    getMembers: builder.query<
      { members: IAgentProfile[]; invitations: IInvite[] },
      IRequestWithId
    >({
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
    createContact: builder.mutation<IContact, ICreateContactRequest>({
      query: ({ orgId, ...rest }) => ({
        url: `/${orgId}/contacts`,
        method: "POST",
        body: rest,
      }),
      invalidatesTags: ["Contacts"],
    }),
    updateContact: builder.mutation<IContact, ICreateContactRequest>({
      query: ({ _id, orgId, ...rest }) => ({
        url: `/${orgId}/contacts/${_id}`,
        method: "PUT",
        body: rest,
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
    searchContacts: builder.query<IContact[], ISearchContactRequest>({
      query: ({ orgId, search }) => ({
        url: `/${orgId}/contacts/search`,
        method: "GET",
        params: {
          search,
        },
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
    shareContact: builder.mutation<IShareContactResponse, Partial<IContact>>({
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

    // contact notes
    createNote: builder.mutation<IBaseResponse, IContactRequest>({
      query: ({ orgId, contactId, note }) => ({
        url: `/${orgId}/contacts/${contactId}/notes`,
        method: "POST",
        body: {
          note,
        },
      }),
      invalidatesTags: ["Notes"],
    }),
    updateNote: builder.mutation<IBaseResponse, IContactRequest>({
      query: ({ _id, orgId, contactId, note }) => ({
        url: `/${orgId}/contacts/${contactId}/notes/${_id}`,
        method: "PUT",
        body: {
          note,
        },
      }),
      invalidatesTags: ["Notes"],
    }),
    deleteNote: builder.mutation<IBaseResponse, IContactRequest>({
      query: ({ _id, orgId, contactId }) => ({
        url: `/${orgId}/contacts/${contactId}/notes/${_id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Notes"],
    }),
    getNotes: builder.query<IContactNote[], IContactRequest>({
      query: ({ orgId, contactId }) => ({
        url: `/${orgId}/contacts/${contactId}/notes`,
        method: "GET",
      }),
      providesTags: ["Notes"],
    }),
  }),
})

export const {
  useCreateOrgMutation,
  useUpdateOrgMutation,
  useGetOrgsQuery,
  useGetOrgQuery,
  useSetWhiteLabelMutation,
  useUploadBrandLogoMutation,
  useSetBrandMutation,

  // agent
  useGetMembersQuery,
  useLazyGetOrgsQuery,
  useInviteAgentMutation,
  useInviteContactMutation,
  useAcceptInviteMutation,

  // contacts
  useGetContactQuery,
  useGetContactsQuery,
  useSearchContactsQuery,
  useBindContactMutation,
  useShareContactMutation,
  useDeleteContactMutation,
  useCreateContactMutation,
  useUpdateContactMutation,

  // contact notes
  useGetNotesQuery,
  useCreateNoteMutation,
  useUpdateNoteMutation,
  useDeleteNoteMutation,
} = orgApi
