"use client"

import "swiper/css"
import "swiper/css/pagination"

import { useEffect, useMemo, useState } from "react"
import Image from "next/image"
import Link from "next/link"
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
  CircularProgress,
  Unstable_Grid2 as Grid,
  Stack,
  Typography,
} from "@mui/material"
import {
  Bath,
  BedDouble,
  Calendar,
  MapPin,
  PhoneCall,
  Table2,
} from "lucide-react"
import { Pagination } from "swiper/modules"
import { Swiper, SwiperSlide, type SwiperProps } from "swiper/react"

import { ISearchResult } from "@/types/searchResult.types"

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
}

const PropertyPage = ({ orgId, searchId, propertyId }: IProps) => {
  const [searchResult, setSearchResult] = useState<ISearchResult | undefined>(
    undefined
  )

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

  const onShortlist = async () => {
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

  const onReject = async () => {
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

  const onUndo = async () => {
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

  return (
    <Stack
      sx={{
        p: {
          md: 2,
        },
        border: {
          md: "1px solid",
        },
        width: "100%",
        alignItems: "center",
        borderColor: {
          md: "gray.300",
        },
        borderRadius: ".75rem",
        justifyContent: "center",
        pb: 15,
      }}
    >
      {isLoading && (
        <Stack sx={{ py: 10 }}>
          <CircularProgress size="1.25rem" />
        </Stack>
      )}

      {data && (
        <Grid sx={{ width: "100%" }} container spacing={2}>
          <Grid xs={12} md={8}>
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

            <Stack
              sx={{
                p: { xs: 2, md: 4 },
              }}
            >
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
                <>
                  <Typography
                    sx={{
                      mt: 4,
                      mb: 2,
                      color: "blue.800",
                      fontWeight: 500,
                    }}
                    variant="h4"
                  >
                    Property Information
                  </Typography>

                  <Typography sx={{ color: "gray.500" }}>
                    {data.property.PublicRemarks}
                  </Typography>
                </>
              )}
            </Stack>
          </Grid>

          <Grid
            sx={{ gap: 5, display: "flex", flexDirection: "column" }}
            xs={12}
            md={4}
          >
            <Stack
              sx={{
                pt: 2,
                pl: 2,
                pr: 3,
                pb: 4,
                border: "1px solid",
                position: "relative",
                borderColor: "blue.500",
                borderRadius: ".75rem",
              }}
            >
              <Typography
                sx={{
                  color: "blue.800",
                  fontWeight: 500,
                }}
                component="h5"
              >
                Property Tour
              </Typography>

              <Typography
                sx={{
                  mt: 1,
                  color: "gray.500",
                }}
                variant="body2"
              >
                If you want to tour property then feel free to schedule from the
                calendar. Now you can book as early as 9:00 AM
              </Typography>

              <Box
                sx={{
                  py: 1,
                  px: 1.5,
                  mx: "auto",
                  gap: 1.5,
                  left: 0,
                  color: "blue.500",
                  width: "fit-content",
                  right: 0,
                  bottom: "-1.5rem",
                  border: "1px solid",
                  display: "flex",
                  bgcolor: "white",
                  position: "absolute",
                  fontWeight: 500,
                  alignItems: "center",
                  borderColor: "blue.500",
                  borderRadius: ".5rem",
                }}
                type="button"
                component="button"
              >
                <Calendar />
                Schedule a tour
              </Box>
            </Stack>

            <Stack
              sx={{
                pt: 2,
                pl: 2,
                pr: 3,
                pb: 4,
                border: "1px solid",
                position: "relative",
                borderColor: "blue.500",
                borderRadius: ".75rem",
              }}
            >
              <Typography
                sx={{
                  color: "blue.800",
                  fontWeight: 500,
                }}
                component="h5"
              >
                Agent Details
              </Typography>

              <Typography
                sx={{
                  mt: 1,
                  color: "gray.500",
                }}
                variant="body2"
              >
                {`Contact ${data.property.ListOfficeURL} to discuss more about your potential
                new home.`}
              </Typography>

              <Box
                sx={{
                  py: 1,
                  px: 1.5,
                  mx: "auto",
                  gap: 1.5,
                  left: 0,
                  color: "blue.500",
                  width: "fit-content",
                  right: 0,
                  bottom: "-1.5rem",
                  border: "1px solid",
                  display: "flex",
                  bgcolor: "white",
                  position: "absolute",
                  fontWeight: 500,
                  alignItems: "center",
                  borderColor: "blue.500",
                  borderRadius: ".5rem",
                }}
                href={`tel:${data.property.ListAgentOfficePhone}`}
                component={Link}
              >
                <PhoneCall />
                Contact Agent
              </Box>
            </Stack>

            <Box
              sx={{ width: "100%", borderRadius: ".5rem" }}
              src={`//maps.google.com/maps?q=${data.property.location.coordinates[1]},${data.property.location.coordinates[0]}&z=15&output=embed`}
              style={{ border: 0 }}
              height={284}
              loading="lazy"
              component="iframe"
              referrerPolicy="no-referrer-when-downgrade"
              allowFullScreen
            />

            <Box
              sx={{
                position: { xs: "fixed", md: "relative" },
                bottom: 10,
                left: 0,
                width: "100%",
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
                        p: 1.5,
                        color: "purple.500",
                        width: "100%",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        background: "white",
                        height: 50,
                        border: "1px solid",
                        borderColor: "purple.500",
                        borderRadius: 2,
                        ":hover": {
                          background: "white",
                          opacity: 0.8,
                        },
                      }}
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
                    direction="row"
                    spacing={1}
                  >
                    <LoadingButton
                      sx={{
                        p: 1.5,
                        color: "red.200",
                        width: "100%",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        background: "white",
                        height: 50,
                        border: "1px solid",
                        borderColor: "red.200",
                        borderRadius: 2,
                        ":hover": {
                          background: "white",
                          opacity: 0.8,
                        },
                      }}
                      onClick={onReject}
                      loading={actionLoading}
                    >
                      Reject
                    </LoadingButton>
                    <LoadingButton
                      sx={{
                        p: 1.5,
                        color: "green.700",
                        width: "100%",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        background: "white",
                        border: "1px solid",
                        borderColor: "green.700",
                        borderRadius: 2,
                        height: 50,
                        ":hover": {
                          background: "white",
                          opacity: 0.8,
                        },
                      }}
                      onClick={onShortlist}
                      loading={actionLoading}
                    >
                      Shortlist
                    </LoadingButton>
                  </Stack>
                ))}
            </Box>
          </Grid>
        </Grid>
      )}
    </Stack>
  )
}

export default PropertyPage
