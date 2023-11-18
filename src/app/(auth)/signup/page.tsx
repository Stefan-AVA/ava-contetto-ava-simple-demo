"use client"

import { useMemo, useState } from "react"
import Link from "next/link"
import { useConfirmEmailMutation, useSignupMutation } from "@/redux/apis/auth"
import { parseError } from "@/utils/error"
import { zodResolver } from "@hookform/resolvers/zod"
import { LoadingButton } from "@mui/lab"
import { Stack, Typography } from "@mui/material"
import { useForm } from "react-hook-form"
import { z } from "zod"

import Button from "@/components/button"
import { FormCheckbox } from "@/components/checkbox"
import { FormInput } from "@/components/input"

const singupSchema = z
  .object({
    email: z
      .string()
      .email("Enter your valid email address")
      .min(1, "Enter your email"),
    terms: z
      .enum(["true"], {
        invalid_type_error: "Accept the terms of use",
      })
      .transform((value) => value === "true"),
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
  const [reqestError, setRequestError] = useState("")

  const singupMethods = useForm<SingupFormSchema>({
    resolver: zodResolver(singupSchema),
  })
  const confirmEmailMethods = useForm<ConfirmEmailFormSchema>({
    resolver: zodResolver(confirmEmailSchema),
  })

  const [signup, { isLoading: isSignupLoading }] = useSignupMutation()
  const [confirmEmail, { isLoading: isConfirmEmailLoading }] =
    useConfirmEmailMutation()

  const clearErrors = () => {
    singupMethods.clearErrors()
    confirmEmailMethods.clearErrors()
    setRequestError("")
  }

  async function submit(data: SingupFormSchema) {
    try {
      clearErrors()
      await signup(data).unwrap()
      setStep(2)
    } catch (error) {
      console.log("signup error ==>", error)
      setRequestError(parseError(error))
    }
  }

  async function confirm(data: ConfirmEmailFormSchema) {
    const { username, email } = singupMethods.getValues()
    console.log(data)
    try {
      clearErrors()
      await confirmEmail({
        username,
        email,
        verificationCode: data.verificationCode,
        orgNeeded: true,
      }).unwrap()
      setStep(3)
    } catch (error) {
      console.log("confirmemail error ==>", error)
      setRequestError(parseError(error))
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
        sx={{ mb: 3, color: "gray.800", fontWeight: 700 }}
        variant="h3"
        component="h1"
      >
        {title}
      </Typography>

      {step === 1 && (
        <>
          <Typography
            sx={{
              mb: 2.5,
              color: "gray.600",
              textAlign: "center",
            }}
          >
            Enter the answer for following fields and get started
          </Typography>

          <Stack sx={{ width: "100%" }} onSubmit={submit} component="form">
            <FormInput
              name="username"
              label="Username"
              placeholder="Enter your username for login"
            />

            <FormInput
              name="email"
              label="Email"
              className="my-6"
              placeholder="Enter your valid email address"
            />

            <FormInput
              name="password"
              label="Create Password"
              isPassword
              placeholder="Create your password"
            />

            <FormInput
              name="confirmPassword"
              label="Confirm Password"
              className="mt-6"
              isPassword
              placeholder="Confirm your password"
            />

            <FormCheckbox
              name="terms"
              value="true"
              label="I agree to Terms of service and Privacy policy of AVA"
              className="mt-3"
            />

            <LoadingButton
              sx={{ mt: 4.5 }}
              type="submit"
              loading={isSignupLoading}
            >
              Create account
            </LoadingButton>

            {reqestError && (
              <p className="text-sm text-center text-red-500 mt-3">
                {reqestError}
              </p>
            )}
          </Stack>

          <p className="text-sm text-gray-700 mt-10 text-center">
            Already have an account?{" "}
            <Link
              href={nextLink ? `/?_next=${nextLink}` : "/"}
              className="font-bold text-blue-500"
            >
              Sign In
            </Link>{" "}
            to your account.
          </p>
        </>
      )}

      {step === 2 && (
        <>
          {form?.email && (
            <Typography
              sx={{
                mb: 2.5,
                color: "gray.600",
                textAlign: "center",
              }}
            >
              We have sent you a verification code to {form.email}. Please check
              the code.
            </Typography>
          )}

          <Stack sx={{ width: "100%" }} onSubmit={confirm} component="form">
            <FormInput
              name="verificationCode"
              label="Verification Code"
              placeholder="Enter your verification code"
            />

            <Button
              type="submit"
              className="mt-9"
              loading={isConfirmEmailLoading}
            >
              Confirm
            </Button>
            {reqestError && (
              <p className="text-sm text-center text-red-500 mt-3">
                {reqestError}
              </p>
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
