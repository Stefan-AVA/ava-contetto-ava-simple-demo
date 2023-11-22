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
    }),
    getSearchResults: builder.query<ISearchResult[], IGetSearchResultsRequest>({
      query: ({ orgId, contactId }) => ({
        url: `/${orgId}/search-results`,
        method: "GET",
        params: {
          contactId,
        },
      }),
    }),
    getSearchResult: builder.query<
      { properties: IListing[]; searchResult: ISearchResult },
      IGetSearchResultRequest
    >({
      query: ({ orgId, searchId }) => ({
        url: `/${orgId}/search-results/${searchId}`,
        method: "GET",
      }),
    }),
    getProperty: builder.query<
      { property: IListing; searchResult: ISearchResult },
      IGetProperyRequest
    >({
      query: ({ orgId, searchId, propertyId }) => ({
        url: `/${orgId}/search-results/${searchId}/property/${propertyId}`,
        method: "GET",
      }),
    }),
  }),
})

export const {
  useLazySearchQuery,
  useGetSearchResultsQuery,
  useGetSearchResultQuery,
  useSaveSearchMutation,
  useGetPropertyQuery,
} = searchApi
