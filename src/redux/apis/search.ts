import { createApi } from "@reduxjs/toolkit/query/react"

import type { IListing } from "@/types/listing.types"

import { fetchAuthQuery } from "../fetch-auth-query"
import { IRequestWithId } from "./org"

interface ISearchRequest {
  search?: string
}

export const searchApi = createApi({
  reducerPath: "searchApi",
  baseQuery: fetchAuthQuery({ baseUrl: "/search" }),
  endpoints: (builder) => ({
    search: builder.query<IListing[], ISearchRequest>({
      query: ({ search }) => ({
        url: "",
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
