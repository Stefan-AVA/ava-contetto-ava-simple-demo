"use client"

import { useState } from "react"
import { useInviteContactMutation } from "@/redux/apis/org"
import { parseError } from "@/utils/error"
import { zodResolver } from "@hookform/resolvers/zod"
import { LoadingButton } from "@mui/lab"
import {
  Unstable_Grid2 as Grid,
  Stack,
  TextField,
  Typography,
} from "@mui/material"
import { useForm } from "react-hook-form"
import { z } from "zod"

import type { IAgentProfile } from "@/types/agentProfile.types"
import type { IContact } from "@/types/contact.types"

const inviteContactSchema = z.object({
  email: z
    .string()
    .email("Enter your valid email address")
    .min(1, "Enter your email"),
})

export type InviteContactSchema = z.infer<typeof inviteContactSchema>

interface IMyContacts {
  me?: IAgentProfile
  contacts: IContact[]
}

export default function MyContacts({ me, contacts = [] }: IMyContacts) {
  const [reqestError, setRequestError] = useState("")

  const orgMethods = useForm<InviteContactSchema>({
    resolver: zodResolver(inviteContactSchema),
  })

  const [invite, { isLoading }] = useInviteContactMutation()

  const clearErrors = () => {
    orgMethods.clearErrors()
    setRequestError("")
  }

  async function submit(data: InviteContactSchema) {
    try {
      clearErrors()

      await invite({
        id: me?.orgId as string,
        email: data.email,
      }).unwrap()
    } catch (error) {
      console.log("Invite error ==>", error)
      setRequestError(parseError(error))
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
        <TextField label="Email" />

        <LoadingButton type="submit" loading={isLoading}>
          Invite
        </LoadingButton>
      </Stack>

      {reqestError && (
        <p className="text-sm text-center text-red-500 mt-3">{reqestError}</p>
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
