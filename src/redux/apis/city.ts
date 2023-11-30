import { createApi } from "@reduxjs/toolkit/query/react"

import { ICity } from "@/types/city.types"

import { fetchAuthQuery } from "../fetch-auth-query"

export const cityApi = createApi({
  reducerPath: "cityApi",
  baseQuery: fetchAuthQuery({ baseUrl: "/cities" }),
  endpoints: (builder) => ({
    nearestCities: builder.query<ICity[], { lat: number; lng: number }>({
      query: ({ lat, lng }) => ({
        url: "/nearest",
        method: "GET",
        params: {
          lat,
          lng,
        },
      }),
    }),
    searchCities: builder.query<ICity[], { search: string }>({
      query: ({ search }) => ({
        url: "",
        method: "GET",
        params: {
          search,
        },
      }),
    }),
  }),
})

export const { useLazyNearestCitiesQuery, useLazySearchCitiesQuery } = cityApi
