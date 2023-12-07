"use client"

import React, { FormEvent, useEffect, useState } from "react"
import {
  useLazyNearestCitiesQuery,
  useLazySearchCitiesQuery,
} from "@/redux/apis/city"
import {
  useLazyGetSearchResultQuery,
  useLazySearchQuery,
} from "@/redux/apis/search"
import { parseError } from "@/utils/error"
import {
  Autocomplete,
  Box,
  CircularProgress,
  Unstable_Grid2 as Grid,
  InputAdornment,
  ListItem,
  ListItemText,
  Pagination,
  PaginationItem,
  Stack,
  TextField,
  Typography,
} from "@mui/material"
import { Frown, Search as SearchIcon } from "lucide-react"
import { useSnackbar } from "notistack"

import { ICity } from "@/types/city.types"
import { IListing } from "@/types/listing.types"
import { ISearchResult } from "@/types/searchResult.types"
import useDebounce from "@/hooks/use-debounce"
import useGetCurrentPosition from "@/hooks/use-get-current-position"

import Property from "./Property"
import SearchForm from "./SearchForm"

interface ISearch {
  orgId: string
  agentId?: string
  contactId?: string
}

const SearchPage = ({ orgId, agentId, contactId }: ISearch) => {
  const [search, setSearch] = useState("")

  const [city, setCity] = useState<ICity | null>(null)
  const [range, setRange] = useState("10") // kilometers
  const [cities, setCities] = useState<ICity[]>([])
  const [searchCityInput, setSearchCityInput] = useState("")

  const [properties, setProperties] = useState<IListing[]>([])
  const [searchResult, setSearchResult] = useState<ISearchResult | undefined>(
    undefined
  )
  const [page, setPage] = useState(1)
  const [pageCount, setPageCount] = useState(0)

  const { enqueueSnackbar } = useSnackbar()

  const { location } = useGetCurrentPosition()

  const [searchCities, { isFetching: isLoadingSearchCities }] =
    useLazySearchCitiesQuery()
  const [getNearestCities, { isFetching: isLoadingGetNearestCities }] =
    useLazyNearestCitiesQuery()

  const [searchListings, { isLoading, isFetching }] = useLazySearchQuery()
  const [
    getResult,
    { isLoading: isSearchResultsLoading, isFetching: isSearchResultFetching },
  ] = useLazyGetSearchResultQuery()

  const debouncedSearchCity = useDebounce(searchCityInput)

  useEffect(() => {
    if (debouncedSearchCity) {
      const fetchSearchCities = async () => {
        const cities = await searchCities({
          search: debouncedSearchCity,
        }).unwrap()

        setCities(cities)
      }

      fetchSearchCities()
    }
  }, [searchCities, debouncedSearchCity])

  useEffect(() => {
    if (location) {
      const fetchCitiesByLocation = async () => {
        const cities = await getNearestCities({
          lat: location.lat,
          lng: location.lng,
        }).unwrap()

        setCity(cities[0])
        setCities(cities)
      }

      fetchCitiesByLocation()
    }
  }, [location, getNearestCities])

  const onSearch = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    if (!city) {
      enqueueSnackbar("Select the city you want to search", {
        variant: "error",
      })

      return
    }

    if (!Number(range)) {
      enqueueSnackbar("Enter the search radius", { variant: "error" })

      return
    }

    if (orgId) {
      try {
        const data = await searchListings({
          orgId,
          search: search || "",
          cityId: city._id,
          range,
          contactId,
        }).unwrap()

        setProperties(data.properties)
        setSearchResult(data.searchResult)
        setPageCount(Math.ceil(data.total / 12))
      } catch (error) {
        enqueueSnackbar(parseError(error), { variant: "error" })
      }
    }
  }

  const handlePageChange = async (
    _: React.ChangeEvent<unknown>,
    value: number
  ) => {
    setPage(value)
    if (searchResult) {
      const data = await getResult({
        orgId,
        searchId: searchResult?._id,
        page: value - 1,
      }).unwrap()

      setProperties(data.properties)
      setPageCount(Math.ceil(data.total / 12))
    }
  }

  return (
    <Stack>
      <Stack
        sx={{
          mx: "auto",
          gap: 4.5,
          width: "100%",
          maxWidth: "56rem",
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
            borderRadius: { xs: "1rem", lg: "999px" },
            flexDirection: { xs: "column", lg: "row" },
            alignItems: { xs: "none", lg: "center" },
          }}
          onSubmit={onSearch}
          component="form"
        >
          <Box
            sx={{
              py: { xs: 2, lg: 0 },
              pr: { xs: 2, lg: 0 },
              pl: { xs: 2, lg: 4 },
              width: "100%",
              height: "100%",
            }}
          >
            <Typography
              sx={{
                color: "blue.800",
                height: "auto",
                border: "none",
                outline: "none",
                fontWeight: 500,
                width: "100%",
                backgroundColor: "transparent",

                "::placeholder": {
                  color: "blue.300",
                },
              }}
              name="search"
              value={search}
              variant="body2"
              onChange={(e) => setSearch(e.target.value)}
              component="input"
              placeholder="Type in your search criteria"
              // defaultValue={searchParams.search}
            />
          </Box>

          <Stack
            sx={{
              py: { xs: 2, md: 1 },
              pr: { xs: 2, md: 3 },
              pl: { xs: 2, md: 2 },
              ml: { xs: 0, md: 2 },
              gap: { xs: 1, md: 2 },
              alignItems: "center",
              borderLeft: {
                xs: "none",
                lg: "1px solid rgb(166 166 166 / 0.2)",
              },
              flexDirection: "row",
            }}
          >
            <Autocomplete
              sx={{ width: { xs: "100%", sm: "14rem" } }}
              value={city}
              loading={isLoadingGetNearestCities}
              options={cities}
              onChange={(_, newValue) => setCity(newValue)}
              fullWidth
              clearOnBlur
              renderInput={(params) => (
                <TextField
                  {...params}
                  size="small"
                  label="City"
                  onChange={({ target }) => setSearchCityInput(target.value)}
                  InputProps={{
                    ...params.InputProps,
                    endAdornment: (
                      <InputAdornment position="end">
                        {isLoadingSearchCities || isLoadingGetNearestCities ? (
                          <CircularProgress size="1.25rem" />
                        ) : null}

                        {params.InputProps.endAdornment}
                      </InputAdornment>
                    ),
                  }}
                />
              )}
              noOptionsText={
                isLoadingSearchCities || isLoadingGetNearestCities ? (
                  <CircularProgress size="1.25rem" />
                ) : (
                  "No Cities"
                )
              }
              selectOnFocus
              getOptionLabel={(option) =>
                `${option.city}, ${option.admin_name}`
              }
              renderOption={({ key, ...props }: any, option) => (
                <ListItem key={option._id} {...props}>
                  <ListItemText>{`${option.city}, ${option.admin_name}`}</ListItemText>
                </ListItem>
              )}
              isOptionEqualToValue={(option, value) => option._id === value._id}
            />

            <TextField
              sx={{ width: "5.5rem" }}
              size="small"
              label="KM Radius"
              value={range}
              onChange={({ target }) => setRange(target.value)}
              InputProps={{ type: "number" }}
            />

            <Stack sx={{ ml: { xs: "auto", lg: 0 }, alignItems: "center" }}>
              {(isLoading || isFetching) && <CircularProgress size="1.25rem" />}

              {!(isLoading || isFetching) && (
                <button type="submit">
                  <Box
                    sx={{
                      color: "primary.main",
                      transition: "all .3s ease-in-out",

                      ":hover": {
                        color: "primary.dark",
                      },
                    }}
                    size={20}
                    component={SearchIcon}
                  />
                </button>
              )}
            </Stack>

            <SearchForm
              orgId={orgId}
              agentId={agentId}
              contactId={contactId}
              searchResult={searchResult}
            />
          </Stack>
        </Stack>
      </Stack>

      {properties && properties.length <= 0 && (
        <Stack
          sx={{
            px: 3,
            mt: 10,
            mb: 3,
            mx: "auto",
            gap: 3,
            maxWidth: "22rem",
            alignItems: "center",
          }}
        >
          <Box sx={{ color: "secondary.main" }} size={40} component={Frown} />
          <Typography sx={{ color: "gray.600", textAlign: "center" }}>
            {
              "Sorry, we couldn't find any properties with these specifications. Try increasing the search radius"
            }
          </Typography>
        </Stack>
      )}

      {properties && properties.length > 0 && (
        <>
          <Grid sx={{ mt: 3 }} container spacing={4}>
            {properties.map((property) => (
              <Grid xs={12} sm={6} md={4} xl={3} key={property._id}>
                <Property
                  {...property}
                  orgId={orgId}
                  agentId={agentId}
                  contactId={contactId}
                  searchResult={searchResult}
                />
              </Grid>
            ))}
          </Grid>

          {pageCount ? (
            <Stack sx={{ my: 3, width: "100%", alignItems: "center" }}>
              <Pagination
                count={pageCount}
                page={page}
                onChange={handlePageChange}
                renderItem={(item) =>
                  item.selected &&
                  (isSearchResultsLoading || isSearchResultFetching) ? (
                    <CircularProgress size="0.8rem" sx={{ mx: 2 }} />
                  ) : (
                    <PaginationItem {...item} />
                  )
                }
              />
            </Stack>
          ) : null}
        </>
      )}
    </Stack>
  )
}

export default SearchPage
