"use client"

import { Route } from "next"
import Link from "next/link"
import { useGetSearchResultsQuery } from "@/redux/apis/search"
import { getDatefromUnix } from "@/utils/format-date"
import { LoadingButton } from "@mui/lab"
import { Stack, Typography } from "@mui/material"
import { Folder } from "lucide-react"

import ContactSearch from "../ContactSearch"
import Loading from "../Loading"
import SearchResultItem from "./ResultItem"

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
          {results.map((result) => (
            <SearchResultItem
              key={result._id}
              orgId={orgId}
              agentId={agentId}
              contactId={contactId}
              result={result}
            />
          ))}
        </Stack>
      )}
    </Stack>
  )
}

export default SearchResultsPage
