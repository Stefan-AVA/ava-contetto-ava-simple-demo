"use client"

import { useState, type FormEvent } from "react"
import Link from "next/link"
import {
  useForgotPasswordConfirmMutation,
  useForgotPasswordMutation,
} from "@/redux/apis/auth"
import { parseError } from "@/utils/error"
import formatErrorZodMessage from "@/utils/format-error-zod"
import { LoadingButton } from "@mui/lab"
import { Stack, TextField, Typography } from "@mui/material"
import { z } from "zod"

const forgotPasswordSchema = z.object({
  email: z
    .string()
    .email("Enter your valid email address")
    .min(1, "Enter your email"),
})

const confirmForgotPasswordSchema = z
  .object({
    password: z.string().min(8, "The password must contain at least 8 digits"),
    confirmPassword: z.string().min(1, "Confirm your password"),
    verificationCode: z.string().min(4, "Enter your username"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    path: ["confirmPassword"],
    message: "Passwords are not the same",
  })

export type ForgotPasswordFormSchema = z.infer<typeof forgotPasswordSchema>
export type ConfirmForgotPasswordFormSchema = z.infer<
  typeof confirmForgotPasswordSchema
>

interface PageProps {
  searchParams: {
    _next: string
  }
}

type FormSchema = ForgotPasswordFormSchema & ConfirmForgotPasswordFormSchema

type FormError = {
  email?: string
  request?: string
  password?: string
  confirmPassword?: string
  verificationCode?: string
}

const initialForm = {
  email: "",
  password: "",
  confirmPassword: "",
  verificationCode: "",
}

export default function ForgotPasswordPage({ searchParams }: PageProps) {
  const nextLink = searchParams._next

  const [step, setStep] = useState(1)
  const [form, setForm] = useState<FormSchema>(initialForm)
  const [errors, setErrors] = useState<FormError | null>(null)

  const [forgotPassword, { isLoading: isForgotPasswordLoading }] =
    useForgotPasswordMutation()
  const [forgotPasswordConfirm, { isLoading: isConfirmLoading }] =
    useForgotPasswordConfirmMutation()

  async function signup(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()

    setErrors(null)

    const response = forgotPasswordSchema.safeParse(form)

    if (!response.success) {
      const error = formatErrorZodMessage<FormSchema>(response.error)

      setErrors(error)

      return
    }

    try {
      await forgotPassword({ email: form?.email }).unwrap()

      setStep(2)
    } catch (error) {
      setErrors((prev) => ({ ...prev, request: parseError(error) }))
    }
  }

  async function confirm(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()

    setErrors(null)

    const response = confirmForgotPasswordSchema.safeParse(form)

    if (!response.success) {
      const error = formatErrorZodMessage<FormSchema>(response.error)

      setErrors(error)

      return
    }

    try {
      await forgotPasswordConfirm(form as FormSchema).unwrap()

      setStep(3)
    } catch (error) {
      setErrors(
        (prev) => ({ ...prev, request: parseError(error) }) as FormError
      )
    }
  }

  return (
    <>
      <Typography
        sx={{ mb: 1, color: "gray.700", fontWeight: 700 }}
        variant="h3"
        component="h1"
      >
        {step === 3 ? "Password updated" : "Forgot Password"}
      </Typography>

      {step === 1 && (
        <>
          <Typography
            sx={{
              mb: 4,
              color: "gray.600",
              textAlign: "center",
            }}
          >
            Please enter your email. <br />
            We will send you a verification code
          </Typography>

          <Stack sx={{ width: "100%" }} onSubmit={signup} component="form">
            <TextField
              label="Email"
              error={!!errors?.email}
              onChange={({ target }) =>
                setForm((prev) => ({ ...prev, email: target.value }))
              }
              helperText={errors?.email}
            />

            <LoadingButton
              sx={{ mt: 4.5 }}
              type="submit"
              loading={isForgotPasswordLoading}
            >
              Send email
            </LoadingButton>
          </Stack>
        </>
      )}

      {step === 2 && (
        <>
          {form?.email && (
            <Typography
              sx={{
                mb: 4,
                color: "gray.600",
                textAlign: "center",
              }}
            >
              We have sent you a verification code to {form.email}. Please check
              the code.
            </Typography>
          )}

          <Stack sx={{ width: "100%" }} onSubmit={confirm} component="form">
            <TextField
              error={!!errors?.verificationCode}
              label="Verification Code"
              onChange={({ target }) =>
                setForm((prev) => ({ ...prev, verificationCode: target.value }))
              }
              helperText={errors?.verificationCode}
            />

            <TextField
              sx={{ my: 3 }}
              type="password"
              error={!!errors?.password}
              label="New Password"
              onChange={({ target }) =>
                setForm((prev) => ({ ...prev, password: target.value }))
              }
              helperText={errors?.password}
            />

            <TextField
              type="password"
              error={!!errors?.confirmPassword}
              label="Confirm Password"
              onChange={({ target }) =>
                setForm((prev) => ({ ...prev, confirmPassword: target.value }))
              }
              helperText={errors?.confirmPassword}
            />

            <LoadingButton
              sx={{ mt: 4.5 }}
              type="submit"
              loading={isConfirmLoading}
            >
              Confirm
            </LoadingButton>
          </Stack>
        </>
      )}

      {step === 3 && (
        <>
          <Typography
            sx={{
              mt: 2,
              color: "gray.700",
              textAlign: "center",
            }}
          >
            Please{" "}
            <Typography
              sx={{ color: "blue.500", fontWeight: 700 }}
              href={nextLink ? `/?_next=${nextLink}` : "/"}
              component={Link}
            >
              Sign In
            </Typography>{" "}
            to your account.
          </Typography>
        </>
      )}

      {step !== 3 && errors && errors.request && (
        <Typography
          sx={{ mt: 1.5, color: "red.500", textAlign: "center" }}
          variant="body2"
        >
          {errors.request}
        </Typography>
      )}
    </>
  )
}
