"use server"

import { cookies } from "next/headers"
import secrets from "@/constants/secrets"

export default async function deleteSession() {
  const cookie = cookies()

  cookie.delete(secrets.session)
}
