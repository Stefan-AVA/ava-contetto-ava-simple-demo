import { useMemo } from "react"
import Image from "next/image"
import { Box, Stack, Typography } from "@mui/material"

import type { IListing } from "@/types/listing.types"

type FieldType = {
  name: string
  icon: string
  quantity: number
}

interface WalkingDistanceProps {
  data: IListing
}

export default function WalkingDistance({ data }: WalkingDistanceProps) {
  const types = useMemo(() => {
    const fields = [] as FieldType[]

    if (data.nearbySchools.length > 0) {
      const field = {
        name: "Nearby Schools",
        icon: "/assets/icon-nearby-schools.svg",
        quantity: data.nearbySchools.length,
      }

      fields.push(field)
    }

    if (data.nearbyHealthcares.length > 0) {
      const field = {
        name: "Health Car Facilities",
        icon: "/assets/icon-health-car.svg",
        quantity: data.nearbyHealthcares.length,
      }

      fields.push(field)
    }

    if (data.nearbyParks.length > 0) {
      const field = {
        name: "Parks",
        icon: "/assets/icon-parks.svg",
        quantity: data.nearbyParks.length,
      }

      fields.push(field)
    }

    return fields
  }, [data])

  return (
    <Stack sx={{ gap: 5 }}>
      <Stack
        sx={{
          gap: 5,
          alignItems: "center",
          flexDirection: "row",
          justifyContent: "space-between",
        }}
      >
        <Typography sx={{ fontWeight: 700 }} variant="h5">
          Walking Distance
        </Typography>

        <Stack
          sx={{
            gap: 10,
            alignItems: "center",
            flexDirection: "row",
          }}
        >
          {types.map(({ name, icon, quantity }) => (
            <Stack
              sx={{
                gap: 1,
                cursor: "pointer",
                alignItems: "center",
                flexDirection: "row",
              }}
              key={name}
            >
              <Stack
                sx={{
                  width: "3.5rem",
                  height: "3.5rem",
                  bgcolor: "primary.main",
                  alignItems: "center",
                  borderRadius: "50%",
                  justifyContent: "center",
                }}
              >
                <Image src={icon} alt="" width={32} height={32} />
              </Stack>

              <Box>
                <Typography sx={{ fontWeight: 700 }}>{name}</Typography>

                <Typography
                  sx={{ textDecoration: "underline" }}
                  variant="body2"
                >
                  {quantity} Result{quantity !== 1 ? "s" : ""}
                </Typography>
              </Box>
            </Stack>
          ))}
        </Stack>
      </Stack>

      <Stack sx={{ flexDirection: "row" }}>
        <Stack sx={{ width: "40%" }} />

        <Box
          sx={{ width: "60%", borderRadius: ".5rem" }}
          src={`//maps.google.com/maps?q=${data.location.coordinates[1]},${data.location.coordinates[0]}&z=15&output=embed`}
          style={{ border: 0 }}
          height={284}
          loading="lazy"
          component="iframe"
          referrerPolicy="no-referrer-when-downgrade"
          allowFullScreen
        />
      </Stack>
    </Stack>
  )
}
