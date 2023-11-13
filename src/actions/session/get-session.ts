"use server"

import { cookies } from "next/headers"
import secrets from "@/constants/secrets"

import { IUser } from "@/types/user"

export type GetSession = {
  user: IUser
  accessToken: string
}

export default async function getSession() {
  const cookie = cookies()

  const session = cookie.get(secrets.session)

  return session?.value ? (JSON.parse(session.value) as GetSession) : null
}
