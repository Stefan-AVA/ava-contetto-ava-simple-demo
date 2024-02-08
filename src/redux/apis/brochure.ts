import { createApi } from "@reduxjs/toolkit/query/react"

import { IBrochure } from "@/types/brochure.types"
import { TemplateType } from "@/types/template.types"

import { fetchAuthQuery } from "../fetch-auth-query"
import { IBaseResponse } from "./auth"

interface BaseRequest {
  orgId: string
}

interface ICreateBrochureRequest extends BaseRequest {
  propertyId: string
  layoutId: string
  data: any
  type: TemplateType
}

interface IGetBrochureRequest extends BaseRequest {
  brochureId: string
}

interface IUpdateBrochureRequest extends BaseRequest {
  brochureId: string
  data: any
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

    // brochure images
    uploadBrochureImage: builder.mutation<
      IBrochure,
      IUpoadBrochureImageRequest
    >({
      query: ({ orgId, ...rest }) => ({
        url: `/${orgId}/brochure-images`,
        method: "POST",
        body: rest,
      }),
      invalidatesTags: ["BrochureImages"],
    }),
    getBrochureImages: builder.query<IBrochure[], BaseRequest>({
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

  useUploadBrochureImageMutation,
  useGetBrochureImagesQuery,
  useDeleteBrochureImageMutation,
} = brochureApi
