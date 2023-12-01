"use client"

import { useMemo, useState } from "react"
import { Route } from "next"
import Link from "next/link"
import { useShareSearchResultMutation } from "@/redux/apis/search"
import { getDatefromUnix } from "@/utils/format-date"
import { LoadingButton } from "@mui/lab"
import { Stack, Typography } from "@mui/material"
import { Folder, User } from "lucide-react"

import { IContact } from "@/types/contact.types"
import { ISearchResult } from "@/types/searchResult.types"

import ContactSearch from "../ContactSearch"

interface IProps {
  orgId: string
  agentId?: string
  contactId?: string
  result: ISearchResult
}

const SearchResultItem = ({ orgId, agentId, contactId, result }: IProps) => {
  const [searchResult, setSearchResult] = useState<ISearchResult>(result)

  const [shareSearch, { isLoading: isSharing }] = useShareSearchResultMutation()

  const savedFor = useMemo(() => {
    if (searchResult) {
      // agent dashboard
      if (agentId) {
        if (!searchResult.contactId) return "For you"
        else if (searchResult.contact)
          return searchResult.contact.username || searchResult.contact.name
        else return ""
      }

      // contact dashboard
      if (contactId) {
        return "For you"
      }
    }

    return ""
  }, [searchResult, agentId, contactId])

  const onShareSearchResult = async (contact: IContact) => {
    try {
      const searchResult = await shareSearch({
        orgId,
        searchId: result._id,
        contactId: contact._id,
      }).unwrap()
      setSearchResult(searchResult)
    } catch (error) {
      console.log("onShare error ===>", error)
    }
  }

  return (
    <Stack
      width="100%"
      direction="row"
      alignItems="center"
      justifyContent="space-between"
      component={Link}
      href={
        (agentId
          ? `/app/agent-orgs/${agentId}/search-results/${result._id}`
          : `/app/contact-orgs/${contactId}/search-results/${result._id}`) as Route
      }
    >
      <Stack direction="row" alignItems="center" spacing={3}>
        <Folder />
        <Stack>
          <Typography
            variant="h5"
            sx={{
              width: { xs: 150, md: 300 },
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
            }}
          >
            {result.searchName}
          </Typography>
          <Stack direction="row" spacing={2}>
            <Typography variant="body2">{`Shortlisted:  ${result.shortlists.length}`}</Typography>
            <Typography variant="body2">{`Rejected:  ${result.rejects.length}`}</Typography>
          </Stack>
        </Stack>
      </Stack>
      <Stack spacing={1}>
        <Typography variant="body1">Saved For:</Typography>
        <ContactSearch
          orgId={orgId}
          ancher={
            <Stack
              sx={{
                padding: 0,
                height: "unset",
                ":hover": { cursor: "pointer" },
              }}
              direction="row"
              spacing={1}
              alignItems="center"
              loading={isSharing}
              variant="text"
              component={LoadingButton}
            >
              <User size={20} />
              <Typography
                variant="body2"
                sx={{
                  width: 90,
                  overflow: "hidden",
                  whiteSpace: "nowrap",
                  textOverflow: "ellipsis",
                  textAlign: "start",
                }}
              >
                {savedFor}
              </Typography>
            </Stack>
          }
          onContactChanged={onShareSearchResult}
        />
      </Stack>
      <Typography
        variant="body2"
        sx={{ display: { xs: "none", md: "block" } }}
      >{`Created: ${getDatefromUnix(result.timestamp)}`}</Typography>
    </Stack>
  )
}

export default SearchResultItem
