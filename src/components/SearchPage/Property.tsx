"use client"

import { Route } from "next"
import Image from "next/image"
import Link from "next/link"
import formatMoney from "@/utils/format-money"
import { Unstable_Grid2 as Grid, Stack, Typography } from "@mui/material"
import { Bath, BedDouble, Table2 } from "lucide-react"

import { IListing } from "@/types/listing.types"

interface IProps extends IListing {
  orgId: string
  searchId: string
  agentId?: string
  contactId?: string
}

const Property = ({
  orgId,
  searchId,
  agentId,
  contactId,
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
              ? `/app/agent-orgs/${agentId}/search-results/${searchId}/properties/${_id}`
              : `/app/contact-orgs/${contactId}/search-results/${searchId}/properties/${_id}`) as Route
          }
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
        </Stack>

        <Stack
          sx={{
            width: "100%",
            justifyContent: "center",
            borderTop: "1px solid",
            borderTopColor: "gray.300",
          }}
          direction="row"
        >
          <Typography
            sx={{
              p: 1.5,
              color: "red.200",
              width: "100%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
            component={"button"}
            onClick={() => {}}
          >
            Reject
          </Typography>
          <Typography
            sx={{
              p: 1.5,
              color: "green.700",
              width: "100%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              borderLeft: "1px solid",
              borderLeftColor: "gray.300",
            }}
            component={"button"}
            onClick={() => {}}
          >
            Shortlist
          </Typography>
        </Stack>
      </Stack>
    </Grid>
  )
}

export default Property
