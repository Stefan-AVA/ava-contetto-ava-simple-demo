import { createApi } from "@reduxjs/toolkit/query/react"

import type { IListing } from "@/types/listing.types"
import { ISearchResult } from "@/types/searchResult.types"

import { fetchAuthQuery } from "../fetch-auth-query"
import { IBaseResponse } from "./auth"

interface ISearchRequest {
  orgId: string
  search?: string
  contactId?: string
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
}

interface IGetSearchResultRequest {
  orgId: string
  searchId: string
}

export const searchApi = createApi({
  reducerPath: "searchApi",
  baseQuery: fetchAuthQuery({ baseUrl: "/orgs" }),
  tagTypes: ["Searches", "Properties"],
  endpoints: (builder) => ({
    search: builder.query<
      { properties: IListing[]; searchResult: ISearchResult },
      ISearchRequest
    >({
      query: ({ orgId, search, contactId }) => ({
        url: `/${orgId}/search`,
        method: "GET",
        params: {
          search,
          contactId,
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
      query: ({ orgId, contactId }) => ({
        url: `/${orgId}/search-results`,
        method: "GET",
        params: {
          contactId,
        },
      }),
      providesTags: ["Searches"],
    }),
    getSearchResult: builder.query<
      { properties: IListing[]; searchResult: ISearchResult },
      IGetSearchResultRequest
    >({
      query: ({ orgId, searchId }) => ({
        url: `/${orgId}/search-results/${searchId}`,
        method: "GET",
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
  }),
})

export const {
  useLazySearchQuery,
  useGetSearchResultsQuery,
  useGetSearchResultQuery,
  useSaveSearchMutation,
  useDeleteSearchResultMutation,
  useGetSearchResultsByContactQuery,

  useGetPropertyQuery,
  useShortlistPropertyMutation,
  useRejectPropertyMutation,
  useUndoPropertyMutation,
} = searchApi
