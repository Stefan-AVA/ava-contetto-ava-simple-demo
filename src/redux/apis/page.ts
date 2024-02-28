import { createApi } from "@reduxjs/toolkit/query/react"

import { IPage } from "@/types/page.types"
import { ITemplateImage } from "@/types/template.types"

import { fetchAuthQuery } from "../fetch-auth-query"
import { IBaseResponse } from "./auth"

interface IBaseRequest {
  orgId: string
}

interface ICreatePageRequest extends IBaseRequest {
  orgId: string
  title: string
  html: string
  css: string
  isPublished: string
}

interface IGetMyPageRequest extends IBaseRequest {
  pageId: string
}

interface IUpdatePageRequest extends ICreatePageRequest {
  pageId: string
}

interface IUpoadImageRequest extends IBaseRequest {
  name: string // file name
  imageData: string // base64 encoded image
  imageType: string // file.type
}

interface IDeleteImageRequest extends IBaseRequest {
  imageId: string
}

export const pageApi = createApi({
  reducerPath: "pageApi",
  baseQuery: fetchAuthQuery(),
  tagTypes: ["Pages", "PageImages"],
  endpoints: (builder) => ({
    // Pages
    createPage: builder.mutation<IPage, ICreatePageRequest>({
      query: ({ orgId, ...rest }) => ({
        url: `/orgs/${orgId}/pages`,
        method: "POST",
        body: rest,
      }),
      invalidatesTags: ["Pages"],
    }),
    getMyPages: builder.query<IPage[], IBaseRequest>({
      query: ({ orgId }) => ({
        url: `/orgs/${orgId}/pages`,
        method: "GET",
      }),
      providesTags: ["Pages"],
    }),
    getMyPage: builder.query<IPage, IGetMyPageRequest>({
      query: ({ orgId, pageId }) => ({
        url: `/orgs/${orgId}/pages/${pageId}`,
        method: "GET",
      }),
      providesTags: ["Pages"],
    }),
    updatePage: builder.mutation<IPage, IUpdatePageRequest>({
      query: ({ orgId, pageId, ...rest }) => ({
        url: `/orgs/${orgId}/pages/${pageId}`,
        method: "PUT",
        body: rest,
      }),
      invalidatesTags: ["Pages"],
    }),
    deletePage: builder.mutation<IBaseResponse, IGetMyPageRequest>({
      query: ({ orgId, pageId }) => ({
        url: `/orgs/${orgId}/pages/${pageId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Pages"],
    }),

    // page images
    uploadPageImage: builder.mutation<ITemplateImage, IUpoadImageRequest>({
      query: ({ orgId, ...rest }) => ({
        url: `/orgs/${orgId}/page-images`,
        method: "POST",
        body: rest,
      }),
      invalidatesTags: ["PageImages"],
    }),
    getPageImages: builder.query<ITemplateImage[], IBaseRequest>({
      query: ({ orgId }) => ({
        url: `/orgs/${orgId}/page-images`,
        method: "GET",
      }),
      providesTags: ["PageImages"],
    }),
    deletePageImage: builder.mutation<IBaseResponse, IDeleteImageRequest>({
      query: ({ orgId, imageId }) => ({
        url: `/orgs/${orgId}/page-images/${imageId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["PageImages"],
    }),

    // public apis without auth
    getPublicPages: builder.query<IPage[], void>({
      query: () => ({
        url: "/pages",
        method: "GET",
      }),
    }),
    getPageBySlug: builder.query<IPage, { slug: string }>({
      query: ({ slug }) => ({
        url: `/pages/${slug}`,
        method: "GET",
      }),
    }),
  }),
})

export const {
  useCreatePageMutation,
  useGetMyPagesQuery,
  useGetMyPageQuery,
  useUpdatePageMutation,
  useDeletePageMutation,

  useUploadPageImageMutation,
  useGetPageImagesQuery,
  useDeletePageImageMutation,

  useGetPublicPagesQuery,
  useGetPageBySlugQuery,
} = pageApi
