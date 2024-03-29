"use client"

import { useEffect, useState, type FormEvent } from "react"
import { useRouter } from "next/navigation"
import { useGetIndustriesQuery } from "@/redux/apis/industry"
import {
  useCreateOrgMutation,
  useLazyGetOrgsQuery,
  useUpdateOrgMutation,
} from "@/redux/apis/org"
import { parseError } from "@/utils/error"
import toBase64 from "@/utils/toBase64"
import { LoadingButton } from "@mui/lab"
import {
  Autocomplete,
  InputAdornment,
  ListItem,
  ListItemText,
  Stack,
  TextField,
  Typography,
} from "@mui/material"

import { AgentRole } from "@/types/agentProfile.types"
import { IIndustry } from "@/types/industry.types"
import type { IOrg } from "@/types/org.types"

import ImageUpload from "../ImageUpload"

interface IOrgInfo {
  org?: IOrg
  role?: AgentRole
  isCreate?: boolean
  setOpenCreateOrgModal?: Function
}

interface IForm {
  name: string
  industryId: string
  logoUrl: string
  logoFileType?: string
}

const initialForm: IForm = {
  name: "",
  industryId: "",
  logoUrl: "",
  logoFileType: undefined,
}

interface IError {
  name?: string
  industryId?: string
  request?: string
}

export default function OrgInfo({
  org,
  role,
  isCreate = false,
  setOpenCreateOrgModal,
}: IOrgInfo) {
  const { push } = useRouter()

  const [form, setForm] = useState<IForm>(initialForm)
  const [errors, setErrors] = useState<IError>({})

  const [updateOrg, { isLoading: isUpdateLoading }] = useUpdateOrgMutation()
  const [createOrg, { isLoading: isCreateLoading }] = useCreateOrgMutation()
  const [getOrgs, { isLoading: isLoadingOrgs }] = useLazyGetOrgsQuery()
  const { data: industries = [], isLoading: isLoadingIndustries } =
    useGetIndustriesQuery()

  const isLoading =
    isCreateLoading || isUpdateLoading || isLoadingOrgs || isLoadingIndustries

  useEffect(() => {
    if (org)
      setForm((prev) => ({
        ...prev,
        name: org.name,
        logoUrl: org.logoUrl || "",
      }))
  }, [org])

  const onChange = (name: keyof IForm, value: any) => {
    setErrors({})
    setForm((prev) => ({ ...prev, [name]: value }))
  }

  const isValidated = () => {
    const errs: IError = {}
    if (!form.name) errs.name = "This field is required"
    if (!form.industryId) errors.industryId = "This field is required"
    setErrors(errs)

    return Object.keys(errs).length === 0
  }

  const onLogoFileChange = async (files: File[]) => {
    const file = files[0]
    if (!file) return

    const base64 = await toBase64(file)

    setForm((prev) => ({
      ...prev,
      logoUrl: String(base64),
      logoFileType: file.type,
    }))
  }

  const onLogoDelete = () => {
    setForm((prev) => ({
      ...prev,
      logoUrl: "",
      logoFileType: undefined,
    }))
  }

  async function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()

    setErrors({})

    if (!isValidated()) return

    try {
      if (!isCreate && org) {
        await updateOrg({ ...org, ...form }).unwrap()
      }

      if (isCreate) {
        const res = await createOrg(form).unwrap()
        await getOrgs().unwrap()

        setForm(initialForm)
        if (setOpenCreateOrgModal) setOpenCreateOrgModal(false)

        push(`/app/agent-orgs/${res.agentProfileId}/settings`)
      }
    } catch (error) {
      setErrors((prev) => ({ ...prev, request: parseError(error) }))
    }
  }

  return (
    <Stack
      sx={{
        p: isCreate ? 2.5 : 0,
        gap: 3,
        width: "100%",
        maxWidth: "32rem",
        alignItems: "center",
      }}
      onSubmit={submit}
      component="form"
    >
      <TextField
        label="Organization Name"
        value={form.name}
        error={!!errors?.name}
        onChange={({ target }) => onChange("name", target.value)}
        disabled={!isCreate && role !== AgentRole.owner}
        helperText={errors?.name}
        fullWidth
      />

      <Autocomplete
        value={industries.find((industry) => industry._id === form.industryId)}
        loading={isLoadingIndustries}
        options={industries as IIndustry[]}
        onChange={(_, newValue) => onChange("industryId", newValue?._id)}
        fullWidth
        clearOnBlur
        renderInput={(params) => (
          <TextField
            {...params}
            label="Search Industry"
            InputProps={{
              ...params.InputProps,
              endAdornment: (
                <InputAdornment position="end">
                  {params.InputProps.endAdornment}
                </InputAdornment>
              ),
            }}
            error={!!errors.industryId}
            helperText={errors.industryId}
          />
        )}
        renderOption={({ key, ...props }: any, option) => (
          <ListItem key={option._id} {...props}>
            <ListItemText>{option.name}</ListItemText>
          </ListItem>
        )}
        noOptionsText="No Industry"
        selectOnFocus
        getOptionLabel={(option) => option.name}
        handleHomeEndKeys
      />

      <ImageUpload
        images={[form.logoUrl]}
        onDelete={onLogoDelete}
        onChange={onLogoFileChange}
        width={200}
        height={200}
        multiple
        dragInactiveText={"jpeg, png"}
      />

      {(isCreate || (!isCreate && role === AgentRole.owner)) && (
        <LoadingButton type="submit" loading={isLoading} fullWidth>
          {isCreate ? "Create a new Organization" : "Update"}
        </LoadingButton>
      )}

      {errors && errors.request && (
        <Typography
          sx={{ mt: 1.5, color: "red.500", textAlign: "center" }}
          variant="body2"
        >
          {errors.request}
        </Typography>
      )}
    </Stack>
  )
}
