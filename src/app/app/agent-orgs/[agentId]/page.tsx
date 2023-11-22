"use client"

import { useMemo, useState } from "react"
import { Route } from "next"
import Image from "next/image"
import Link from "next/link"
import { useLazySearchQuery } from "@/redux/apis/search"
import { RootState } from "@/redux/store"
import formatMoney from "@/utils/format-money"
import {
  Box,
  CircularProgress,
  Unstable_Grid2 as Grid,
  Stack,
  Typography,
} from "@mui/material"
import { Bath, BedDouble, Search, Send, Table2 } from "lucide-react"
import { useSelector } from "react-redux"

import SearchFrom from "./SearchFrom"

type PageProps = {
  params: {
    agentId: string
  }
}

const Page = ({ params }: PageProps) => {
  const { agentId } = params

  const [search, setSearch] = useState("")

  const agentOrgs = useSelector((state: RootState) => state.app.agentOrgs)
  const org = useMemo(
    () => agentOrgs.find((agent) => agent._id === agentId)?.org,
    [agentId, agentOrgs]
  )

  const [
    searchListings,
    { data, isLoading: isSearchLoading, isFetching: isSearchFetching },
  ] = useLazySearchQuery()

  const onSearch = () => {
    if (search && org) {
      searchListings({ orgId: org._id, search: search || "" })
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
            <Search size={20} />
          </Box>

          <Typography
            sx={{
              color: "blue.800",
              width: "100%",
              height: "auto",
              outline: "none",
              fontWeight: 500,
              backgroundColor: "transparent",

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
              {(isSearchLoading || isSearchFetching) && (
                <CircularProgress size="1.25rem" />
              )}

              {!(isSearchLoading || isSearchFetching) && (
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

            <SearchFrom />
          </Stack>
        </Stack>
      </Stack>

      {data && (
        <Grid sx={{ mt: { xs: 8, md: 14 } }} container spacing={4}>
          {data.properties.map(
            ({
              _id,
              Media,
              ListPrice,
              ClosePrice,
              BedroomsTotal,
              UnparsedAddress,
              BathroomsTotalInteger,
              VIVA_AdditionalRentSqFt,
            }) => {
              const findMedia = Media.find(({ MediaURL }) => MediaURL)

              return (
                <Grid xs={12} sm={6} md={4} xl={3} key={_id}>
                  <Stack
                    sx={{
                      border: "1px solid",
                      borderColor: "gray.300",
                      borderRadius: ".75rem",
                    }}
                    href={`/app/properties/${_id}` as Route}
                    component={Link}
                  >
                    {findMedia && (
                      <Image
                        src={findMedia.MediaURL}
                        alt=""
                        style={{
                          width: "100%",
                          height: "15rem",
                          objectFit: "cover",
                          borderTopLeftRadius: ".75rem",
                          borderTopRightRadius: ".75rem",
                        }}
                        width={276}
                        height={166}
                      />
                    )}

                    <Stack sx={{ p: 1.5 }}>
                      <Typography
                        sx={{ color: "blue.800", fontWeight: 500 }}
                        variant="h5"
                      >
                        {formatMoney(ListPrice || ClosePrice)}
                      </Typography>

                      <Stack
                        sx={{
                          mt: 1,
                          mb: 2,
                          gap: 3,
                          alignItems: "center",
                          flexDirection: "row",
                        }}
                      >
                        {BedroomsTotal > 0 && (
                          <Typography
                            sx={{
                              gap: 0.5,
                              color: "gray.500",
                              display: "flex",
                              alignItems: "center",
                            }}
                            variant="caption"
                            component="span"
                          >
                            <BedDouble size={16} />
                            {`${BedroomsTotal} Beds`}
                          </Typography>
                        )}

                        {BathroomsTotalInteger > 0 && (
                          <Typography
                            sx={{
                              gap: 0.5,
                              color: "gray.500",
                              display: "flex",
                              alignItems: "center",
                            }}
                            variant="caption"
                            component="span"
                          >
                            <Bath size={16} />
                            {`${BathroomsTotalInteger} Baths`}
                          </Typography>
                        )}

                        {VIVA_AdditionalRentSqFt && (
                          <Typography
                            sx={{
                              gap: 0.5,
                              color: "gray.500",
                              display: "flex",
                              alignItems: "center",
                            }}
                            variant="caption"
                            component="span"
                          >
                            <Table2 size={16} />
                            {`${VIVA_AdditionalRentSqFt} sq ft`}
                          </Typography>
                        )}
                      </Stack>

                      <Typography sx={{ color: "blue.800" }} variant="body2">
                        {UnparsedAddress}
                      </Typography>
                    </Stack>

                    <Typography
                      sx={{
                        p: 1.5,
                        color: "blue.500",
                        width: "100%",
                        display: "flex",
                        borderTop: "1px solid",
                        alignItems: "center",
                        justifyContent: "center",
                        borderTopColor: "gray.300",
                      }}
                    >
                      View Listing
                    </Typography>
                  </Stack>
                </Grid>
              )
            }
          )}
        </Grid>
      )}
    </Stack>
  )
}

export default Page
