"use client"

import { type PropsWithChildren } from "react"
import { Stack } from "@mui/material"

import Sidebar from "./Sidebar"

export default function Layout({ children }: PropsWithChildren) {
  return (
    <Stack direction="row">
      <Sidebar />

      {children}
    </Stack>
  )
}
