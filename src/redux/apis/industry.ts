import { createApi } from "@reduxjs/toolkit/query/react"

import { IIndustry } from "@/types/industry.types"

import { fetchAuthQuery } from "../fetch-auth-query"

export const industryApi = createApi({
  reducerPath: "industryApi",
  baseQuery: fetchAuthQuery({ baseUrl: "/industries" }),
  endpoints: (builder) => ({
    getIndustries: builder.query<IIndustry[], void>({
      query: () => ({
        url: "",
        method: "GET",
      }),
    }),
  }),
})

export const { useGetIndustriesQuery } = industryApi
