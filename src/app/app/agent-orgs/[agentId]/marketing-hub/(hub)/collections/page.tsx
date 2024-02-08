"use client"

import { useMemo } from "react"
import { useGetTemplatesQuery } from "@/redux/apis/templates"
import { RootState } from "@/redux/store"
import { Stack, Typography } from "@mui/material"
import { useSelector } from "react-redux"

import Loading from "@/components/Loading"

interface PageProps {
  params: {
    agentId: string
  }
}

export default function Collections({ params }: PageProps) {
  const agentOrgs = useSelector((state: RootState) => state.app.agentOrgs)

  const currentOrg = useMemo(
    () => agentOrgs.find((agent) => agent._id === params.agentId)!,
    [params.agentId, agentOrgs]
  )

  const { data, isLoading } = useGetTemplatesQuery(
    {
      orgId: currentOrg.orgId,
    },
    {
      skip: !currentOrg,
    }
  )

  console.log({ data })

  if (isLoading) return <Loading />

  return (
    <Stack>
      <Typography>Collections</Typography>
    </Stack>
  )
}
