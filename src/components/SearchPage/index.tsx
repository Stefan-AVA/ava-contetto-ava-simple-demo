"use client"

import { MouseEvent, useEffect, useState, type ChangeEvent } from "react"
import Image from "next/image"
import { useLazySearchCitiesQuery } from "@/redux/apis/city"
import {
  useLazyGetSearchResultQuery,
  useLazySearchQuery,
} from "@/redux/apis/search"
import { parseError } from "@/utils/error"
import { LoadingButton } from "@mui/lab"
import {
  Autocomplete,
  Box,
  Button,
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
import { ChevronRight, Search as SearchIcon } from "lucide-react"
import { useSnackbar } from "notistack"

import type { ICity } from "@/types/city.types"
import type { IListing } from "@/types/listing.types"
import type { ISearchResult } from "@/types/searchResult.types"
import useDebounce from "@/hooks/use-debounce"
import useListCitiesByLocation from "@/hooks/use-list-cities-by-location"

import { TextFieldOperatorValue } from "../text-field-with-operators"
import AdvancedSearch from "./advanced-search"
import Property from "./Property"
import SearchForm from "./SearchForm"

interface ISearch {
  orgId: string
  agentId?: string
  contactId?: string
  searchId?: string
}

export const initialForm = {
  city: null as ICity | null,
  range: "10",
  search: "",
  mls: "",
  keywords: "",
  listedSince: null as Date | null,
  price: [100000, 2000000] as number[],
  sqFt: [0, 10000],
  lotAcres: [0, 50],
  minYearBuilt: null as Date | null,
  maxYearBuilt: null as Date | null,
  rooms: null as TextFieldOperatorValue | null,
  storeys: null as TextFieldOperatorValue | null,
  bathrooms: null as TextFieldOperatorValue | null,
  firePlaces: null as TextFieldOperatorValue | null,
  parkingSpaces: null as TextFieldOperatorValue | null,
  propertyType: [] as string[],
  walkingDistance: [] as string[],
}

const SearchPage = ({ orgId, agentId, contactId, searchId }: ISearch) => {
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

  const [searchCities, { isFetching: isLoadingSearchCities }] =
    useLazySearchCitiesQuery()

  const { cities: nearestCities, isLoading: isLoadingGetNearestCities } =
    useListCitiesByLocation()

  const [searchListings, { isLoading, isFetching }] = useLazySearchQuery()
  const [
    getResult,
    { isLoading: isSearchResultsLoading, isFetching: isSearchResultFetching },
  ] = useLazyGetSearchResultQuery()

  const debouncedSearchCity = useDebounce(searchCityInput)

  const initForm = (searchResult: ISearchResult | undefined) => {
    if (searchResult) {
      setForm({
        search: searchResult.userQueryString,
        city: searchResult.userQueryJson.city,
        range: searchResult.userQueryJson.range,
        mls: searchResult.userQueryJson.mls || "",
        keywords: searchResult.userQueryJson.keywords
          ? searchResult.userQueryJson.keywords.join(", ")
          : "",
        listedSince: searchResult.userQueryJson.listedSince
          ? new Date(searchResult.userQueryJson.listedSince * 1000)
          : null,

        price: searchResult.userQueryJson.price || [100000, 2000000],
        sqFt: searchResult.userQueryJson.sqft || [0, 10000],
        lotAcres: searchResult.userQueryJson.lotAcres || [0, 50],
        minYearBuilt: null,
        maxYearBuilt: null,
        rooms:
          searchResult.userQueryJson.rooms &&
          searchResult.userQueryJson.roomsOperator
            ? {
                value: searchResult.userQueryJson.rooms,
                operator: searchResult.userQueryJson.roomsOperator,
              }
            : null,
        storeys:
          searchResult.userQueryJson.storeys &&
          searchResult.userQueryJson.storeysOperator
            ? {
                value: searchResult.userQueryJson.storeys,
                operator: searchResult.userQueryJson.storeysOperator,
              }
            : null,
        bathrooms:
          searchResult.userQueryJson.bathrooms &&
          searchResult.userQueryJson.bathroomsOperator
            ? {
                value: searchResult.userQueryJson.bathrooms,
                operator: searchResult.userQueryJson.bathroomsOperator,
              }
            : null,
        firePlaces:
          searchResult.userQueryJson.firePlaces &&
          searchResult.userQueryJson.firePlacesOperator
            ? {
                value: searchResult.userQueryJson.firePlaces,
                operator: searchResult.userQueryJson.firePlacesOperator,
              }
            : null,
        parkingSpaces:
          searchResult.userQueryJson.parkingSpaces &&
          searchResult.userQueryJson.parkingSpacesOperator
            ? {
                value: searchResult.userQueryJson.parkingSpaces,
                operator: searchResult.userQueryJson.parkingSpacesOperator,
              }
            : null,
        propertyType: searchResult.userQueryJson.propertyType || [],
        walkingDistance: searchResult.userQueryJson.walkingDistance || [],
      })
    }
  }

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
    if (nearestCities.length > 0)
      setForm((prev) => ({ ...prev, city: nearestCities[0] }))
  }, [nearestCities])

  useEffect(() => {
    if (searchId) {
      const fetchSearchResult = async () => {
        const data = await getResult({
          orgId,
          searchId,
          page: 0,
        }).unwrap()

        setProperties(data.properties)
        setPageCount(Math.ceil(data.total / 12))
        setSearchResult(data.searchResult)
        initForm(data.searchResult)
        setSearchCityInput(data.searchResult.userQueryJson.city.city)
      }

      fetchSearchResult()
    }
  }, [orgId, searchId, getResult])

  const onSearch = async (e: MouseEvent<HTMLButtonElement>) => {
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
        const params = advancedModal
          ? {
              orgId,
              contactId,

              cityId: form.city?._id,
              range: form.range,
              mls: form.mls,
              keywords: form.keywords,
              listedSince: form.listedSince
                ? Math.floor(form.listedSince.getTime() / 1000)
                : undefined,

              price: form.price,
              sqft: form.sqFt,
              lotAcres: form.lotAcres,
              minYearBuilt: form.minYearBuilt
                ? form.minYearBuilt.getFullYear()
                : undefined,
              maxYearBuilt: form.maxYearBuilt
                ? form.maxYearBuilt.getFullYear()
                : undefined,

              rooms: form.rooms ? form.rooms.value : undefined,
              roomsOperator: form.rooms ? form.rooms.operator : undefined,
              bathrooms: form.bathrooms ? form.bathrooms.value : undefined,
              bathroomsOperator: form.bathrooms
                ? form.bathrooms.operator
                : undefined,
              storeys: form.storeys ? form.storeys.value : undefined,
              storeysOperator: form.storeys ? form.storeys.operator : undefined,
              firePlaces: form.firePlaces ? form.firePlaces.value : undefined,
              firePlacesOperator: form.firePlaces
                ? form.firePlaces.operator
                : undefined,
              parkingSpaces: form.parkingSpaces
                ? form.parkingSpaces.value
                : undefined,
              parkingSpacesOperator: form.parkingSpaces
                ? form.parkingSpaces.operator
                : undefined,

              propertyType: form.propertyType,
              walkingDistance: form.walkingDistance,
            }
          : {
              orgId,
              contactId,

              cityId: form.city?._id,
              range: form.range,
              search: form.search,
            }

        const data = await searchListings(params).unwrap()

        setProperties(data.properties)
        setSearchResult(data.searchResult)
        setPageCount(Math.ceil(data.total / 12))

        if (advancedModal) setAdvancedModal(false)
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
              pr: { xs: 0, lg: 3 },
              pl: { xs: 0, lg: 2 },
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
              options={debouncedSearchCity ? cities : nearestCities}
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

            <LoadingButton
              sx={{
                width: "2.5rem",
                height: "2.5rem",
                minWidth: "auto",
                borderRadius: "50%",
              }}
              size="small"
              onClick={onSearch}
              loading={isLoading || isFetching}
            >
              <ChevronRight />
            </LoadingButton>
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
          onClick={() => {
            setAdvancedModal(true)
            initForm(searchResult)
          }}
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
          <SearchForm
            orgId={orgId}
            agentId={agentId}
            contactId={contactId}
            searchResult={searchResult}
          />

          <Grid sx={{ mt: 1 }} container spacing={4}>
            {properties.map((property) => (
              <Grid xs={12} sm={6} md={4} xl={3} key={property._id}>
                <Property
                  {...property}
                  orgId={orgId}
                  agentId={agentId}
                  contactId={contactId}
                  searchResult={searchResult}
                  fromSearch={true}
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

      <AdvancedSearch
        open={advancedModal}
        onClose={() => setAdvancedModal(false)}
        form={form}
        setForm={setForm}
        isLoadingGetNearestCities={isLoadingGetNearestCities}
        nearestCities={nearestCities}
        setSearchCityInput={setSearchCityInput}
        debouncedSearchCity={debouncedSearchCity}
        cities={cities}
        isLoadingSearchCities={isLoadingSearchCities}
        onSearch={onSearch}
        isSearching={isLoading || isFetching}
      />
    </Stack>
  )
}

export default SearchPage
