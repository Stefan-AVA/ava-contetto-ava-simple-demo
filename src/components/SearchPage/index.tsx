"use client"

import { useState } from "react"
import { useLazySearchQuery } from "@/redux/apis/search"
import {
  Box,
  CircularProgress,
  Unstable_Grid2 as Grid,
  Stack,
  Typography,
} from "@mui/material"
import { Search as SearchIcon, Send } from "lucide-react"

import Property from "./Property"
import SearchForm from "./SearchForm"

interface ISearch {
  orgId: string
  agentId?: string
  contactId?: string
}

const SearchPage = ({ orgId, agentId, contactId }: ISearch) => {
  const [search, setSearch] = useState("")

  const [searchListings, { data, isLoading, isFetching }] = useLazySearchQuery()

  const onSearch = () => {
    if (search && orgId) {
      searchListings({ orgId, search: search || "", contactId })
    }
  }

  return (
    <Stack>
      <Stack
        sx={{
          mx: "auto",
          gap: 4.5,
          width: "100%",
          maxWidth: "48rem",
        }}
      >
        <Typography
          sx={{ color: "blue.800", fontWeight: 500 }}
          variant="h3"
          component="h1"
        >
          {"Let's start exploring"}
        </Typography>

        <Stack
          sx={{
            py: 2,
            color: "blue.300",
            width: "100%",
            bgcolor: "gray.200",
            borderRadius: "999px",
            flexDirection: "row",
          }}
        >
          <Box
            sx={{
              py: 1,
              pl: 2.5,
              mr: 1.5,
              color: "blue.800",
            }}
          >
            <SearchIcon size={20} />
          </Box>

          <Typography
            sx={{
              color: "blue.800",
              width: "100%",
              height: "auto",
              outline: "none",
              fontWeight: 500,
              backgroundColor: "transparent",
              border: "none",

              "::placeholder": {
                color: "blue.300",
              },
            }}
            name="search"
            variant="body2"
            component="input"
            placeholder="Type in your search criteria"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            // defaultValue={searchParams.search}
          />

          <Stack
            sx={{
              py: 1,
              pr: 3,
              pl: 2,
              ml: 2,
              gap: 2,
              alignItems: "center",
              borderLeft: "1px solid rgb(166 166 166 / 0.2)",
              flexDirection: "row",
            }}
          >
            <Stack alignItems="center">
              {(isLoading || isFetching) && <CircularProgress size="1.25rem" />}

              {!(isLoading || isFetching) && (
                <button onClick={onSearch}>
                  <Box
                    sx={{
                      color: "cyan.500",
                      transition: "all .3s ease-in-out",

                      ":hover": {
                        color: "cyan.600",
                      },
                    }}
                    size={20}
                    component={Send}
                  />
                </button>
              )}
            </Stack>

            <SearchForm
              orgId={orgId}
              agentId={agentId}
              contactId={contactId}
              searchResult={data?.searchResult}
            />
          </Stack>
        </Stack>
      </Stack>

      {data && (
        <Grid sx={{ mt: 3 }} container spacing={4}>
          {data.properties.map((property) => (
            <Property
              key={property._id}
              {...property}
              orgId={orgId}
              agentId={agentId}
              contactId={contactId}
              searchResult={data.searchResult}
            />
          ))}
        </Grid>
      )}
    </Stack>
  )
}

export default SearchPage
