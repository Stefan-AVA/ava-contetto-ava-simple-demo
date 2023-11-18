"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/navigation"
import LoginLayout from "@/layouts/LoginLayout"
import { useLoginMutation } from "@/redux/apis/auth"
import { parseError } from "@/utils/error"
import { zodResolver } from "@hookform/resolvers/zod"
import { LoadingButton } from "@mui/lab"
import { Box, Stack, TextField, Typography } from "@mui/material"
import Background from "~/assets/signup-background.jpg"
import { FormProvider, useForm } from "react-hook-form"
import { z } from "zod"

import { FormInput } from "@/components/input"

const schema = z.object({
  username: z.string().min(1, "Enter your username"),
  password: z.string().min(1, "Enter your password"),
})

export type LoginFormSchema = z.infer<typeof schema>

interface PageProps {
  searchParams: {
    _next: string
  }
}

export default function LoginPage({ searchParams }: PageProps) {
  const { push } = useRouter()

  const nextLink = searchParams._next

  const [requestError, setRequestError] = useState("")

  const methods = useForm<LoginFormSchema>({
    resolver: zodResolver(schema),
  })

  const [login, { isLoading }] = useLoginMutation()

  const clearErrors = () => {
    methods.clearErrors()
    setRequestError("")
  }

  async function submit(data: LoginFormSchema) {
    try {
      clearErrors()
      await login(data).unwrap()

      push(nextLink ? (nextLink as any) : "/app")
    } catch (error) {
      console.log("signup error ==>", error)
      setRequestError(parseError(error))
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

          <FormProvider {...methods}>
            <Stack
              sx={{ width: "100%" }}
              onSubmit={methods.handleSubmit(submit)}
              component="form"
            >
              <TextField sx={{ mb: 3 }} name="username" label="Username" />

              <TextField
                name="password"
                label="Password"
                // isPassword
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

              {requestError && (
                <Typography
                  sx={{ mt: 1.5, color: "red.500", textAlign: "center" }}
                  variant="body2"
                >
                  {requestError}
                </Typography>
              )}
            </Stack>
          </FormProvider>

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
