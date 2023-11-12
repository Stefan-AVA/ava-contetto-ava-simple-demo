"use server"

import { cookies } from "next/headers"
import secrets from "@/constants/secrets"

import type { User } from "@/types/user"

type SetSession = {
  user: User
  accessToken: string
}

export default async function setSession(data: SetSession) {
  const cookie = cookies()

  cookie.set(secrets.session, JSON.stringify(data), {
    maxAge: 60 * 60 * 24,
  })

  return data
}
