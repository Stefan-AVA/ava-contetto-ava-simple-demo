import { createApi } from "@reduxjs/toolkit/query/react"

import { IOrgTemplate } from "@/types/orgTemplate.types"
import { ITemplate } from "@/types/template.types"

import { fetchAuthQuery } from "../fetch-auth-query"
import { IBaseResponse } from "./auth"

interface BaseRequest {
  orgId: string
}

interface IAddOrgTemplateRequest extends BaseRequest {
  templateId: string
}

interface IHideShowRequest extends BaseRequest {
  templateId: string
  hidden: boolean
}

export const templateApi = createApi({
  reducerPath: "templateApi",
  baseQuery: fetchAuthQuery({ baseUrl: "/orgs" }),
  tagTypes: ["Templates", "OrgTemplates"],
  endpoints: (builder) => ({
    getTemplates: builder.query<ITemplate[], BaseRequest>({
      query: ({ orgId }) => ({
        url: `/${orgId}/templates`,
        method: "GET",
      }),
      providesTags: ["Templates"],
    }),
    addOrgTemplate: builder.mutation<IOrgTemplate, IAddOrgTemplateRequest>({
      query: ({ orgId, templateId }) => ({
        url: `/${orgId}/org-templates`,
        method: "POST",
        body: { templateId },
      }),
      invalidatesTags: ["OrgTemplates"],
    }),
    getOrgTemplates: builder.query<IOrgTemplate[], BaseRequest>({
      query: ({ orgId }) => ({
        url: `/${orgId}/org-templates`,
        method: "GET",
      }),
      providesTags: ["OrgTemplates"],
    }),
    getOrgTemplate: builder.query<IOrgTemplate, IAddOrgTemplateRequest>({
      query: ({ orgId, templateId }) => ({
        url: `/${orgId}/org-templates/${templateId}`,
        method: "GET",
      }),
      providesTags: ["OrgTemplates"],
    }),
    hideShowTemplate: builder.mutation<IOrgTemplate, IHideShowRequest>({
      query: ({ orgId, templateId, hidden }) => ({
        url: `/${orgId}/org-templates/${templateId}`,
        method: "PUT",
        body: { hidden },
      }),
      invalidatesTags: ["Templates", "OrgTemplates"],
    }),
    deleteOrgTemplate: builder.mutation<IBaseResponse, IAddOrgTemplateRequest>({
      query: ({ orgId, templateId }) => ({
        url: `/${orgId}/org-templates/${templateId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["OrgTemplates"],
    }),
  }),
})

export const {
  useGetTemplatesQuery,
  useAddOrgTemplateMutation,
  useGetOrgTemplatesQuery,
  useGetOrgTemplateQuery,
  useHideShowTemplateMutation,
  useDeleteOrgTemplateMutation,
} = templateApi
