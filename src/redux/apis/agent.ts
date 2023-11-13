import { createApi } from "@reduxjs/toolkit/query/react"

import { IContact } from "@/types/contact.types"

import { fetchAuthQuery } from "../fetchAuthQuery"
import { IRequestWithId } from "./org"

export const agentApi = createApi({
  reducerPath: "agentApi",
  baseQuery: fetchAuthQuery({ baseUrl: "/agents" }),
  endpoints: (builder) => ({
    getContacts: builder.query<IContact[], IRequestWithId>({
      query: ({ id }) => ({
        url: `/${id}/contacts`,
        method: "GET",
      }),
    }),
  }),
})

export const { useGetContactsQuery } = agentApi
