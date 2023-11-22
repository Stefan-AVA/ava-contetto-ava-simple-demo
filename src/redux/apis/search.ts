import { createApi } from "@reduxjs/toolkit/query/react"

import type { IListing } from "@/types/listing.types"
import { ISearchResult } from "@/types/searchResult.types"

import { fetchAuthQuery } from "../fetch-auth-query"
import { IBaseResponse } from "./auth"
import { IRequestWithId } from "./org"

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
  useSaveSearchMutation,
  useGetPropertyQuery,
} = searchApi
