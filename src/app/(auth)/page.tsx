"use client"

import { Suspense, useState, type FormEvent } from "react"
import { Route } from "next"
import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import { connectSocket } from "@/providers/SocketProvider"
import { useLoginMutation } from "@/redux/apis/auth"
import { parseError } from "@/utils/error"
import formatErrorZodMessage from "@/utils/format-error-zod"
import { LoadingButton } from "@mui/lab"
import { Stack, TextField, Typography } from "@mui/material"
import { z } from "zod"

const schema = z.object({
  username: z.string().min(1, "Enter your username"),
  password: z.string().min(1, "Enter your password"),
})

const initialForm = {
  username: "",
  password: "",
}

export type LoginFormSchema = z.infer<typeof schema>

type FormError = LoginFormSchema & {
  request?: string
}

function Login() {
  const [form, setForm] = useState<LoginFormSchema>(initialForm)
  const [errors, setErrors] = useState<FormError | null>(null)

  const { push } = useRouter()
  const searchParams = useSearchParams()
  const queryParams = searchParams.toString()

  const [login, { isLoading }] = useLoginMutation()

  async function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()

    setErrors(null)

    const response = schema.safeParse(form)

    if (!response.success) {
      const error = formatErrorZodMessage<LoginFormSchema>(response.error)

      setErrors(error)

      return
    }

    try {
      const user = await login(response.data).unwrap()

      const reactNativeWebView = window.ReactNativeWebView

      if (user && reactNativeWebView)
        reactNativeWebView.postMessage(
          JSON.stringify({ type: "ONESIGNAL_LOGIN", user })
        )

      // update webSocket connection
      connectSocket()

      const _next = searchParams.get("_next")
      let nextLink = _next ? `${_next}?` : ""
      if (nextLink) {
        for (const [key, value] of Array.from(searchParams.entries())) {
          if (key !== "_next") {
            nextLink = `${nextLink}${key}=${value}&`
          }
        }
        nextLink = nextLink.slice(0, -1)
      }

      push(nextLink ? (nextLink as Route) : "/app")
    } catch (error) {
      setErrors(
        (prev) => ({ ...prev, request: parseError(error) }) as FormError
      )
    }
  }

  return (
    <>
      <Typography
        sx={{ mb: 3, color: "gray.700", fontWeight: 700 }}
        variant="h3"
        component="h1"
      >
        Login to your account
      </Typography>

      <Stack sx={{ width: "100%" }} onSubmit={submit} component="form">
        <TextField
          sx={{ mb: 3 }}
          label="Username"
          error={!!errors?.username}
          onChange={({ target }) =>
            setForm((prev) => ({ ...prev, username: target.value }))
          }
          helperText={errors?.username}
        />

        <TextField
          type="password"
          label="Password"
          error={!!errors?.password}
          onChange={({ target }) =>
            setForm((prev) => ({ ...prev, password: target.value }))
          }
          helperText={errors?.password}
        />

        <Typography
          sx={{
            mt: 1.5,
            color: "blue.500",
            fontWeight: 700,
          }}
          href={
            queryParams ? `/forgot-password?${queryParams}` : "/forgot-password"
          }
          variant="body2"
          component={Link}
        >
          Forgot password?
        </Typography>

        <LoadingButton sx={{ mt: 4.5 }} type="submit" loading={isLoading}>
          Sign In
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

      <Typography
        sx={{
          mt: 5,
          color: "gray.700",
          textAlign: "center",
        }}
        variant="body2"
      >
        {"Don't have an account? "}
        <Typography
          sx={{ color: "blue.500", fontWeight: 700 }}
          href={queryParams ? `/signup?${queryParams}` : "/signup"}
          variant="body2"
          component={Link}
        >
          Sign up
        </Typography>{" "}
        your account.
      </Typography>
    </>
  )
}

export default function Page() {
  return (
    <Suspense>
      <Login />
    </Suspense>
  )
}
