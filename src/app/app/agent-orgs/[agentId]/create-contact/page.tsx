"use client"

import { useMemo } from "react"
import { RootState } from "@/redux/store"
import { Stack } from "@mui/material"
import { useSelector } from "react-redux"

import CreateContactForm from "@/components/create-contact-form"

type PageProps = {
  params: {
    agentId: string
  }
}

export default function Page({ params }: PageProps) {
  const { agentId } = params

  const agentOrgs = useSelector((state: RootState) => state.app.agentOrgs)

  const agentProfile = useMemo(
    () => agentOrgs.find((agent) => agent._id === agentId),
    [agentId, agentOrgs]
  )

  return (
    <Stack
      sx={{
        mx: "auto",
        width: "100%",
        border: "1px solid",
        maxWidth: "52.5rem",
        borderColor: "gray.300",
        borderRadius: ".75rem",
      }}
    >
      <CreateContactForm orgId={String(agentProfile?.orgId)} withInvite />
    </Stack>
  )
}
