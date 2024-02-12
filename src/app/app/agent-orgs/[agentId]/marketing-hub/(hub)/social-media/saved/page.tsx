"use client"

import { useMemo } from "react"
import { useGetOrgTemplatesQuery } from "@/redux/apis/templates"
import { RootState } from "@/redux/store"
import { Stack, Typography } from "@mui/material"
import { useSelector } from "react-redux"

import Loading from "@/components/Loading"

interface PageProps {
  params: {
    agentId: string
  }
}

export default function Saved({ params }: PageProps) {
  const agentOrgs = useSelector((state: RootState) => state.app.agentOrgs)

  const currentOrg = useMemo(
    () => agentOrgs.find((agent) => agent._id === params.agentId)!,
    [params.agentId, agentOrgs]
  )

  const { data } = useGetOrgTemplatesQuery(
    {
      orgId: currentOrg.orgId,
    },
    {
      skip: !currentOrg,
    }
  )

  console.log({ data })

  if (!data) return <Loading />

  return (
    <Stack>
      {data.length <= 0 && (
        <Stack
          sx={{
            px: 3,
            my: 5,
            mx: "auto",
            gap: 2,
            maxWidth: "22rem",
            alignItems: "center",
          }}
        >
          <Typography
            sx={{
              color: "gray.600",
              textAlign: "center",
            }}
          >
            There are no templates saved yet.
          </Typography>
        </Stack>
      )}
    </Stack>
  )
}
