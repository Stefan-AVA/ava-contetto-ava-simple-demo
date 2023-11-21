"use client"

import { FormEvent, useState } from "react"
import { useInviteContactMutation } from "@/redux/apis/org"
import { parseError } from "@/utils/error"
import formatErrorZodMessage from "@/utils/format-error-zod"
import { LoadingButton } from "@mui/lab"
import {
  Unstable_Grid2 as Grid,
  Stack,
  TextField,
  Typography,
} from "@mui/material"
import { z } from "zod"

import type { IAgentProfile } from "@/types/agentProfile.types"
import type { IContact } from "@/types/contact.types"

const inviteContactSchema = z.object({
  email: z
    .string()
    .email("Enter your valid email address")
    .min(1, "Enter your email"),
})

const initialForm = {
  email: "",
}

export type InviteContactSchema = z.infer<typeof inviteContactSchema>

type FormError = InviteContactSchema & {
  request?: string
}

interface IMyContacts {
  me?: IAgentProfile
  contacts: IContact[]
}

export default function Contacts({ me, contacts = [] }: IMyContacts) {
  const [form, setForm] = useState<InviteContactSchema>(initialForm)
  const [errors, setErrors] = useState<FormError | null>(null)

  const [invite, { isLoading }] = useInviteContactMutation()

  async function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()

    setErrors(null)

    const response = inviteContactSchema.safeParse(form)

    if (!response.success) {
      const error = formatErrorZodMessage<InviteContactSchema>(response.error)

      setErrors(error)

      return
    }

    try {
      await invite({
        id: me?.orgId as string,
        email: response.data.email,
      }).unwrap()
    } catch (error) {
      setErrors(
        (prev) => ({ ...prev, request: parseError(error) }) as FormError
      )
    }
  }

  return (
    <Stack sx={{ gap: 3 }}>
      <Typography sx={{ fontWeight: 700 }} variant="h6">
        Invite a contact
      </Typography>

      <Stack
        sx={{
          gap: 3,
          width: "100%",
          maxWidth: "32rem",
        }}
        onSubmit={submit}
        component="form"
      >
        <TextField
          label="Email"
          error={!!errors?.email}
          onChange={({ target }) =>
            setForm((prev) => ({ ...prev, email: target.value }))
          }
          helperText={errors?.email}
        />

        <LoadingButton type="submit" loading={isLoading}>
          Invite
        </LoadingButton>
      </Stack>

      {errors && errors.request && (
        <Typography
          sx={{ mt: 1.5, color: "red.500", textAlign: "center" }}
          variant="body2"
        >
          {errors.request}
        </Typography>
      )}

      <Typography
        sx={{
          pt: 3,
          borderTop: "1px solid",
          fontWeight: 700,
          borderTopColor: "gray.300",
        }}
        variant="h6"
      >
        Contacts
      </Typography>

      <Grid spacing={2} container>
        {contacts.map(({ _id, username }) => (
          <Grid
            sx={{
              p: 3,
              gap: 1,
              width: "100%",
              border: "1px solid",
              display: "flex",
              alignItems: "center",
              borderColor: "gray.300",
              borderRadius: ".5rem",
            }}
            xs={12}
            md={4}
            key={_id}
          >
            <Typography sx={{ fontWeight: 700, textTransform: "uppercase" }}>
              {username}
            </Typography>
          </Grid>
        ))}
      </Grid>
    </Stack>
  )
}
