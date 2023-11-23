"use client"

import { Route } from "next"
import Link from "next/link"
import { useGetSearchResultsQuery } from "@/redux/apis/search"
import { getDatefromUnix } from "@/utils/format-date"
import { Stack, Typography } from "@mui/material"
import { Folder } from "lucide-react"

import Loading from "../Loading"

interface IProps {
  orgId: string
  agentId?: string
  contactId?: string
}

const SearchResultsPage = ({ orgId, agentId, contactId }: IProps) => {
  const { data: results = [], isLoading } = useGetSearchResultsQuery(
    { orgId, contactId },
    { skip: !orgId }
  )

  return (
    <Stack>
      <Typography variant="h4" fontSize={28}>
        My Searches
      </Typography>
      {isLoading ? (
        <Loading />
      ) : (
        <Stack spacing={2} py={3} px={{ xs: 0, md: 5 }}>
          {results.map(
            ({ _id, searchName, timestamp, rejects, shortlists }) => (
              <Stack
                key={_id}
                width="100%"
                direction="row"
                alignItems="center"
                justifyContent="space-between"
                href={
                  (agentId
                    ? `/app/agent-orgs/${agentId}/search-results/${_id}`
                    : `/app/contact-orgs/${contactId}/search-results/${_id}`) as Route
                }
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
            )
          )}
        </Stack>
      )}
    </Stack>
  )
}

export default SearchResultsPage
