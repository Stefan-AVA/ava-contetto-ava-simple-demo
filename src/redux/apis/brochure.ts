import { createApi } from "@reduxjs/toolkit/query/react"

import { IBrochure } from "@/types/brochure.types"
import { ITemplateImage, TemplateType } from "@/types/template.types"

import { fetchAuthQuery } from "../fetch-auth-query"
import { IBaseResponse } from "./auth"

interface BaseRequest {
  orgId: string
}

interface ICreateBrochureRequest extends BaseRequest {
  name: string
  propertyId: string
  layoutId: string
  data: any
  type: TemplateType
}

interface IGetBrochureRequest extends BaseRequest {
  brochureId: string
}

interface IUpdateBrochureRequest extends BaseRequest {
  name: string
  brochureId: string
  data: any
}

interface IDownloadBrochurePDFRequest extends BaseRequest {
  svg: string
}

interface ICopySocialLink extends BaseRequest {
  brochureId: string
  imageData: string
  imageType: string
}

interface ICopyBrochureLink extends BaseRequest {
  brochureId: string
  svg: string
}

interface IUpoadBrochureImageRequest extends BaseRequest {
  name: string // file name
  imageData: string // base64 encoded image
  imageType: string // file.type
}

interface IDeleteBrochureImageRequest extends BaseRequest {
  imageId: string
}

export const brochureApi = createApi({
  reducerPath: "brochureApi",
  baseQuery: fetchAuthQuery({ baseUrl: "/orgs" }),
  tagTypes: ["Brochures", "BrochureImages"],
  endpoints: (builder) => ({
    // brochures
    createBrochure: builder.mutation<IBrochure, ICreateBrochureRequest>({
      query: ({ orgId, ...rest }) => ({
        url: `/${orgId}/brochures`,
        method: "POST",
        body: rest,
      }),
      invalidatesTags: ["Brochures"],
    }),
    getBrochures: builder.query<IBrochure[], BaseRequest>({
      query: ({ orgId }) => ({
        url: `/${orgId}/brochures`,
        method: "GET",
      }),
      providesTags: ["Brochures"],
    }),
    getBrochure: builder.query<IBrochure, IGetBrochureRequest>({
      query: ({ orgId, brochureId }) => ({
        url: `/${orgId}/brochures/${brochureId}`,
        method: "GET",
      }),
      providesTags: ["Brochures"],
    }),
    updateBrochure: builder.mutation<IBrochure, IUpdateBrochureRequest>({
      query: ({ orgId, brochureId, data }) => ({
        url: `/${orgId}/brochures/${brochureId}`,
        method: "PUT",
        body: { data },
      }),
      invalidatesTags: ["Brochures"],
    }),
    deleteBrochure: builder.mutation<IBaseResponse, IGetBrochureRequest>({
      query: ({ orgId, brochureId }) => ({
        url: `/${orgId}/brochures/${brochureId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Brochures"],
    }),
    downloadPDFForBrochureTemplate: builder.mutation<
      IBrochure,
      IDownloadBrochurePDFRequest
    >({
      query: ({ orgId, svg }) => ({
        url: `/${orgId}/brochures/download-brochure-pdf`,
        method: "POST",
        body: { svg },
      }),
    }),
    copySocialLink: builder.mutation<IBrochure, ICopySocialLink>({
      query: ({ orgId, brochureId, imageData, imageType }) => ({
        url: `/${orgId}/brochures/${brochureId}/copy-social-link`,
        method: "POST",
        body: { imageData, imageType },
      }),
      invalidatesTags: ["Brochures"],
    }),
    copyBrochureLink: builder.mutation<IBrochure, ICopyBrochureLink>({
      query: ({ orgId, brochureId, svg }) => ({
        url: `/${orgId}/brochures/${brochureId}/copy-brochure-link`,
        method: "POST",
        body: { svg },
      }),
      invalidatesTags: ["Brochures"],
    }),

    // brochure images
    uploadBrochureImage: builder.mutation<
      ITemplateImage,
      IUpoadBrochureImageRequest
    >({
      query: ({ orgId, ...rest }) => ({
        url: `/${orgId}/brochure-images`,
        method: "POST",
        body: rest,
      }),
      invalidatesTags: ["BrochureImages"],
    }),
    getBrochureImages: builder.query<ITemplateImage[], BaseRequest>({
      query: ({ orgId }) => ({
        url: `/${orgId}/brochure-images`,
        method: "GET",
      }),
      providesTags: ["BrochureImages"],
    }),
    deleteBrochureImage: builder.mutation<
      IBaseResponse,
      IDeleteBrochureImageRequest
    >({
      query: ({ orgId, imageId }) => ({
        url: `/${orgId}/brochure-images/${imageId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["BrochureImages"],
    }),
  }),
})

export const {
  useCreateBrochureMutation,
  useGetBrochuresQuery,
  useGetBrochureQuery,
  useUpdateBrochureMutation,
  useDeleteBrochureMutation,
  useDownloadPDFForBrochureTemplateMutation,
  useCopySocialLinkMutation,
  useCopyBrochureLinkMutation,

  useUploadBrochureImageMutation,
  useGetBrochureImagesQuery,
  useDeleteBrochureImageMutation,
} = brochureApi
