import { useEffect, useMemo, useState } from "react"
import Image from "next/image"
import { Box, Stack, Typography } from "@mui/material"

import type { IListing } from "@/types/listing.types"

type FieldType = {
  key: "nearbySchools" | "nearbyHealthcares" | "nearbyParks"
  name: string
  icon: string
  quantity: number
}

interface WalkingDistanceProps {
  data: IListing
}

export default function WalkingDistance({ data }: WalkingDistanceProps) {
  const [type, setType] = useState<FieldType["key"] | null>(null)

  const types = useMemo(() => {
    const fields = [] as FieldType[]

    if (data.nearbySchools.length > 0) {
      const field = {
        key: "nearbySchools" as FieldType["key"],
        name: "Nearby Schools",
        icon: "/assets/icon-nearby-schools.svg",
        quantity: data.nearbySchools.length,
      }

      fields.push(field)
    }

    if (data.nearbyHealthcares.length > 0) {
      const field = {
        key: "nearbyHealthcares" as FieldType["key"],
        name: "Health Car Facilities",
        icon: "/assets/icon-health-car.svg",
        quantity: data.nearbyHealthcares.length,
      }

      fields.push(field)
    }

    if (data.nearbyParks.length > 0) {
      const field = {
        key: "nearbyParks" as FieldType["key"],
        name: "Parks",
        icon: "/assets/icon-parks.svg",
        quantity: data.nearbyParks.length,
      }

      fields.push(field)
    }

    return fields
  }, [data])

  useEffect(() => {
    if (types.length > 0) setType(types[0].key)
  }, [types])

  const currType = useMemo(() => {
    if (type) {
      const curr = data[type]

      const findType = types.find(({ key }) => key === type)!

      return {
        name: findType.name,
        list: curr.map((field) => ({
          id: field._id,
          name: field.Facility_N,
          type: field.Facility_T,
          grade:
            field.Min_Grade && Number(field.Min_Grade)
              ? `${field.Min_Grade}${
                  field.Max_Grade ? ` to ${field.Max_Grade}` : ""
                }`
              : null,
          distance: field.distance ? `${Math.round(field.distance)}m` : null,
        })),
      }
    }

    return null
  }, [data, type, types])

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
          {types.map(({ key, name, icon, quantity }) => (
            <Stack
              sx={{
                gap: 1,
                cursor: "pointer",
                alignItems: "center",
                flexDirection: "row",
              }}
              key={name}
              role="presentation"
              onClick={() => setType(key)}
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

      <Stack sx={{ gap: 4, flexDirection: "row" }}>
        {currType && (
          <Stack sx={{ width: "40%" }}>
            <Typography sx={{ fontWeight: 700 }} variant="body2">
              {currType.name}
            </Typography>

            <Stack sx={{ mt: 3, gap: 2 }}>
              {currType.list.map((field) => (
                <Box
                  sx={{
                    py: 2,
                    px: 4,
                    border: "1px solid",
                    borderColor: "gray.200",
                    borderRadius: ".75rem",
                  }}
                  key={field.id}
                >
                  <Typography sx={{ fontWeight: 700 }} variant="body2">
                    {field.name}
                  </Typography>

                  <Typography variant="body2">
                    Walking Distance: {field.distance ?? "-"} <br />
                    Grade: {field.grade ?? "-"} <br />
                    {field.distance ?? ""}
                  </Typography>
                </Box>
              ))}
            </Stack>
          </Stack>
        )}

        <Box
          sx={{ width: !type ? "100%" : "60%", borderRadius: ".5rem" }}
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
