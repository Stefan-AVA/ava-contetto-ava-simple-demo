"use client"

import { useMemo, type PropsWithChildren } from "react"
import { useParams } from "next/navigation"
import { useGetContactQuery } from "@/redux/apis/org"
import { RootState } from "@/redux/store"
import { Stack, Typography } from "@mui/material"
import { useSelector } from "react-redux"

import Loading from "@/components/Loading"

export default function ContactLayout({ children }: PropsWithChildren) {
  const { agentId, contactId } = useParams()

  const agentOrgs = useSelector((state: RootState) => state.app.agentOrgs)

  const agentProfile = useMemo(
    () => agentOrgs.find((agent) => agent._id === agentId),
    [agentId, agentOrgs]
  )

  const { data, isLoading } = useGetContactQuery(
    {
      _id: contactId as string,
      orgId: agentProfile?.orgId,
    },
    {
      skip: !contactId || !agentProfile,
    }
  )

  return (
    <Stack>
      <Typography
        sx={{
          pb: 3,
          mb: 4,
          fontWeight: 700,
          borderBottom: "1px solid",
          borderBottomColor: "gray.300",
        }}
        variant="h4"
      >
        Contact
      </Typography>

      <Stack
        sx={{
          gap: 2.5,
          flexDirection: "row",
        }}
      >
        <Stack
          sx={{
            pt: 6,
            px: 3,
            pb: 3,
            width: "100%",
            border: "1px solid",
            maxWidth: "23.75rem",
            alignItems: "center",
            borderColor: "gray.300",
            borderRadius: ".625rem",
          }}
        >
          {isLoading && <Loading />}
        </Stack>

        <Stack
          sx={{
            width: "100%",
            border: "1px solid",
            borderColor: "gray.300",
            borderRadius: ".625rem",
          }}
        >
          {children}
        </Stack>
      </Stack>
    </Stack>
  )
}
