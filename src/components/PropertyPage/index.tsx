"use client"

import "swiper/css"
import "swiper/css/pagination"

import { useMemo } from "react"
import Image from "next/image"
import Link from "next/link"
import formatMoney from "@/utils/format-money"
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

import { IListing } from "@/types/listing.types"

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
  data?: IListing
  isLoading: boolean
}

const PropertyPage = ({ data, isLoading, orgId, searchId }: IProps) => {
  const media = useMemo(() => {
    if (data) {
      const banner = data.Media[0].MediaURL
      const images = data.Media.slice(1).map(({ MediaURL }) => MediaURL)

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

  return (
    <Stack
      sx={{
        p: {
          md: 2,
        },
        border: {
          md: "1px solid",
        },
        alignItems: "center",
        borderColor: {
          md: "gray.300",
        },
        borderRadius: ".75rem",
        justifyContent: "center",
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
            <Stack sx={{ gap: 1.5 }}>
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
                  <SwiperSlide key={image} style={{ width: "fit-content" }}>
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
                {formatMoney(data.ListPrice || data.ClosePrice)}
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
                {data.UnparsedAddress}
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
                {data.VIVA_AdditionalRentSqFt && (
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
                    {`${data.VIVA_AdditionalRentSqFt} sq ft`}
                  </Typography>
                )}

                {data.BedroomsTotal > 0 && (
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
                    {`${data.BedroomsTotal} Beds`}
                  </Typography>
                )}

                {data.BathroomsTotalInteger > 0 && (
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
                    {`${data.BathroomsTotalInteger} Baths`}
                  </Typography>
                )}
              </Stack>

              {data.PublicRemarks && (
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
                    {data.PublicRemarks}
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
                {`Contact ${data.ListOfficeAOR} to discuss more about your potential
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
                href={`tel:${data.ListAgentOfficePhone}`}
                component={Link}
              >
                <PhoneCall />
                Contact Agent
              </Box>
            </Stack>

            <Box
              sx={{ width: "100%", borderRadius: ".5rem" }}
              src={`//maps.google.com/maps?q=${data.Latitude},${data.Longitude}&z=15&output=embed`}
              style={{ border: 0 }}
              height={284}
              loading="lazy"
              component="iframe"
              referrerPolicy="no-referrer-when-downgrade"
              allowFullScreen
            />
          </Grid>
        </Grid>
      )}
    </Stack>
  )
}

export default PropertyPage
