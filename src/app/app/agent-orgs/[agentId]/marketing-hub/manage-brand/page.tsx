"use client"

import { useEffect, useMemo, useState, type MouseEvent } from "react"
import Image from "next/image"
import {
  useSetBrandMutation,
  useUploadBrandLogoMutation,
} from "@/redux/apis/org"
import { RootState } from "@/redux/store"
import toBase64 from "@/utils/toBase64"
import { LoadingButton } from "@mui/lab"
import {
  Box,
  CircularProgress,
  MenuItem,
  Stack,
  TextField,
  Typography,
} from "@mui/material"
import { Check, Plus, X } from "lucide-react"
import { useSnackbar } from "notistack"
import { useSelector } from "react-redux"

const initialForm = {
  name: "",
  logos: [] as string[],
  colors: [] as string[],
  titleFont: "",
  bodyFont: "",
}

interface IError {
  name?: string
}

type PageProps = {
  params: {
    agentId: string
  }
}

export default function ManageBrand({ params }: PageProps) {
  const { agentId } = params

  const { enqueueSnackbar } = useSnackbar()

  const [form, setForm] = useState(initialForm)
  const [color, setColor] = useState("")
  const [errors, setErrors] = useState<IError>({})

  const agentOrgs = useSelector((state: RootState) => state.app.agentOrgs)

  const org = useMemo(
    () => agentOrgs.find((agent) => agent._id === agentId)?.org,
    [agentId, agentOrgs]
  )

  const [uploadLogo, { isLoading: isUploadingLogo }] =
    useUploadBrandLogoMutation()
  const [setBrand, { isLoading: isSettingBrand }] = useSetBrandMutation()

  useEffect(() => {
    if (org) {
      setForm({
        name: org.name,
        logos: org.brand?.logos || [],
        colors: org.brand?.colors || [],
        titleFont: org.brand?.titleFont || "",
        bodyFont: org.brand?.bodyFont || "",
      })
    }
  }, [org])

  const onChange = (key: keyof typeof initialForm, value: string) => {
    setErrors({})
    setForm((prev) => ({ ...prev, [key]: value }))
  }

  const onAddLogo = async (files: FileList | null) => {
    const file = files ? files[0] : null
    if (file && org) {
      try {
        const base64 = await toBase64(file)

        const { url } = await uploadLogo({
          orgId: org._id,
          logoUrl: String(base64),
          logoFileType: file.type,
        }).unwrap()

        setForm((prev) => ({
          ...prev,
          logos: [...prev.logos, url],
        }))
      } catch (error) {
        enqueueSnackbar("Upload error!", { variant: "error" })
      }
    }
  }

  function onRemoveLogo(position: number) {
    setForm((prev) => ({
      ...prev,
      logos: prev.logos.filter((_, index) => position !== index),
    }))
  }

  const onAddColor = () => {
    if (color)
      setForm((prev) => ({
        ...prev,
        colors: [...prev.colors, color],
      }))

    setColor("")
  }

  const onRemoveColor = (
    e: MouseEvent<HTMLButtonElement>,
    position: number
  ) => {
    e.stopPropagation()

    setForm((prev) => ({
      ...prev,
      colors: prev.colors.filter((_, index) => position !== index),
    }))
  }

  const onCurrentColor = (value: string) => {
    setColor(value)
  }

  const onSubmit = async () => {
    if (!org) return
    if (!form.name) {
      setErrors({ name: "This field is required" })
      return
    }

    try {
      await setBrand({
        orgId: org?._id,
        ...form,
      }).unwrap()

      enqueueSnackbar("Saved!", { variant: "success" })
    } catch (error) {
      enqueueSnackbar("save error!", { variant: "error" })
    }
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
          onChange={({ target }) => onChange("name", target.value)}
          error={!!errors.name}
          helperText={errors.name}
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
              key={logo}
            >
              <Image
                src={logo}
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
            {isUploadingLogo ? (
              <CircularProgress color="inherit" size="1.25rem" />
            ) : (
              <Box sx={{ pointerEvents: "none" }} component={Plus} />
            )}

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
              accept="image/*"
              onChange={({ target }) => onAddLogo(target.files)}
              component="input"
              disabled={isUploadingLogo || isSettingBrand}
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
              key={`${color}+${index}`}
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
          value={form.titleFont}
          onChange={({ target }) => onChange("titleFont", target.value)}
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
          value={form.bodyFont}
          onChange={({ target }) => onChange("bodyFont", target.value)}
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

      <LoadingButton
        sx={{ mt: 6, ml: "auto" }}
        onClick={onSubmit}
        loading={isSettingBrand}
      >
        Save
      </LoadingButton>
    </Stack>
  )
}
