"use client"

import { useMemo, useState } from "react"
import { useGetSearchResultsByContactQuery } from "@/redux/apis/search"
import { RootState } from "@/redux/store"
import { getDatefromUnix } from "@/utils/format-date"
import { Link, Stack, Typography } from "@mui/material"
import { Folder } from "lucide-react"
import { useSelector } from "react-redux"

import Loading from "@/components/Loading"

interface IPage {
  params: {
    agentId: string
    contact_id: string
  }
}

export default function SavedSearches({ params }: IPage) {
  const agentOrgs = useSelector((state: RootState) => state.app.agentOrgs)

  const agentProfile = useMemo(
    () => agentOrgs.find((agent) => agent._id === params.agentId),
    [params, agentOrgs]
  )

  const { data, isLoading } = useGetSearchResultsByContactQuery(
    {
      orgId: agentProfile?.orgId as string,
      contactId: params.contact_id,
    },
    {
      skip: !agentProfile?.orgId || !params.contact_id,
    }
  )

  return (
    <Stack>
      {isLoading && <Loading />}

      {data && !isLoading && (
        <Stack sx={{ gap: 2 }}>
          {data.map(({ _id, searchName, timestamp, rejects, shortlists }) => (
            <Stack
              sx={{
                pb: 2,
                width: "100%",
                color: "gray.600",
                alignItems: "center",
                borderBotton: "1px solid",
                flexDirection: "row",
                textDecoration: "none",
                justifyContent: "space-between",
                borderBottomColor: "gray.300",
              }}
              key={_id}
              href={`/app/agent-orgs/${params.agentId}/contacts/${params.contact_id}/saved-searches/${_id}`}
              component={Link}
            >
              <Stack direction="row" alignItems="center" spacing={3}>
                <Folder />
                <Stack>
                  <Typography variant="h5">{searchName}</Typography>
                  <Stack direction="row" spacing={2}>
                    <Typography variant="body2">{`Shortlisted:  ${shortlists.length}`}</Typography>
                    <Typography variant="body2">{`Rejected:  ${rejects.length}`}</Typography>
                  </Stack>
                </Stack>
              </Stack>
              <Typography
                variant="body2"
                sx={{ display: { xs: "none", md: "block" } }}
              >{`Created: ${getDatefromUnix(timestamp)}`}</Typography>
            </Stack>
          ))}
        </Stack>
      )}
    </Stack>
  )
}
