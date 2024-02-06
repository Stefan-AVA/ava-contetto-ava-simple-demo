"use client"

import { useState, type MouseEvent } from "react"
import Image from "next/image"
import { LoadingButton } from "@mui/lab"
import { Box, MenuItem, Stack, TextField, Typography } from "@mui/material"
import { Check, Plus, X } from "lucide-react"

const initialForm = {
  name: "",
  logos: [] as File[],
  fonts: {
    body: "",
    title: "",
  },
  colors: [] as string[],
}

export default function ManageBrand() {
  const [form, setForm] = useState(initialForm)
  const [color, setColor] = useState("")

  async function onSubmit() {
    //
  }

  function onAddLogo(files: FileList | null) {
    if (files)
      setForm((prev) => ({
        ...prev,
        logos: [...prev.logos, files[0]],
      }))
  }

  function onAddColor() {
    if (color)
      setForm((prev) => ({
        ...prev,
        colors: [...prev.colors, color],
      }))

    setColor("")
  }

  function onChangeName(value: string) {
    setForm((prev) => ({ ...prev, name: value }))
  }

  function onAddFontFamily(type: keyof typeof form.fonts, value: string) {
    setForm((prev) => ({
      ...prev,
      fonts: {
        ...prev.fonts,
        [type]: value,
      },
    }))
  }

  function onRemoveLogo(position: number) {
    setForm((prev) => ({
      ...prev,
      logos: prev.logos.filter((_, index) => position !== index),
    }))
  }

  function onRemoveColor(e: MouseEvent<HTMLButtonElement>, position: number) {
    e.stopPropagation()

    setForm((prev) => ({
      ...prev,
      colors: prev.colors.filter((_, index) => position !== index),
    }))
  }

  function onCurrentColor(value: string) {
    setColor(value)
  }

  return (
    <Stack sx={{ maxWidth: "35rem" }}>
      <Typography sx={{ fontWeight: 600 }} variant="h4">
        Manage Brand
      </Typography>

      <Stack sx={{ mt: 5, gap: 1 }}>
        <Typography sx={{ fontWeight: 600 }} variant="h6">
          Organization Name
        </Typography>

        <TextField
          label="Organization Name"
          value={form.name}
          onChange={({ target }) => onChangeName(target.value)}
        />
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
          {form.logos.map((logo, index) => (
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
                onClick={() => onRemoveLogo(index)}
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
              onChange={({ target }) => onAddLogo(target.files)}
              component="input"
            />
          </Stack>
        </Stack>
      </Stack>

      <Stack sx={{ mt: 4, gap: 1 }}>
        <Typography sx={{ fontWeight: 600 }} variant="h6">
          Brand colors
        </Typography>

        <Stack
          sx={{
            gap: 3,
            alignItems: "center",
            flexDirection: "row",
          }}
        >
          {form.colors.map((color, index) => (
            <Stack
              sx={{
                width: "4rem",
                height: "4rem",
                border: "1px dashed",
                position: "relative",
                borderColor: color,
                borderRadius: ".75rem",
                backgroundColor: color,
              }}
              key={color}
            >
              <Stack
                sx={{
                  top: "-.5rem",
                  right: "-.5rem",
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
                onClick={(e) => onRemoveColor(e, index)}
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
              borderColor: color ?? "gray.300",
              borderRadius: ".75rem",
              justifyContent: "center",
              backgroundColor: color ?? "transparent",
            }}
            component="button"
          >
            <Box
              sx={{
                cursor: "pointer",
                zIndex: 2,
                position: "relative",
                pointerEvents: color ? "auto" : "none",
              }}
              onClick={onAddColor}
              component={color ? Check : Plus}
            />

            <Box
              sx={{
                top: 0,
                left: 0,
                width: "100%",
                height: "100%",
                zIndex: 1,
                cursor: "pointer",
                opacity: 0,
                position: "absolute",
              }}
              type="color"
              value={color}
              onChange={({ target }) => onCurrentColor(target.value)}
              component="input"
            />
          </Stack>
        </Stack>
      </Stack>

      <Stack sx={{ mt: 4, gap: 1 }}>
        <Typography sx={{ fontWeight: 600 }} variant="h6">
          Brand fonts
        </Typography>

        <TextField
          sx={{ mb: 1 }}
          select
          label="Title font"
          value={form.fonts.title}
          onChange={({ target }) => onAddFontFamily("title", target.value)}
        >
          <MenuItem value="DM Sans">DM Sans</MenuItem>
          <MenuItem value="Inter">Inter</MenuItem>
          <MenuItem value="Roboto">Roboto</MenuItem>
          <MenuItem value="Open Sans">Open Sans</MenuItem>
          <MenuItem value="Plus Jakarta Sans">Plus Jakarta Sans</MenuItem>
          <MenuItem value="Lato">Lato</MenuItem>
          <MenuItem value="Raleway">Raleway</MenuItem>
          <MenuItem value="Nunito Sans">Nunito Sans</MenuItem>
        </TextField>

        <TextField
          select
          label="Body font"
          value={form.fonts.body}
          onChange={({ target }) => onAddFontFamily("body", target.value)}
        >
          <MenuItem value="DM Sans">DM Sans</MenuItem>
          <MenuItem value="Inter">Inter</MenuItem>
          <MenuItem value="Roboto">Roboto</MenuItem>
          <MenuItem value="Open Sans">Open Sans</MenuItem>
          <MenuItem value="Plus Jakarta Sans">Plus Jakarta Sans</MenuItem>
          <MenuItem value="Lato">Lato</MenuItem>
          <MenuItem value="Raleway">Raleway</MenuItem>
          <MenuItem value="Nunito Sans">Nunito Sans</MenuItem>
        </TextField>
      </Stack>

      <LoadingButton sx={{ mt: 6, ml: "auto" }} onClick={onSubmit}>
        Save
      </LoadingButton>
    </Stack>
  )
}
