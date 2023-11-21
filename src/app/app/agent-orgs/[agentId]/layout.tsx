"use client"

import { type PropsWithChildren } from "react"
import { useParams, useRouter } from "next/navigation"
import { Stack } from "@mui/material"

import Sidebar from "./Sidebar"

export default function Layout({ children }: PropsWithChildren) {
  const { agentId } = useParams()
  const { push } = useRouter()

  return (
    <Stack
      direction={{ xs: "column", md: "row" }}
      padding={{ xs: 1, md: 0 }}
      spacing={{ xs: 2, md: 0 }}
    >
      <Sidebar />
      <Stack>{children}</Stack>
    </Stack>
  )
}
