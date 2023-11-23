"use client"

import { useState, type FormEvent } from "react"
import { useGetMembersQuery, useInviteAgentMutation } from "@/redux/apis/org"
import { parseError } from "@/utils/error"
import { getTimeDifference } from "@/utils/format-date"
import formatErrorZodMessage from "@/utils/format-error-zod"
import { LoadingButton } from "@mui/lab"
import {
  Unstable_Grid2 as Grid,
  MenuItem,
  Stack,
  TextField,
  Typography,
} from "@mui/material"
import { useSnackbar } from "notistack"
import { z } from "zod"

import { AgentRole, type IAgentProfile } from "@/types/agentProfile.types"

const inviteAgentSchema = z.object({
  role: z.string().min(1, "Select a role"),
  email: z
    .string()
    .email("Enter your valid email address")
    .min(1, "Enter your email"),
})

const initialForm = {
  role: "",
  email: "",
}

export type InviteAgentSchema = z.infer<typeof inviteAgentSchema>

type FormError = InviteAgentSchema & {
  request?: string
}

interface IOrgMembers {
  me?: IAgentProfile
}

export default function OrgMembers({ me }: IOrgMembers) {
  const { enqueueSnackbar } = useSnackbar()

  const [form, setForm] = useState<InviteAgentSchema>(initialForm)
  const [errors, setErrors] = useState<FormError | null>(null)

  const { data, refetch } = useGetMembersQuery(
    { id: String(me?.orgId) },
    { skip: !me }
  )
  const [invite, { isLoading }] = useInviteAgentMutation()

  async function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()

    setErrors(null)

    const response = inviteAgentSchema.safeParse(form)

    if (!response.success) {
      const error = formatErrorZodMessage<InviteAgentSchema>(response.error)

      setErrors(error)

      return
    }

    try {
      await invite({
        id: me?.orgId as string,
        ...response.data,
      }).unwrap()

      refetch()

      enqueueSnackbar(`Sent an invitation to ${response.data.email}`, {
        variant: "success",
      })
    } catch (error) {
      setErrors(
        (prev) => ({ ...prev, request: parseError(error) }) as FormError
      )
    }
  }

  return (
    <Stack sx={{ gap: 3 }}>
      {(me?.role === AgentRole.owner || me?.role === AgentRole.admin) && (
        <>
          <Typography sx={{ fontWeight: 700 }} variant="h6">
            Invite a member
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
            <Stack spacing={2} direction={{ xs: "column", md: "row" }}>
              <TextField
                label="Email"
                error={!!errors?.email}
                onChange={({ target }) =>
                  setForm((prev) => ({ ...prev, email: target.value }))
                }
                helperText={errors?.email}
                fullWidth
              />

              <TextField
                label="Role"
                error={!!errors?.role}
                select
                onChange={({ target }) =>
                  setForm((prev) => ({ ...prev, role: target.value }))
                }
                fullWidth
                helperText={errors?.role}
              >
                {me.role === AgentRole.owner && (
                  <MenuItem value={AgentRole.admin}>{AgentRole.admin}</MenuItem>
                )}

                <MenuItem value={AgentRole.agent}>{AgentRole.agent}</MenuItem>
              </TextField>
            </Stack>

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
        </>
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
        Members
      </Typography>

      <Grid spacing={2} container sx={{ maxWidth: "32rem" }}>
        {data?.members.map(({ _id, username, role }) => (
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
            md={6}
            key={_id}
          >
            <Typography
              sx={{
                color: "blue.800",
                fontWeight: 700,
                textTransform: "uppercase",
              }}
            >
              {username}
            </Typography>

            <Typography
              sx={{ color: "blue.800" }}
              variant="caption"
              component="span"
            >
              ({role})
            </Typography>

            {username === me?.username && (
              <Typography
                sx={{ color: "gray.500" }}
                variant="caption"
                component="span"
              >
                You
              </Typography>
            )}
          </Grid>
        ))}
      </Grid>

      {(data?.invitations || []).length > 0 && (
        <>
          <Typography
            sx={{
              pt: 3,
              borderTop: "1px solid",
              borderTopColor: "gray.300",
            }}
            variant="h6"
          >
            <b>Active</b> (pending) <b>Invitations</b>
          </Typography>

          <Stack spacing={2} sx={{ maxWidth: "32rem" }}>
            {data?.invitations.map(
              ({ _id, email, createdAt, invitor, role }) => (
                <Stack
                  key={_id}
                  direction="row"
                  alignItems="center"
                  justifyContent="space-between"
                  sx={{
                    borderBottom: "1px solid",
                    borderColor: "gray.300",
                    py: 1,
                  }}
                >
                  <Stack direction="row" alignItems="center" spacing={1}>
                    <Typography
                      sx={{
                        color: "blue.800",
                        fontWeight: 700,
                      }}
                    >
                      {email}
                    </Typography>

                    <Typography
                      sx={{ color: "blue.800" }}
                      variant="caption"
                      component="span"
                    >
                      ({role})
                    </Typography>
                  </Stack>
                  <Stack
                    direction="row"
                    alignItems="center"
                    spacing={1}
                    display={{ xs: "none", md: "flex" }}
                  >
                    <Typography
                      sx={{ color: "blue.800" }}
                      variant="body2"
                      component="span"
                    >
                      Invited:
                    </Typography>

                    <Typography
                      sx={{ color: "blue.800" }}
                      variant="caption"
                      component="span"
                    >
                      {getTimeDifference(createdAt)}
                    </Typography>
                  </Stack>
                </Stack>
              )
            )}
          </Stack>
        </>
      )}
    </Stack>
  )
}
