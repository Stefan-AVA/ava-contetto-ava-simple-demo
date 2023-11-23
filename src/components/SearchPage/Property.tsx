"use client"

import { Route } from "next"
import Image from "next/image"
import Link from "next/link"
import {
  useRejectPropertyMutation,
  useShortlistPropertyMutation,
  useUndoPropertyMutation,
} from "@/redux/apis/search"
import formatMoney from "@/utils/format-money"
import { LoadingButton } from "@mui/lab"
import { Unstable_Grid2 as Grid, Stack, Typography } from "@mui/material"
import { Bath, BedDouble, Table2 } from "lucide-react"

import { IListing } from "@/types/listing.types"
import { ISearchResult } from "@/types/searchResult.types"

interface IProps extends IListing {
  orgId: string
  agentId?: string
  contactId?: string
  searchResult?: ISearchResult
  setSearchResult?: Function
}

const Property = ({
  orgId,
  agentId,
  contactId,
  searchResult,
  setSearchResult,

  _id,
  Media,
  ListPrice,
  ClosePrice,
  BedroomsTotal,
  UnparsedAddress,
  BathroomsTotalInteger,
  VIVA_AdditionalRentSqFt,
}: IProps) => {
  const findMedia = Media.find(({ MediaURL }) => MediaURL)

  const [shortlist, { isLoading: isShortlistLoading }] =
    useShortlistPropertyMutation()
  const [reject, { isLoading: isRejectLoading }] = useRejectPropertyMutation()
  const [undo, { isLoading: isUndoLoading }] = useUndoPropertyMutation()

  const loading = isShortlistLoading || isRejectLoading || isUndoLoading

  const onShortlist = async () => {
    try {
      const result = await shortlist({
        orgId,
        searchId: String(searchResult?._id),
        propertyId: _id,
      }).unwrap()
      if (setSearchResult) setSearchResult(result.searchResult)
    } catch (error) {
      console.log("onShortlist error ===>", error)
    }
  }

  const onReject = async () => {
    try {
      const result = await reject({
        orgId,
        searchId: String(searchResult?._id),
        propertyId: _id,
      }).unwrap()
      if (setSearchResult) setSearchResult(result.searchResult)
    } catch (error) {
      console.log("onReject error ===>", error)
    }
  }

  const onUndo = async () => {
    try {
      const result = await undo({
        orgId,
        searchId: String(searchResult?._id),
        propertyId: _id,
      }).unwrap()
      if (setSearchResult) setSearchResult(result.searchResult)
    } catch (error) {
      console.log("onUndo error ===>", error)
    }
  }

  return (
    <Grid xs={12} sm={6} md={4} xl={3} key={_id}>
      <Stack
        sx={{
          border: "1px solid",
          borderColor: "gray.300",
          borderRadius: ".75rem",
        }}
      >
        <Stack
          href={
            (agentId
              ? `/app/agent-orgs/${agentId}/search-results/${searchResult?._id}/properties/${_id}`
              : `/app/contact-orgs/${contactId}/search-results/${searchResult?._id}/properties/${_id}`) as Route
          }
          component={Link}
          position="relative"
        >
          {searchResult?.shortlists.includes(_id) && (
            <Stack
              sx={{
                width: 120,
                height: 32,
                alignItems: "center",
                justifyContent: "center",

                position: "absolute",
                top: 12,
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

          {searchResult?.rejects.includes(_id) && (
            <Stack
              sx={{
                width: 120,
                height: 32,
                alignItems: "center",
                justifyContent: "center",

                position: "absolute",
                top: 12,
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
        </Stack>

        {searchResult?.searchName &&
          ([...searchResult.shortlists, ...searchResult.rejects].includes(
            _id
          ) ? (
            <Stack
              sx={{
                width: "100%",
                justifyContent: "center",
                borderTop: "1px solid",
                borderTopColor: "gray.300",
              }}
              direction="row"
            >
              <LoadingButton
                sx={{
                  p: 1.5,
                  color: "blue.900",
                  width: "100%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  background: "transparent",
                  height: 50,
                  ":hover": {
                    background: "transparent",
                    opacity: 0.8,
                  },
                }}
                onClick={onUndo}
                loading={loading}
              >
                Undo
              </LoadingButton>
            </Stack>
          ) : (
            <Stack
              sx={{
                width: "100%",
                justifyContent: "center",
                borderTop: "1px solid",
                borderTopColor: "gray.300",
              }}
              direction="row"
            >
              <LoadingButton
                sx={{
                  p: 1.5,
                  color: "red.200",
                  width: "100%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  background: "transparent",
                  height: 50,
                  ":hover": {
                    background: "transparent",
                    opacity: 0.8,
                  },
                }}
                onClick={onReject}
                loading={loading}
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
                  borderRadius: 0,
                  borderLeft: "1px solid",
                  borderLeftColor: "gray.300",
                  background: "transparent",
                  height: 50,
                  ":hover": {
                    background: "transparent",
                    opacity: 0.8,
                  },
                }}
                onClick={onShortlist}
                loading={loading}
              >
                Shortlist
              </LoadingButton>
            </Stack>
          ))}
      </Stack>
    </Grid>
  )
}

export default Property
