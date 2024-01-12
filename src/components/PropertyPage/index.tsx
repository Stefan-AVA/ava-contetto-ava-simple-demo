"use client"

import { useEffect, useMemo, useState } from "react"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { useGetPropertyQuery } from "@/redux/apis/search"
import { formatAreaUint } from "@/utils/format-area-unit"
import formatMoney from "@/utils/format-money"
import {
  Button,
  CircularProgress,
  Unstable_Grid2 as Grid,
  IconButton,
  Stack,
  Typography,
} from "@mui/material"
import { formatDistance } from "date-fns"
import { Bath, BedDouble, MapPin, Table2 } from "lucide-react"

import type { ISearchResult } from "@/types/searchResult.types"

import Gallery from "./gallery"
import ListingDescription from "./listing-description"
import ShareListing from "./share-listing"
import WalkingDistance from "./walking-distance"

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
  const [showShareListing, setShowShareListing] = useState(false)
  const [searchResult, setSearchResult] = useState<ISearchResult | undefined>(
    undefined
  )

  const { push, back } = useRouter()

  const { data, isLoading } = useGetPropertyQuery(
    { orgId, searchId, propertyId },
    { skip: !orgId }
  )

  useEffect(() => {
    if (data?.searchResult) {
      setSearchResult(data.searchResult)
    }
  }, [data, setSearchResult])

  const media = data ? data.property.photos.map(({ url }) => url) : []

  const details = useMemo(() => {
    const timeOnMarket =
      data && data.property.timestamp
        ? formatDistance(new Date(data.property.timestamp * 1000), new Date())
        : null

    return {
      "Property Type":
        data && data.property.PropertyType ? data.property.PropertyType : "-",
      "Land Size":
        data && data.property.BuildingAreaTotal
          ? `${data.property.BuildingAreaTotal} sqft`
          : "_",
      "Building Type": "-",
      "Year Built":
        data && data.property.YearBuilt ? data.property.YearBuilt : "-",
      Neighbourhood: "-",
      "Annual Property Taxes": "-",
      Title: "-",
      "Parking Type": "-",
      "Ownership Type":
        data && data.property.OwnershipType ? data.property.OwnershipType : "-",
      "Time on Market": timeOnMarket ?? "-",
    }
  }, [data])

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

        <Stack
          sx={{
            gap: 2,
            display: {
              xs: "none",
              sm: "flex",
            },
            alignItems: "center",
            flexDirection: "row",
          }}
        >
          <Button size="small">Save Listing</Button>

          <Button size="small" onClick={() => setShowShareListing(true)}>
            Share Listing
          </Button>
        </Stack>
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

              <Gallery data={media} />
            </Stack>

            <Stack sx={{ mt: 2 }}>
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
                      <Typography sx={{ textTransform: "capitalize" }}>
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

        <ShareListing
          show={showShareListing}
          data={data ? data.property : null}
          onClose={() => setShowShareListing(false)}
        />
      </Stack>

      <Stack
        sx={{
          gap: 2,
          right: "2rem",
          bottom: "2rem",
          display: {
            xs: "flex",
            sm: "none",
          },
          position: "fixed",
        }}
      >
        <Button
          sx={{
            p: 2,
            width: "4rem",
            height: "4rem",
            minWidth: "inherit",
            borderRadius: "99px",
          }}
          onClick={() => setShowShareListing(true)}
        >
          <Image src="/assets/icon-send.svg" alt="" width={24} height={24} />
        </Button>

        <Button
          sx={{
            p: 2,
            width: "4rem",
            height: "4rem",
            minWidth: "inherit",
            borderRadius: "99px",
          }}
        >
          <Image
            src="/assets/icon-favorite.svg"
            alt=""
            width={24}
            height={24}
          />
        </Button>
      </Stack>
    </>
  )
}

export default PropertyPage
