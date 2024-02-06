"use client"

import { useState } from "react"
import Image from "next/image"
import { LoadingButton } from "@mui/lab"
import { Box, Stack, TextField, Typography } from "@mui/material"
import { Plus, X } from "lucide-react"

export default function ManageBrand() {
  const [logos, setLogos] = useState<File[]>([])

  return (
    <Stack sx={{ maxWidth: "35rem" }}>
      <Typography sx={{ fontWeight: 600 }} variant="h4">
        Manage Brand
      </Typography>

      <Stack sx={{ mt: 5, gap: 1 }}>
        <Typography sx={{ fontWeight: 600 }} variant="h6">
          Organization Name
        </Typography>

        <TextField label="Organization Name" />
      </Stack>

      <Stack sx={{ mt: 4, gap: 1 }}>
        <Typography sx={{ fontWeight: 600 }} variant="h6">
          Logo
        </Typography>

        <Stack
          sx={{
            gap: 3,
            alignItems: "center",
            flexDirection: "row",
          }}
        >
          {logos.map((logo, index) => (
            <Stack
              sx={{
                width: "6rem",
                height: "6rem",
                border: "1px dashed",
                position: "relative",
                alignItems: "center",
                borderColor: "gray.300",
                borderRadius: ".75rem",
                justifyContent: "center",
              }}
              key={logo.name}
            >
              <Image
                src={URL.createObjectURL(logo)}
                alt=""
                width={96}
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "contain",
                  borderRadius: ".75rem",
                }}
                height={96}
              />

              <Stack
                sx={{
                  top: "-.675rem",
                  right: "-.675rem",
                  color: "white",
                  width: "1.25rem",
                  border: "none",
                  height: "1.25rem",
                  bgcolor: "gray.700",
                  position: "absolute",
                  alignItems: "center",
                  borderRadius: "50%",
                  justifyContent: "center",
                }}
                onClick={() =>
                  setLogos((prev) =>
                    prev.filter((_, position) => position !== index)
                  )
                }
                component="button"
              >
                <X size={12} strokeWidth={2} />
              </Stack>
            </Stack>
          ))}

          <Stack
            sx={{
              width: "4rem",
              border: "1px dashed",
              height: "4rem",
              position: "relative",
              alignItems: "center",
              borderColor: "gray.300",
              borderRadius: ".75rem",
              justifyContent: "center",
            }}
            component="button"
          >
            <Box sx={{ pointerEvents: "none" }} component={Plus} />

            <Box
              sx={{
                top: 0,
                left: 0,
                width: "100%",
                height: "100%",
                cursor: "pointer",
                opacity: 0,
                position: "absolute",
              }}
              type="file"
              onChange={({ target }) =>
                setLogos((prev) =>
                  target.files ? [...prev, target.files[0]] : prev
                )
              }
              component="input"
            />
          </Stack>
        </Stack>
      </Stack>

      <Stack sx={{ mt: 4, gap: 1 }}>
        <Typography sx={{ fontWeight: 600 }} variant="h6">
          Brand colors
        </Typography>

        <TextField label="Organization Name" />
      </Stack>

      <Stack sx={{ mt: 4, gap: 1 }}>
        <Typography sx={{ fontWeight: 600 }} variant="h6">
          Brand fonts
        </Typography>

        <TextField label="Title font" />
        <TextField label="Body font" />
      </Stack>

      <LoadingButton sx={{ mt: 6, ml: "auto" }}>Save</LoadingButton>
    </Stack>
  )
}
