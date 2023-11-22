"use client"

import { useEffect } from "react"
import { Route } from "next"
import Image from "next/image"
import Link from "next/link"
import { useLazySearchQuery } from "@/redux/apis/search"
import formatMoney from "@/utils/format-money"
import {
  Box,
  CircularProgress,
  Unstable_Grid2 as Grid,
  Stack,
  Typography,
} from "@mui/material"
import { Bath, BedDouble, Search, Send, Table2 } from "lucide-react"

import BottomBar from "./bottom-bar"
import Sidebar from "./sidebar"

type PageProps = {
  params: {
    id: string
  }
  searchParams: {
    search: string
  }
}

export default function Page({ params, searchParams }: PageProps) {
  const { search } = searchParams

  const [searchListings, { data, isLoading, isFetching }] = useLazySearchQuery()

  useEffect(() => {
    if (search) searchListings({ orgId: "", search: search || "" })
  }, [search, searchListings])

  return (
    <Stack sx={{ flexDirection: "row" }}>
      {/* <Sidebar orgId={params.id} /> */}

      <Stack sx={{ pb: { xs: 11, md: 0 }, flexGrow: 1 }}>
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
            variant="h2"
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
            component="form"
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
              defaultValue={searchParams.search}
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
              {(isLoading || isFetching) && <CircularProgress size="1.25rem" />}

              {!(isFetching || isLoading) && (
                <button type="submit">
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

        {/* <BottomBar orgId={params.id} /> */}
      </Stack>
    </Stack>
  )
}
