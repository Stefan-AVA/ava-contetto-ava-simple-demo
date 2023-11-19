"use client"

import { useEffect, useState, type FormEvent } from "react"
import { usePostMeMutation } from "@/redux/apis/auth"
import { setUser } from "@/redux/slices/app"
import { RootState, useAppDispatch } from "@/redux/store"
import { parseError } from "@/utils/error"
import formatErrorZodMessage from "@/utils/format-error-zod"
import { LoadingButton } from "@mui/lab"
import { Stack, TextField } from "@mui/material"
import { useSelector } from "react-redux"
import { z } from "zod"

import { IUser } from "@/types/user.types"

const schema = z.object({
  name: z.string().min(1, "Enter your full name"),
})

const initialForm = {
  name: "",
}

export type ProfileFormSchema = z.infer<typeof schema>

type FormError = ProfileFormSchema & {
  request?: string
}

export default function Page() {
  const [form, setForm] = useState<ProfileFormSchema>(initialForm)
  const [errors, setErrors] = useState<FormError | null>(null)

  const dispatch = useAppDispatch()

  const user = useSelector((state: RootState) => state.app.user)

  const [updateProfile, { isLoading }] = usePostMeMutation()

  useEffect(() => {
    if (user) {
      setForm((prev) => ({
        ...prev,
        name: user.name || "",
      }))
    }
  }, [user])

  async function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()

    setErrors(null)

    const response = schema.safeParse(form)

    if (!response.success) {
      const error = formatErrorZodMessage<ProfileFormSchema>(response.error)

      setErrors(error)

      return
    }

    try {
      const updatedUser = await updateProfile({
        ...(user as IUser),
        name: form.name,
      }).unwrap()

      dispatch(setUser(updatedUser))
    } catch (error) {
      setErrors(
        (prev) => ({ ...prev, request: parseError(error) }) as FormError
      )
    }
  }

  return (
    <Stack sx={{ width: "100%", alignItems: "center" }}>
      <Stack
        sx={{ width: "100%", maxWidth: "32rem" }}
        onSubmit={submit}
        component="form"
      >
        <TextField label="Username" value={user?.username || ""} disabled />

        <TextField
          sx={{ mt: 2 }}
          label="Display Name"
          value={form.name}
          error={!!errors?.name}
          onChange={({ target }) =>
            setForm((prev) => ({ ...prev, name: target.value }))
          }
          helperText={errors?.name}
        />

        <LoadingButton
          sx={{ mt: 6 }}
          type="submit"
          loading={isLoading}
          fullWidth
        >
          Submit
        </LoadingButton>
      </Stack>
    </Stack>
  )
}
