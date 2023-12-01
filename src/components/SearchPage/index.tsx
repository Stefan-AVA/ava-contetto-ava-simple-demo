"use client"

import { useEffect, useState } from "react"
import {
  useLazyNearestCitiesQuery,
  useLazySearchCitiesQuery,
} from "@/redux/apis/city"
import { useLazySearchQuery } from "@/redux/apis/search"
import {
  Autocomplete,
  Box,
  CircularProgress,
  Unstable_Grid2 as Grid,
  InputAdornment,
  Stack,
  TextField,
  Typography,
} from "@mui/material"
import { Search as SearchIcon } from "lucide-react"
import { useSnackbar } from "notistack"

import { ICity } from "@/types/city.types"
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
  const [city, setCity] = useState<ICity | null>(null)
  const [range, setRange] = useState("10") // kilometers
  const [search, setSearch] = useState("")
  const [cities, setCities] = useState<ICity[]>([])
  const [searchCityInput, setSearchCityInput] = useState("")

  const { enqueueSnackbar } = useSnackbar()

  const { location } = useGetCurrentPosition()

  const [searchCities, { isFetching: isLoadingSearchCities }] =
    useLazySearchCitiesQuery()
  const [searchListings, { data, isLoading, isFetching }] = useLazySearchQuery()
  const [getNearestCities, { isFetching: isLoadingGetNearestCities }] =
    useLazyNearestCitiesQuery()

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

  const onSearch = async () => {
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

    if (search && orgId) {
      searchListings({
        orgId,
        search: search || "",
        cityId: city._id,
        range,
        contactId,
      })
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
          }}
        >
          <Typography
            sx={{
              py: { xs: 2, lg: 0 },
              pr: { xs: 4, lg: 0 },
              pl: 4,
              color: "blue.800",
              width: "100%",
              height: "auto",
              border: "none",
              outline: "none",
              fontWeight: 500,
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

          <Stack
            sx={{
              py: { xs: 2, lg: 1 },
              pr: 3,
              pl: 2,
              ml: 2,
              gap: 2,
              alignItems: "center",
              borderLeft: {
                xs: "none",
                lg: "1px solid rgb(166 166 166 / 0.2)",
              },
              flexDirection: "row",
            }}
          >
            <Autocomplete
              sx={{ width: { xs: "8rem", sm: "10.75rem" } }}
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
              noOptionsText="No Cities"
              selectOnFocus
              getOptionLabel={(option) => option.city}
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
                    component={SearchIcon}
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
