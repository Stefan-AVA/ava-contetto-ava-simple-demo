"use client"

import { Stack } from "@mui/material"

type PageProps = {
  params: {
    id: string
  }
}

const Page = ({ params: { id } }: PageProps) => {
  return <Stack sx={{ gap: 5 }}>client org</Stack>
}

export default Page
