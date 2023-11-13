import { createApi } from "@reduxjs/toolkit/query/react"

import { IUser } from "@/types/user"
import { LoginFormSchema } from "@/app/page"
import { SingupFormSchema } from "@/app/signup/page"

import { fetchAuthQuery } from "../fetchAuthQuery"

export interface IBaseResponse {
  msg: string
}

interface IConfirmEmailRequest {
  username: string
  email: string
  verificationCode: string
  orgNeeded: boolean
}

export const authApi = createApi({
  reducerPath: "authApi",
  baseQuery: fetchAuthQuery({ baseUrl: "/auth" }),
  endpoints: (builder) => ({
    signup: builder.mutation<IBaseResponse, SingupFormSchema>({
      query: (data) => ({
        url: "/signup",
        method: "POST",
        body: data,
      }),
    }),
    confirmEmail: builder.mutation<IBaseResponse, IConfirmEmailRequest>({
      query: (data) => ({
        url: "/confirm-email",
        method: "POST",
        body: data,
      }),
    }),
    login: builder.mutation<IBaseResponse, LoginFormSchema>({
      query: (data) => ({
        url: "/login",
        method: "POST",
        body: data,
      }),
    }),
    getMe: builder.query<IUser, void>({
      query: () => ({
        url: "/me",
        method: "GET",
      }),
    }),
  }),
})

export const {
  useSignupMutation,
  useConfirmEmailMutation,
  useLoginMutation,
  useGetMeQuery,
} = authApi
