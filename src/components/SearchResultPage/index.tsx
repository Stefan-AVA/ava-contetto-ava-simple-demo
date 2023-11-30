"use client"

import { useEffect, useMemo, useState } from "react"
import { useRouter } from "next/navigation"
import {
  useGetSearchResultQuery,
  useShareSearchResultMutation,
} from "@/redux/apis/search"
import { getDatefromUnix } from "@/utils/format-date"
import { LoadingButton } from "@mui/lab"
import {
  Unstable_Grid2 as Grid,
  InputAdornment,
  Stack,
  TextField,
  Typography,
} from "@mui/material"
import { Folder, Loader, User } from "lucide-react"

import { IContact } from "@/types/contact.types"
import { ISearchResult } from "@/types/searchResult.types"
import useGetCurrentPosition from "@/hooks/use-get-current-position"

import ContactSearch from "../ContactSearch"
import Loading from "../Loading"
import Property from "../SearchPage/Property"

interface IProps {
  orgId: string
  searchId: string
  agentId?: string
  contactId?: string
}

const SearchResultPage = ({ orgId, searchId, agentId, contactId }: IProps) => {
  const [tab, setTab] = useState(1)
  const [form, setForm] = useState({ km: "", city: "" })
  const [searchResult, setSearchResult] = useState<ISearchResult | undefined>(
    undefined
  )

  const { replace } = useRouter()
  const localization = useGetCurrentPosition()

  const { data, isLoading } = useGetSearchResultQuery(
    { orgId, searchId },
    { skip: !orgId }
  )

  const [shareSearch, { isLoading: isSharing }] = useShareSearchResultMutation()

  useEffect(() => {
    if (localization.data)
      setForm((prev) => ({ ...prev, city: localization.data?.city || "" }))
  }, [localization.data])

  useEffect(() => {
    if (data?.searchResult) {
      setSearchResult(data.searchResult)
      if (!data.searchResult.searchName) {
        replace(`/app/agent-orgs/${agentId}`)
      }
    }
  }, [setSearchResult, data, agentId, replace])

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
      if (contactId) return "For you"
    }

    return ""
  }, [searchResult, agentId, contactId])

  const shortlists = useMemo(() => {
    if (data && searchResult) {
      return data.properties.filter((property) =>
        searchResult.shortlists.includes(property._id)
      )
    }

    return []
  }, [data?.properties, searchResult])

  const rejects = useMemo(() => {
    if (data && searchResult) {
      return data.properties.filter((property) =>
        searchResult.rejects.includes(property._id)
      )
    }

    return []
  }, [data?.properties, searchResult])

  const onShareSearchResult = async (contact: IContact) => {
    try {
      const searchResult = await shareSearch({
        orgId,
        searchId,
        contactId: contact._id,
      }).unwrap()
      setSearchResult(searchResult)
    } catch (error) {
      console.log("onShare error ===>", error)
    }
  }

  return isLoading ? (
    <Loading />
  ) : (
    <Stack alignItems="center">
      <Stack>
        <Typography variant="h4" fontSize={28}>
          {`Saved Search "${searchResult?.searchName}"`}
        </Typography>
        <Stack spacing={2} mt={3}>
          <Stack
            direction={{ xs: "column", md: "row" }}
            spacing={{ xs: 1, md: 4 }}
            alignItems={{ xs: "flex-start", md: "center" }}
          >
            <Stack direction="row" spacing={2} alignItems="center">
              <Typography>Saved Search:</Typography>
              <Stack direction="row" spacing={1} alignItems="center">
                <Folder size={20} />
                <Typography
                  variant="body2"
                  sx={{
                    maxWidth: 180,
                    overflow: "hidden",
                    whiteSpace: "nowrap",
                    textOverflow: "ellipsis",
                  }}
                >
                  {searchResult?.searchName}
                </Typography>
              </Stack>
            </Stack>

            <Stack direction="row" spacing={2} alignItems="center">
              <Typography>Saved For:</Typography>
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
                    <Typography variant="body2">{savedFor}</Typography>
                  </Stack>
                }
                onContactChanged={onShareSearchResult}
              />
            </Stack>

            <Stack
              direction="row"
              spacing={2}
              display={{ xs: "none", md: "flex" }}
            >
              <Typography>Created:</Typography>
              <Typography variant="body2">
                {getDatefromUnix(data?.searchResult.timestamp)}
              </Typography>
            </Stack>
          </Stack>

          <Stack
            direction={{ xs: "column", md: "row" }}
            spacing={{ xs: 1, md: 2 }}
            alignItems={{ xs: "flex-start", md: "center" }}
          >
            <Stack direction="row" spacing={2} alignItems="center">
              <Typography>Localization:</Typography>

              <TextField
                size="small"
                label="City"
                value={form.city}
                onChange={({ target }) =>
                  setForm((prev) => ({ ...prev, city: target.value }))
                }
                InputProps={{
                  endAdornment: localization.loading ? (
                    <InputAdornment position="end">
                      <Loader />
                    </InputAdornment>
                  ) : undefined,
                }}
              />
            </Stack>

            <TextField
              size="small"
              label="KM Radius"
              InputProps={{ type: "number" }}
            />
          </Stack>

          <Stack direction="row" spacing={{ xs: 1, md: 4 }} alignItems="center">
            <Typography sx={{ display: { xs: "none", md: "block" } }}>
              Saved Results:
            </Typography>
            <Typography
              sx={{
                color: tab === 1 ? "blue.900" : "gray.700",
              }}
              onClick={() => setTab(1)}
              component="button"
            >
              All ({data?.properties.length || 0})
            </Typography>
            <Typography
              sx={{
                color: tab === 2 ? "blue.900" : "gray.500",
              }}
              onClick={() => setTab(2)}
              component="button"
            >
              Shortlisted ({shortlists.length})
            </Typography>
            <Typography
              sx={{
                color: tab === 3 ? "blue.900" : "gray.500",
              }}
              onClick={() => setTab(3)}
              component="button"
            >
              Rejected ({rejects.length})
            </Typography>
          </Stack>
        </Stack>
      </Stack>

      {data && tab === 1 && (
        <Grid sx={{ mt: 3, width: "100%" }} container spacing={4}>
          {data.properties.map((property) => (
            <Property
              key={property._id}
              {...property}
              orgId={orgId}
              agentId={agentId}
              contactId={contactId}
              searchResult={searchResult}
              setSearchResult={setSearchResult}
            />
          ))}
        </Grid>
      )}

      {data && tab === 2 && (
        <Grid sx={{ mt: 3, width: "100%" }} container spacing={4}>
          {shortlists.map((property) => (
            <Property
              key={property._id}
              {...property}
              orgId={orgId}
              agentId={agentId}
              contactId={contactId}
              searchResult={searchResult}
              setSearchResult={setSearchResult}
            />
          ))}
        </Grid>
      )}

      {data && tab === 3 && (
        <Grid sx={{ mt: 3, width: "100%" }} container spacing={4}>
          {rejects.map((property) => (
            <Property
              key={property._id}
              {...property}
              orgId={orgId}
              agentId={agentId}
              contactId={contactId}
              searchResult={searchResult}
              setSearchResult={setSearchResult}
            />
          ))}
        </Grid>
      )}
    </Stack>
  )
}

export default SearchResultPage
