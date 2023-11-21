"use client"

import { type PropsWithChildren } from "react"
import { useParams, useRouter } from "next/navigation"
import { Stack } from "@mui/material"

import Sidebar from "./Sidebar"

export default function Layout({ children }: PropsWithChildren) {
  const { contactId } = useParams()
  const { push } = useRouter()

  return (
    <Stack direction="row">
      <Sidebar />
      <Stack>{children}</Stack>
    </Stack>
  )
}
