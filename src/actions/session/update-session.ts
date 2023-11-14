"use server"

import { cookies } from "next/headers"
import secrets from "@/constants/secrets"

import { IUser } from "@/types/user.types"

import getSession from "./get-session"

export default async function updateSession(props: Partial<IUser>) {
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
