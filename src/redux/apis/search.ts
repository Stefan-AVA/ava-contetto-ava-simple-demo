import { createApi } from "@reduxjs/toolkit/query/react"

import type { IListing } from "@/types/listing.types"
import { ISearchResult } from "@/types/searchResult.types"

import { fetchAuthQuery } from "../fetch-auth-query"
import { IBaseResponse } from "./auth"

interface ISearchRequest {
  orgId: string
  agentId?: string
  search?: string
  cityId: string
  range: string
  contactId?: string
}

interface ISearchByAddressRequest {
  orgId: string
  address: string
}

interface ISaveSearchRequest {
  orgId: string
  searchId: string
  searchName: string
  contactId?: string
}

interface IGetProperyRequest {
  orgId: string
  searchId: string
  propertyId: string
}

interface IGetSearchResultsRequest {
  orgId: string
  contactId?: string
  agentId?: string
}

interface IGetSearchResultRequest {
  orgId: string
  searchId: string
  page: number
}

interface ISharePropertyRequest extends IGetProperyRequest {
  contactId: string
  message?: string
}

export const searchApi = createApi({
  reducerPath: "searchApi",
  baseQuery: fetchAuthQuery({ baseUrl: "/orgs" }),
  tagTypes: ["Searches", "Properties"],
  endpoints: (builder) => ({
    search: builder.query<
      { properties: IListing[]; total: number; searchResult: ISearchResult },
      ISearchRequest
    >({
      query: ({ orgId, ...rest }) => ({
        url: `/${orgId}/search`,
        method: "GET",
        params: rest,
      }),
    }),

    searchPropertiesByAddress: builder.query<
      IListing[],
      ISearchByAddressRequest
    >({
      query: ({ orgId, address }) => ({
        url: `/${orgId}/search`,
        method: "GET",
        params: {
          address,
        },
      }),
    }),

    // search-results
    saveSearch: builder.mutation<IBaseResponse, ISaveSearchRequest>({
      query: ({ orgId, searchId, searchName, contactId }) => ({
        url: `/${orgId}/search-results/${searchId}`,
        method: "POST",
        body: {
          searchName,
          contactId,
        },
      }),
      invalidatesTags: ["Searches"],
    }),
    getSearchResults: builder.query<ISearchResult[], IGetSearchResultsRequest>({
      query: ({ orgId, agentId, contactId }) => ({
        url: `/${orgId}/search-results`,
        method: "GET",
        params: {
          agentId,
          contactId,
        },
      }),
      providesTags: ["Searches"],
    }),
    getSearchResult: builder.query<
      {
        properties: IListing[]
        total: number
        rejects: IListing[]
        shortlists: IListing[]
        searchResult: ISearchResult
      },
      IGetSearchResultRequest
    >({
      query: ({ orgId, searchId, page }) => ({
        url: `/${orgId}/search-results/${searchId}`,
        method: "GET",
        params: {
          page,
        },
      }),
      providesTags: ["Searches"],
    }),
    deleteSearchResult: builder.mutation<
      IBaseResponse,
      IGetSearchResultRequest
    >({
      query: ({ orgId, searchId }) => ({
        url: `/${orgId}/search-results/${searchId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Searches"],
    }),
    getSearchResultsByContact: builder.query<
      ISearchResult[],
      IGetSearchResultsRequest
    >({
      query: ({ orgId, contactId }) => ({
        url: `/${orgId}/search-results/contacts/${contactId}`,
        method: "GET",
      }),
      providesTags: ["Searches"],
    }),
    shareSearchResult: builder.mutation<
      ISearchResult,
      Omit<ISaveSearchRequest, "searchName">
    >({
      query: ({ orgId, searchId, contactId }) => ({
        url: `/${orgId}/search-results/${searchId}/share`,
        method: "POST",
        body: {
          contactId,
        },
      }),
      invalidatesTags: ["Searches"],
    }),

    // ========== property ==========
    getProperty: builder.query<
      { property: IListing; searchResult: ISearchResult },
      IGetProperyRequest
    >({
      query: ({ orgId, searchId, propertyId }) => ({
        url: `/${orgId}/search-results/${searchId}/property/${propertyId}`,
        method: "GET",
      }),
      providesTags: ["Properties"],
    }),
    shortlistProperty: builder.mutation<
      { property: IListing; searchResult: ISearchResult },
      IGetProperyRequest
    >({
      query: ({ orgId, searchId, propertyId }) => ({
        url: `/${orgId}/search-results/${searchId}/property/${propertyId}/shortlist`,
        method: "POST",
      }),
      invalidatesTags: ["Searches", "Properties"],
    }),
    rejectProperty: builder.mutation<
      { property: IListing; searchResult: ISearchResult },
      IGetProperyRequest
    >({
      query: ({ orgId, searchId, propertyId }) => ({
        url: `/${orgId}/search-results/${searchId}/property/${propertyId}/reject`,
        method: "POST",
      }),
      invalidatesTags: ["Searches", "Properties"],
    }),
    undoProperty: builder.mutation<
      { property: IListing; searchResult: ISearchResult },
      IGetProperyRequest
    >({
      query: ({ orgId, searchId, propertyId }) => ({
        url: `/${orgId}/search-results/${searchId}/property/${propertyId}/undo`,
        method: "POST",
      }),
      invalidatesTags: ["Searches", "Properties"],
    }),
    shareProperty: builder.mutation<void, ISharePropertyRequest>({
      query: ({ orgId, searchId, propertyId, contactId, message }) => ({
        url: `/${orgId}/search-results/${searchId}/property/${propertyId}/share`,
        method: "POST",
        body: {
          contactId,
          message,
        },
      }),
      invalidatesTags: ["Searches", "Properties"],
    }),
  }),
})

export const {
  useLazySearchQuery,
  useLazySearchPropertiesByAddressQuery,
  useGetSearchResultsQuery,
  useGetSearchResultQuery,
  useLazyGetSearchResultQuery,
  useSaveSearchMutation,
  useDeleteSearchResultMutation,
  useGetSearchResultsByContactQuery,
  useShareSearchResultMutation,

  useGetPropertyQuery,
  useShortlistPropertyMutation,
  useRejectPropertyMutation,
  useUndoPropertyMutation,
  useSharePropertyMutation,
} = searchApi
