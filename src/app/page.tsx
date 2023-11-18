"use client"

import { FormEvent, useState } from "react"
import { Route } from "next"
import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/navigation"
import LoginLayout from "@/layouts/LoginLayout"
import { useLoginMutation } from "@/redux/apis/auth"
import { parseError } from "@/utils/error"
import formatErrorZodMessage from "@/utils/format-error-zod"
import { LoadingButton } from "@mui/lab"
import { Box, Stack, TextField, Typography } from "@mui/material"
import Background from "~/assets/signup-background.jpg"
import { z } from "zod"

const schema = z.object({
  username: z.string().min(1, "Enter your username"),
  password: z.string().min(1, "Enter your password"),
})

export type LoginFormSchema = z.infer<typeof schema>

type FormError = LoginFormSchema & {
  request?: string
}

interface PageProps {
  searchParams: {
    _next: string
  }
}

export default function LoginPage({ searchParams }: PageProps) {
  const [form, setForm] = useState<LoginFormSchema>({
    username: "",
    password: "",
  })
  const [errors, setErrors] = useState<FormError | null>(null)

  const { push } = useRouter()

  const nextLink = searchParams._next

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
      await login(form).unwrap()

      push(nextLink ? (nextLink as Route) : "/app")
    } catch (error) {
      setErrors((prev) => ({ ...prev, request: parseError(error) }))
    }
  }

  return (
    <LoginLayout>
      <Stack
        sx={{
          height: "100%",
          minHeight: "100vh",
          flexDirection: {
            xs: "column",
            md: "row",
          },
        }}
      >
        <Box
          sx={{
            width: {
              xs: "100%",
              md: "50%",
            },
            height: {
              xs: "24rem",
              md: "100%",
            },
            objectFit: "cover",
            minHeight: {
              md: "100vh",
            },
          }}
          src={Background}
          alt=""
          priority
          component={Image}
        />

        <Stack
          sx={{
            px: {
              xs: 3,
              sm: 10,
              lg: 20,
            },
            py: {
              xs: 5,
              sm: 10,
            },
            width: {
              xs: "100%",
              md: "50%",
            },
            alignItems: "center",
          }}
        >
          <Typography
            sx={{ mb: 2.5, color: "gray.800", fontWeight: 700 }}
            variant="h3"
            component="h1"
          >
            Login to your account
          </Typography>

          <Stack sx={{ width: "100%" }} onSubmit={submit} component="form">
            <TextField
              sx={{ mb: 3 }}
              label="Username"
              onChange={({ target }) =>
                setForm((prev) => ({ ...prev, username: target.value }))
              }
            />

            <TextField
              label="Password"
              // isPassword
              onChange={({ target }) =>
                setForm((prev) => ({ ...prev, password: target.value }))
              }
            />

            <Typography
              sx={{
                mt: 1.5,
                color: "blue.500",
                fontWeight: 700,
              }}
              href={
                nextLink
                  ? `/forgot-password?_next=${nextLink}`
                  : "/forgot-password"
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
              href={nextLink ? `/signup?_next=${nextLink}` : "/signup"}
              variant="body2"
              component={Link}
            >
              Sign up
            </Typography>{" "}
            your account.
          </Typography>
        </Stack>
      </Stack>
    </LoginLayout>
  )
}
