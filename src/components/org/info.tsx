"use client"

import { useEffect, useState, type FormEvent } from "react"
import { useRouter } from "next/navigation"
import {
  useCreateOrgMutation,
  useLazyGetOrgsQuery,
  useUpdateOrgMutation,
} from "@/redux/apis/org"
import { parseError } from "@/utils/error"
import formatErrorZodMessage from "@/utils/format-error-zod"
import { LoadingButton } from "@mui/lab"
import { Stack, TextField, Typography } from "@mui/material"
import { z } from "zod"

import { AgentRole } from "@/types/agentProfile.types"
import type { IOrg } from "@/types/org.types"

const orgSchema = z.object({
  name: z.string().min(1, "Enter name"),
})

const initialForm = {
  name: "",
}

export type OrgSchema = z.infer<typeof orgSchema>

interface IOrgInfo {
  org?: IOrg
  role?: AgentRole
  isCreate?: boolean
  setOpenCreateOrgModal?: Function
}

type FormError = OrgSchema & {
  request?: string
}

export default function OrgInfo({
  org,
  role,
  isCreate = false,
  setOpenCreateOrgModal,
}: IOrgInfo) {
  const { push } = useRouter()

  const [form, setForm] = useState<OrgSchema>(initialForm)
  const [errors, setErrors] = useState<FormError | null>(null)

  const [updateOrg, { isLoading: isUpdateLoading }] = useUpdateOrgMutation()
  const [createOrg, { isLoading: isCreateLoading }] = useCreateOrgMutation()
  const [getOrgs, { isLoading: isLoadingOrgs }] = useLazyGetOrgsQuery()

  const isLoading = isCreateLoading || isUpdateLoading || isLoadingOrgs

  useEffect(() => {
    if (org) setForm((prev) => ({ ...prev, name: org.name }))
  }, [org])

  async function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()

    setErrors(null)

    const response = orgSchema.safeParse(form)

    if (!response.success) {
      const error = formatErrorZodMessage<OrgSchema>(response.error)

      setErrors(error)

      return
    }

    try {
      if (!isCreate && org) {
        await updateOrg({ ...org, name: response.data.name }).unwrap()
      }

      if (isCreate) {
        const res = await createOrg({ name: response.data.name }).unwrap()
        await getOrgs().unwrap()

        setForm(initialForm)
        if (setOpenCreateOrgModal) setOpenCreateOrgModal(false)

        push(`/app/agent-orgs/${res.agentProfileId}/settings`)
      }
    } catch (error) {
      setErrors(
        (prev) => ({ ...prev, request: parseError(error) }) as FormError
      )
    }
  }

  return (
    <Stack
      sx={{
        p: isCreate ? 2.5 : 0,
        mx: "auto",
        gap: 3,
        width: "100%",
        maxWidth: "32rem",
      }}
      onSubmit={submit}
      component="form"
    >
      <TextField
        label="Organization Name"
        value={form.name}
        error={!!errors?.name}
        onChange={({ target }) =>
          setForm((prev) => ({ ...prev, name: target.value }))
        }
        disabled={!isCreate && role !== AgentRole.owner}
        helperText={errors?.name}
      />

      {(isCreate || (!isCreate && role === AgentRole.owner)) && (
        <LoadingButton type="submit" loading={isLoading}>
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
