"use client"

import { useEffect, useState, type ChangeEvent, type FormEvent } from "react"
import Image from "next/image"
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
import AvaNotFoundImage from "~/assets/ava-not-found.png"
import { Search as SearchIcon } from "lucide-react"
import { useSnackbar } from "notistack"

import type { ICity } from "@/types/city.types"
import type { IListing } from "@/types/listing.types"
import type { ISearchResult } from "@/types/searchResult.types"
import useDebounce from "@/hooks/use-debounce"
import useGetCurrentPosition from "@/hooks/use-get-current-position"

import AdvancedSearch from "./advanced-search"
import Property from "./Property"
import SearchForm from "./SearchForm"

interface ISearch {
  orgId: string
  agentId?: string
  contactId?: string
}

const initialForm = {
  city: null as ICity | null,
  range: "10",
  search: "",
}

const SearchPage = ({ orgId, agentId, contactId }: ISearch) => {
  const [page, setPage] = useState(1)
  const [pageCount, setPageCount] = useState(0)

  const [form, setForm] = useState(initialForm)
  const [cities, setCities] = useState<ICity[]>([])
  const [advancedModal, setAdvancedModal] = useState(false)
  const [searchCityInput, setSearchCityInput] = useState("")

  const [properties, setProperties] = useState<IListing[]>([])
  const [searchResult, setSearchResult] = useState<ISearchResult | undefined>(
    undefined
  )

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

        setForm((prev) => ({ ...prev, city: cities[0] }))
        setCities(cities)
      }

      fetchCitiesByLocation()
    }
  }, [location, getNearestCities])

  const onSearch = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    if (!form.city) {
      enqueueSnackbar("Select the city you want to search", {
        variant: "error",
      })

      return
    }

    if (!Number(form.range)) {
      enqueueSnackbar("Enter the search radius", { variant: "error" })

      return
    }

    if (orgId) {
      try {
        const data = await searchListings({
          orgId,
          range: form.range,
          search: form.search || "",
          cityId: form.city?._id,
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

  const handlePageChange = async (_: ChangeEvent<unknown>, value: number) => {
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
          width: "100%",
          maxWidth: "56rem",
        }}
      >
        <Typography
          sx={{ mb: 4.5, color: "blue.800", fontWeight: 500 }}
          variant="h3"
          component="h1"
        >
          {"Let's start exploring"}
        </Typography>

        <Stack
          sx={{
            py: 2,
            pr: { xs: 2, lg: 0 },
            pl: { xs: 2, lg: 4 },
            color: "blue.300",
            width: "100%",
            bgcolor: "gray.200",
            alignItems: { xs: "none", lg: "center" },
            borderRadius: { xs: "1rem", lg: "999px" },
            flexDirection: { xs: "column", lg: "row" },
          }}
          onSubmit={onSearch}
          component="form"
        >
          <TextField
            name="search"
            size="small"
            value={form.search}
            label="Type in your search criteria"
            onChange={({ target }) =>
              setForm((prev) => ({ ...prev, search: target.value }))
            }
            fullWidth
          />

          <Stack
            sx={{
              py: { xs: 2, lg: 1 },
              pr: { xs: 2, lg: 3 },
              pl: { xs: 2, lg: 2 },
              ml: { xs: 0, lg: 2 },
              gap: { xs: 1, lg: 2 },
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
              value={form.city}
              loading={isLoadingGetNearestCities}
              options={cities}
              onChange={(_, newValue) =>
                setForm((prev) => ({ ...prev, city: newValue }))
              }
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
              filterOptions={(options) => options}
            />

            <TextField
              sx={{ width: "5.5rem" }}
              size="small"
              label="KM Radius"
              value={form.range}
              onChange={({ target }) =>
                setForm((prev) => ({ ...prev, range: target.value }))
              }
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

        <Typography
          sx={{
            mt: 1.5,
            ml: "auto",
            color: "primary.main",
            fontWeight: 600,
            textDecoration: "underline",
          }}
          variant="body2"
          onClick={() => setAdvancedModal(true)}
          component="button"
        >
          Advanced search
        </Typography>
      </Stack>

      {searchResult && properties.length <= 0 && (
        <Stack
          sx={{
            px: 3,
            mt: 10,
            mb: 3,
            mx: "auto",
            gap: 2,
            maxWidth: "22rem",
            alignItems: "center",
          }}
        >
          <Image
            src={AvaNotFoundImage}
            alt=""
            style={{ objectFit: "contain" }}
          />

          <Typography
            sx={{
              color: "gray.600",
              textAlign: "center",
            }}
          >
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

      <AdvancedSearch open={advancedModal} onClose={setAdvancedModal} />
    </Stack>
  )
}

export default SearchPage
