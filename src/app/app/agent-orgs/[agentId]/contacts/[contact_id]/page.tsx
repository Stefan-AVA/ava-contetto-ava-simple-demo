"use client"

import { useEffect, useMemo, useState, type FormEvent } from "react"
import { useGetContactQuery, useUpdateContactMutation } from "@/redux/apis/org"
import type { RootState } from "@/redux/store"
import { parseError } from "@/utils/error"
import formatErrorZodMessage from "@/utils/format-error-zod"
import { LoadingButton } from "@mui/lab"
import { Stack, TextField, Typography } from "@mui/material"
import { useSnackbar } from "notistack"
import { useSelector } from "react-redux"
import { z } from "zod"

const schema = z.object({
  name: z.string().optional(),
  note: z.string().min(1, "Enter the note"),
})

const initialForm = {
  note: "",
  name: "",
}

type FormSchema = z.infer<typeof schema>

type FormError = FormSchema & {
  request?: string
}

type IPage = {
  params: {
    agentId: string
    contact_id: string
  }
}

export default function Page({ params }: IPage) {
  const [form, setForm] = useState<FormSchema>(initialForm)
  const [errors, setErrors] = useState<FormError | null>(null)

  const { enqueueSnackbar } = useSnackbar()

  const [update, { isLoading }] = useUpdateContactMutation()

  const agentOrgs = useSelector((state: RootState) => state.app.agentOrgs)

  const agentProfile = useMemo(
    () => agentOrgs.find((agent) => agent._id === params.agentId),
    [params, agentOrgs]
  )

  const { data } = useGetContactQuery(
    {
      _id: params.contact_id,
      orgId: agentProfile?.orgId,
    },
    {
      skip: !params.contact_id || !agentProfile,
    }
  )

  useEffect(() => {
    if (data) setForm((prev) => ({ ...prev, name: data.name, note: data.note }))
  }, [data])

  async function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()

    setErrors(null)

    const response = schema.safeParse(form)

    if (!response.success) {
      const error = formatErrorZodMessage<FormSchema>(response.error)

      setErrors(error)

      return
    }

    try {
      await update({
        _id: params.contact_id,
        ...form,
        orgId: agentProfile?.orgId,
      }).unwrap()

      enqueueSnackbar("Note updated successfully", { variant: "success" })
    } catch (error) {
      setErrors(
        (prev) => ({ ...prev, request: parseError(error) }) as FormError
      )
    }
  }

  return (
    <Stack>
      <Typography sx={{ fontWeight: 500 }} variant="h5">
        Update Note
      </Typography>

      <Stack sx={{ mt: 2, width: "100%" }} onSubmit={submit} component="form">
        <TextField
          label="Note"
          rows={6}
          value={form.note}
          error={!!errors?.note}
          onChange={({ target }) =>
            setForm((prev) => ({ ...prev, note: target.value }))
          }
          multiline
          helperText={errors?.note}
        />

        <LoadingButton
          sx={{ mt: 4.5, ml: "auto" }}
          type="submit"
          loading={isLoading}
        >
          Update note
        </LoadingButton>

        {errors && errors.request && (
          <Typography
            sx={{ mt: 1.5, color: "red.500", textAlign: "center" }}
            variant="body2"
          >
            {errors.request}
          </Typography>
        )}
      </Stack>
    </Stack>
  )
}
