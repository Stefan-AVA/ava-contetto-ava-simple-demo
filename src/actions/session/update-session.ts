"use server"

import { cookies } from "next/headers"
import secrets from "@/constants/secrets"

import type { User } from "@/types/user"

import getSession from "./get-session"

export default async function updateSession(props: Partial<User>) {
  const cookie = cookies()

  const currentSession = await getSession()

  if (!currentSession) return

  const data = {
    ...currentSession,
    ...props,
  }

  cookie.set(secrets.session, JSON.stringify(data), {
    maxAge: 60 * 60 * 24,
  })
}
