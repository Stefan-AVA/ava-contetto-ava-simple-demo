import { createApi } from "@reduxjs/toolkit/query/react"

import type { IListing } from "@/types/listing.types"
import { ISearchResult } from "@/types/searchResult.types"

import { fetchAuthQuery } from "../fetch-auth-query"
import { IRequestWithId } from "./org"

interface ISearchRequest {
  orgId: string
  search?: string
}

export const searchApi = createApi({
  reducerPath: "searchApi",
  baseQuery: fetchAuthQuery({ baseUrl: "/orgs" }),
  endpoints: (builder) => ({
    search: builder.query<
      { properties: IListing[]; searchResult: ISearchResult },
      ISearchRequest
    >({
      query: ({ orgId, search }) => ({
        url: `/${orgId}/search`,
        method: "GET",
        params: {
          search,
        },
      }),
    }),
    getListing: builder.query<IListing, IRequestWithId>({
      query: ({ id }) => ({
        url: `/${id}`,
        method: "GET",
      }),
    }),
  }),
})

export const { useLazySearchQuery, useGetListingQuery } = searchApi
