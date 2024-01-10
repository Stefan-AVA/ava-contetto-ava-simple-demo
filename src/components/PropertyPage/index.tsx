"use client"

import "swiper/css"
import "swiper/css/pagination"

import { useEffect, useMemo, useState } from "react"
import Image from "next/image"
import { useRouter } from "next/navigation"
import {
  useGetPropertyQuery,
  useRejectPropertyMutation,
  useShortlistPropertyMutation,
  useUndoPropertyMutation,
} from "@/redux/apis/search"
import { formatAreaUint } from "@/utils/format-area-unit"
import formatMoney from "@/utils/format-money"
import { LoadingButton } from "@mui/lab"
import {
  Box,
  Button,
  CircularProgress,
  Unstable_Grid2 as Grid,
  Stack,
  Typography,
} from "@mui/material"
import { Bath, BedDouble, MapPin, Table2 } from "lucide-react"
import { Pagination } from "swiper/modules"
import { Swiper, SwiperSlide, type SwiperProps } from "swiper/react"

import type { ISearchResult } from "@/types/searchResult.types"

import ListingDescription from "./listing-description"
import WalkingDistance from "./walking-distance"

const breakpoints: SwiperProps["breakpoints"] = {
  560: {
    slidesPerView: 3,
  },

  768: {
    slidesPerView: 5,
  },
}

interface IProps {
  orgId: string
  agentId?: string
  contactId?: string
  searchId: string
  propertyId: string
  fromSearchPage?: string
}

const PropertyPage = ({
  orgId,
  searchId,
  propertyId,
  agentId,
  contactId,
  fromSearchPage,
}: IProps) => {
  const [searchResult, setSearchResult] = useState<ISearchResult | undefined>(
    undefined
  )

  const { push, back } = useRouter()

  const { data, isLoading } = useGetPropertyQuery(
    { orgId, searchId, propertyId },
    { skip: !orgId }
  )

  const [shortlist, { isLoading: isShortlistLoading }] =
    useShortlistPropertyMutation()
  const [reject, { isLoading: isRejectLoading }] = useRejectPropertyMutation()
  const [undo, { isLoading: isUndoLoading }] = useUndoPropertyMutation()

  const actionLoading = isShortlistLoading || isRejectLoading || isUndoLoading

  useEffect(() => {
    if (data?.searchResult) {
      setSearchResult(data.searchResult)
    }
  }, [data, setSearchResult])

  const media = useMemo(() => {
    if (data) {
      const banner = data.property.photos[0].url
      const images = data.property.photos.slice(1).map(({ url }) => url)

      return {
        banner,
        images,
      }
    }

    return {
      banner: "",
      images: [],
    }
  }, [data])

  const details = useMemo(() => {
    return {
      "Property Type": data ? data.property.PropertyType : "-",
      "Land Size": "-",
      "Building Type": "-",
      "Year Built": data ? data.property.YearBuilt : "-",
      Community: "-",
      "Annual Property Taxes": "-",
      Neighbourhood: "-",
      "Parking Type": "-",
      Title: "-",
      "Time on Market": "-",
    }
  }, [data])

  async function onShortlist() {
    try {
      const result = await shortlist({
        orgId,
        searchId: String(searchResult?._id),
        propertyId,
      }).unwrap()

      setSearchResult(result.searchResult)
    } catch (error) {
      console.log("onShortlist error ===>", error)
    }
  }

  async function onReject() {
    try {
      const result = await reject({
        orgId,
        searchId: String(searchResult?._id),
        propertyId,
      }).unwrap()

      setSearchResult(result.searchResult)
    } catch (error) {
      console.log("onReject error ===>", error)
    }
  }

  async function onUndo() {
    try {
      const result = await undo({
        orgId,
        searchId: String(searchResult?._id),
        propertyId,
      }).unwrap()

      setSearchResult(result.searchResult)
    } catch (error) {
      console.log("onUndo error ===>", error)
    }
  }

  function onBack() {
    if (fromSearchPage) {
      if (agentId) {
        push(`/app/agent-orgs/${agentId}?search_id=${searchId}`)
      } else if (contactId) {
        push(`/app/contact-orgs/${contactId}?search_id=${searchId}`)
      }

      return
    }

    back()
  }

  return (
    <>
      <Stack
        sx={{
          alignItems: "center",
          flexDirection: "row",
          justifyContent: "space-between",
        }}
      >
        <Button
          size="small"
          color="primary"
          onClick={onBack}
          variant="outlined"
        >
          Back to search
        </Button>

        <Box
          sx={{
            position: { xs: "fixed", md: "inherit" },
            bottom: 10,
            left: 0,
            width: { xs: "100%", md: "auto" },
            px: { xs: 2, md: 0 },
          }}
        >
          {searchResult?.searchName &&
            ([...searchResult.shortlists, ...searchResult.rejects].includes(
              propertyId
            ) ? (
              <Stack
                sx={{
                  width: "100%",
                  justifyContent: "center",
                }}
                direction="row"
              >
                <LoadingButton
                  sx={{
                    color: "secondary.main",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    background: "white",
                    border: "1px solid",
                    borderColor: "secondary.main",
                    borderRadius: 2,
                    ":hover": {
                      background: "white",
                      opacity: 0.8,
                    },
                  }}
                  size="small"
                  onClick={onUndo}
                  loading={actionLoading}
                >
                  Undo
                </LoadingButton>
              </Stack>
            ) : (
              <Stack
                sx={{
                  width: "100%",
                  justifyContent: "center",
                }}
                spacing={1}
                direction="row"
              >
                <LoadingButton
                  sx={{
                    color: "red.200",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    background: "white",
                    border: "1px solid",
                    borderColor: "red.200",
                    borderRadius: 2,
                    ":hover": {
                      background: "white",
                      opacity: 0.8,
                    },
                  }}
                  size="small"
                  onClick={onReject}
                  loading={actionLoading}
                >
                  Reject
                </LoadingButton>
                <LoadingButton
                  sx={{
                    color: "green.700",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    background: "white",
                    border: "1px solid",
                    borderColor: "green.700",
                    borderRadius: 2,
                    ":hover": {
                      background: "white",
                      opacity: 0.8,
                    },
                  }}
                  size="small"
                  onClick={onShortlist}
                  loading={actionLoading}
                >
                  Shortlist
                </LoadingButton>
              </Stack>
            ))}
        </Box>
      </Stack>

      <Stack
        sx={{
          pb: 15,
          width: "100%",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {isLoading && (
          <Stack sx={{ py: 10 }}>
            <CircularProgress size="1.25rem" />
          </Stack>
        )}

        {data && (
          <Stack sx={{ width: "100%" }}>
            <Stack sx={{ gap: 1.5 }} position="relative">
              {media.banner && (
                <Box
                  sx={{
                    width: "100%",
                    height: {
                      xs: "15.625rem",
                      md: "30.13rem",
                    },
                    position: "relative",
                    overflow: "hidden",
                    borderRadius: ".75rem",
                  }}
                >
                  <Box
                    sx={{
                      width: "auto",
                      height: "auto",
                      objectFit: "cover",
                    }}
                    src={media.banner}
                    alt=""
                    fill
                    component={Image}
                  />
                </Box>
              )}

              {searchResult?.shortlists.includes(propertyId) && (
                <Stack
                  sx={{
                    width: 120,
                    height: 32,
                    alignItems: "center",
                    justifyContent: "center",

                    position: "absolute",
                    top: 15,
                    left: 0,
                    borderRadius: "0px 4px 4px 0px",
                    bgcolor: "green.700",
                  }}
                >
                  <Typography variant="body1" color="white" fontWeight="600">
                    Shortlisted
                  </Typography>
                </Stack>
              )}

              {searchResult?.rejects.includes(propertyId) && (
                <Stack
                  sx={{
                    width: 120,
                    height: 32,
                    alignItems: "center",
                    justifyContent: "center",

                    position: "absolute",
                    top: 15,
                    left: 0,
                    borderRadius: "0px 4px 4px 0px",
                    bgcolor: "red.200",
                  }}
                >
                  <Typography variant="body1" color="white" fontWeight="600">
                    Rejected
                  </Typography>
                </Stack>
              )}

              <Swiper
                style={{ width: "100%" }}
                modules={[Pagination]}
                pagination={{
                  clickable: true,
                }}
                grabCursor
                breakpoints={breakpoints}
                spaceBetween={12}
                slidesPerView={2}
              >
                {media.images.map((image) => (
                  <SwiperSlide key={image} style={{ width: "100%" }}>
                    <Image
                      src={image}
                      alt=""
                      style={{
                        width: "100%",
                        height: "10rem",
                        objectFit: "cover",
                        borderRadius: ".5rem",
                      }}
                      width={186}
                      height={160}
                    />
                  </SwiperSlide>
                ))}
              </Swiper>
            </Stack>

            <Stack sx={{ mt: 5 }}>
              <Typography
                sx={{ color: "blue.800", fontWeight: 500 }}
                variant="h2"
                component="h1"
              >
                {data.property.ListPrice
                  ? formatMoney(data.property.ListPrice)
                  : "--"}
              </Typography>

              <Typography
                sx={{
                  mt: 1.5,
                  mb: 3,
                  gap: 1.5,
                  color: "gray.700",
                  display: "flex",
                  alignItems: {
                    xs: "flex-start",
                    md: "center",
                  },
                  flexDirection: {
                    xs: "column",
                    md: "row",
                  },
                }}
                variant="h5"
              >
                <MapPin />
                {`${data.property.UnparsedAddress}, ${data.property.City}`}
              </Typography>

              <Stack
                sx={{
                  gap: 2,
                  alignItems: {
                    xs: "flex-start",
                    md: "center",
                  },
                  flexDirection: {
                    xs: "column",
                    md: "row",
                  },
                }}
              >
                {Number(data.property.BuildingAreaTotal) > 0 ? (
                  <Typography
                    sx={{
                      py: 1,
                      px: 1.5,
                      gap: 1,
                      color: "gray.600",
                      display: "flex",
                      bgcolor: "gray.200",
                      fontWeight: 500,
                      alignItems: "center",
                      borderRadius: ".5rem",
                    }}
                  >
                    <Table2 size={20} />
                    {`${data.property.BuildingAreaTotal} ${formatAreaUint(
                      data.property.BuildingAreaUnits
                    )}`}
                  </Typography>
                ) : (
                  ""
                )}

                {Number(data.property.BedroomsTotal) > 0 && (
                  <Typography
                    sx={{
                      py: 1,
                      px: 1.5,
                      gap: 1,
                      color: "gray.600",
                      display: "flex",
                      bgcolor: "gray.200",
                      fontWeight: 500,
                      alignItems: "center",
                      borderRadius: ".5rem",
                    }}
                  >
                    <BedDouble size={20} />
                    {`${data.property.BedroomsTotal} Beds`}
                  </Typography>
                )}

                {Number(data.property.BathroomsTotal) > 0 && (
                  <Typography
                    sx={{
                      py: 1,
                      px: 1.5,
                      gap: 1,
                      color: "gray.600",
                      display: "flex",
                      bgcolor: "gray.200",
                      fontWeight: 500,
                      alignItems: "center",
                      borderRadius: ".5rem",
                    }}
                  >
                    <Bath size={20} />
                    {`${data.property.BathroomsTotal} Baths`}
                  </Typography>
                )}
              </Stack>

              {data.property.PublicRemarks && (
                <ListingDescription message={data.property.PublicRemarks} />
              )}

              <Stack
                sx={{
                  my: 6,
                  py: 6,
                  borderTop: "1px solid",
                  borderBottom: "1px solid",
                  borderColor: "gray.300",
                }}
              >
                <Typography
                  sx={{
                    mb: 2,
                    fontWeight: 700,
                  }}
                  variant="h5"
                >
                  Listing Details
                </Typography>

                <Grid
                  sx={{ width: "100%" }}
                  container
                  rowSpacing={1}
                  columnSpacing={10}
                >
                  {Object.entries(details).map(([key, value]) => (
                    <Grid key={key} xs={12} md={6}>
                      <Typography>
                        <b>{key}: </b>
                        {value}
                      </Typography>
                    </Grid>
                  ))}
                </Grid>
              </Stack>

              <WalkingDistance data={data.property} />
            </Stack>
          </Stack>
        )}
      </Stack>
    </>
  )
}

export default PropertyPage
