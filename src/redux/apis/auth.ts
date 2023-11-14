import { createApi } from "@reduxjs/toolkit/query/react"

import { IUser } from "@/types/user.types"
import { ForgotPasswordFormSchema } from "@/app/forgot-password/page"
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

interface IForgotPasswordConfirmRequest {
  email: string
  verificationCode: string
  password: string
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
    forgotPassword: builder.mutation<IBaseResponse, ForgotPasswordFormSchema>({
      query: (data) => ({
        url: "/forgot-password",
        method: "POST",
        body: data,
      }),
    }),
    forgotPasswordConfirm: builder.mutation<
      IBaseResponse,
      IForgotPasswordConfirmRequest
    >({
      query: (data) => ({
        url: "/forgot-password-confirm",
        method: "POST",
        body: data,
      }),
    }),
  }),
})

export const {
  useSignupMutation,
  useConfirmEmailMutation,
  useLoginMutation,
  useGetMeQuery,
  useLazyGetMeQuery,
  useForgotPasswordMutation,
  useForgotPasswordConfirmMutation,
} = authApi
