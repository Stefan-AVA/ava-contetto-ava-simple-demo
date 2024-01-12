"use client"

import { Route } from "next"
import Image from "next/image"
import Link from "next/link"
import {
  useRejectPropertyMutation,
  useShortlistPropertyMutation,
  useUndoPropertyMutation,
} from "@/redux/apis/search"
import { formatAreaUint } from "@/utils/format-area-unit"
import formatMoney from "@/utils/format-money"
import { LoadingButton } from "@mui/lab"
import { Stack, Typography, type Grid2Props } from "@mui/material"
import { Bath, BedDouble, Table2 } from "lucide-react"

import { IListing } from "@/types/listing.types"
import { ISearchResult } from "@/types/searchResult.types"

interface IProps extends IListing, Grid2Props {
  orgId: string
  agentId?: string
  contactId?: string
  searchResult?: ISearchResult
  refetch?: Function
  fromSearch?: boolean
}

const Property = ({
  sx,
  orgId,
  agentId,
  contactId,
  searchResult,
  refetch,
  fromSearch = false,

  _id,
  photos,
  ListPrice,
  BedroomsTotal,
  UnparsedAddress,
  City,
  BathroomsTotal,
  BuildingAreaTotal,
  BuildingAreaUnits,
}: IProps) => {
  const findMedia = photos.find(({ url }) => url)

  const [shortlist, { isLoading: isShortlistLoading }] =
    useShortlistPropertyMutation()
  const [reject, { isLoading: isRejectLoading }] = useRejectPropertyMutation()
  const [undo, { isLoading: isUndoLoading }] = useUndoPropertyMutation()

  const loading = isShortlistLoading || isRejectLoading || isUndoLoading

  const onShortlist = async () => {
    try {
      await shortlist({
        orgId,
        searchId: String(searchResult?._id),
        propertyId: _id,
      }).unwrap()
      if (refetch) refetch()
    } catch (error) {
      console.log("onShortlist error ===>", error)
    }
  }

  const onReject = async () => {
    try {
      await reject({
        orgId,
        searchId: String(searchResult?._id),
        propertyId: _id,
      }).unwrap()
      if (refetch) refetch()
    } catch (error) {
      console.log("onReject error ===>", error)
    }
  }

  const onUndo = async () => {
    try {
      await undo({
        orgId,
        searchId: String(searchResult?._id),
        propertyId: _id,
      }).unwrap()
      if (refetch) refetch()
    } catch (error) {
      console.log("onUndo error ===>", error)
    }
  }

  return (
    <Stack
      sx={{
        border: "1px solid",
        borderColor: "gray.300",
        borderRadius: ".75rem",
        ...sx,
      }}
    >
      <Stack
        href={
          (agentId
            ? `/app/agent-orgs/${agentId}/search-results/${searchResult?._id}/properties/${_id}${
                fromSearch ? `?fromSearch=${fromSearch}` : ""
              }`
            : `/app/contact-orgs/${contactId}/search-results/${searchResult?._id}/properties/${_id}${
                fromSearch ? `?fromSearch=${fromSearch}` : ""
              }`) as Route
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
            <Typography color="white" fontWeight="600">
              Rejected
            </Typography>
          </Stack>
        )}

        {findMedia && (
          <Image
            src={findMedia.url}
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
          <Typography sx={{ color: "blue.800", fontWeight: 500 }} variant="h5">
            {ListPrice ? formatMoney(ListPrice) : "--"}
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
            {Number(BedroomsTotal) > 0 && (
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

            {Number(BathroomsTotal) > 0 && (
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
                {`${BathroomsTotal} Baths`}
              </Typography>
            )}

            {BuildingAreaTotal && BuildingAreaTotal > 0 ? (
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
                {`${BuildingAreaTotal} ${formatAreaUint(BuildingAreaUnits)}`}
              </Typography>
            ) : null}
          </Stack>

          <Typography sx={{ color: "blue.800" }} variant="body2">
            {`${UnparsedAddress}, ${City}`}
          </Typography>
        </Stack>
      </Stack>

      {searchResult?.searchName &&
        ([...searchResult.shortlists, ...searchResult.rejects].includes(_id) ? (
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
                color: "secondary.main",
                width: "100%",
                height: 50,
                display: "flex",
                alignItems: "center",
                background: "transparent",
                justifyContent: "center",

                ":hover": {
                  opacity: 0.8,
                  background: "transparent",
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
  )
}

export default Property
