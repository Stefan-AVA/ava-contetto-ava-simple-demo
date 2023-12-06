"use client"

import { useMemo, useState, type FormEvent } from "react"
import Link from "next/link"
import { useConfirmEmailMutation, useSignupMutation } from "@/redux/apis/auth"
import { parseError } from "@/utils/error"
import formatErrorZodMessage from "@/utils/format-error-zod"
import { LoadingButton } from "@mui/lab"
import {
  Checkbox,
  FormControlLabel,
  FormHelperText,
  Stack,
  TextField,
  Typography,
} from "@mui/material"
import { z } from "zod"

const singupSchema = z
  .object({
    email: z
      .string()
      .email("Enter your valid email address")
      .min(1, "Enter your email"),
    terms: z.boolean().default(false),
    password: z.string().min(8, "The password must contain at least 8 digits"),
    username: z.string().min(1, "Enter your username"),
    confirmPassword: z.string().min(1, "Confirm your password"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    path: ["confirmPassword"],
    message: "Passwords are not the same",
  })

const confirmEmailSchema = z.object({
  verificationCode: z.string().min(4, "Enter verification code"),
})

export type SingupFormSchema = z.infer<typeof singupSchema>
export type ConfirmEmailFormSchema = z.infer<typeof confirmEmailSchema>

type FormSchema = SingupFormSchema & ConfirmEmailFormSchema

type FormError = Record<keyof Partial<FormSchema>, string> & {
  request?: string
}

interface PageProps {
  searchParams: {
    _next: string
  }
}

const initialForm = {
  email: "",
  terms: false,
  username: "",
  password: "",
  confirmPassword: "",
  verificationCode: "",
}

export default function SignupPage({ searchParams }: PageProps) {
  const nextLink = searchParams._next

  const [step, setStep] = useState(1)
  const [form, setForm] = useState<FormSchema>(initialForm)
  const [errors, setErrors] = useState<Partial<FormError> | null>(null)

  const [signup, { isLoading: isSignupLoading }] = useSignupMutation()
  const [confirmEmail, { isLoading: isConfirmEmailLoading }] =
    useConfirmEmailMutation()

  async function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()

    setErrors(null)

    if (!form.terms) {
      setErrors((prev) => ({ ...prev, terms: "Accept the terms of use" }))

      return
    }

    const response = singupSchema.safeParse(form)

    if (!response.success) {
      const error = formatErrorZodMessage<Partial<FormError>>(response.error)

      setErrors(error)

      return
    }

    try {
      await signup(response.data).unwrap()

      setStep(2)
    } catch (error) {
      setErrors((prev) => ({ ...prev, request: parseError(error) }))
    }
  }

  async function confirm(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()

    setErrors(null)

    const response = confirmEmailSchema.safeParse(form)

    if (!response.success) {
      const error = formatErrorZodMessage<FormError>(response.error)

      setErrors(error)

      return
    }

    try {
      await confirmEmail({
        email: form.email,
        username: form.username,
        orgNeeded: true,
        verificationCode: response.data.verificationCode,
      }).unwrap()

      setStep(3)
    } catch (error) {
      setErrors((prev) => ({ ...prev, request: parseError(error) }))
    }
  }

  const title = useMemo(() => {
    if (step === 2) return "Check Your Inbox"

    if (step === 3) return "Email verified"

    return "Create your account"
  }, [step])

  return (
    <>
      <Typography
        sx={{ mb: 1, color: "gray.700", fontWeight: 700 }}
        variant="h3"
        component="h1"
      >
        {title}
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
            Enter the answer for following fields and get started
          </Typography>

          <Stack sx={{ width: "100%" }} onSubmit={submit} component="form">
            <TextField
              label="Username"
              error={!!errors?.username}
              onChange={({ target }) =>
                setForm((prev) => ({ ...prev, username: target.value }))
              }
              helperText={errors?.username}
            />

            <TextField
              sx={{ my: 3 }}
              label="Email"
              error={!!errors?.email}
              onChange={({ target }) =>
                setForm((prev) => ({ ...prev, email: target.value }))
              }
              helperText={errors?.email}
            />

            <TextField
              type="password"
              label="Create Password"
              error={!!errors?.password}
              onChange={({ target }) =>
                setForm((prev) => ({ ...prev, password: target.value }))
              }
              helperText={errors?.password}
            />

            <TextField
              sx={{ mt: 3 }}
              type="password"
              label="Confirm Password"
              error={!!errors?.confirmPassword}
              onChange={({ target }) =>
                setForm((prev) => ({ ...prev, confirmPassword: target.value }))
              }
              helperText={errors?.confirmPassword}
            />

            <FormControlLabel
              sx={{ mt: 1 }}
              label="I agree to Terms of service and Privacy policy of AVA"
              control={
                <Checkbox
                  onChange={({ target }) =>
                    setForm((prev) => ({ ...prev, terms: target.checked }))
                  }
                />
              }
            />

            {errors?.terms && (
              <FormHelperText error>{errors.terms}</FormHelperText>
            )}

            <LoadingButton
              sx={{ mt: 4.5 }}
              type="submit"
              loading={isSignupLoading}
            >
              Create account
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
            Already have an account?{" "}
            <Typography
              sx={{ color: "blue.500", fontWeight: 700 }}
              href={nextLink ? `/?_next=${nextLink}` : "/"}
              variant="body2"
              component={Link}
            >
              Sign In
            </Typography>{" "}
            to your account.
          </Typography>
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
              label="Verification Code"
              error={!!errors?.verificationCode}
              onChange={({ target }) =>
                setForm((prev) => ({ ...prev, verificationCode: target.value }))
              }
              helperText={errors?.verificationCode}
            />

            <LoadingButton
              sx={{ mt: 4.5 }}
              type="submit"
              loading={isConfirmEmailLoading}
            >
              Confirm
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
            Your account is now verified. Please{" "}
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
    </>
  )
}
