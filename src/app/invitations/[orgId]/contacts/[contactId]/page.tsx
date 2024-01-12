"use client"

import { useEffect, useMemo, useRef, useState, type FormEvent } from "react"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { useLazyGetMeQuery } from "@/redux/apis/auth"
import { useBindContactMutation } from "@/redux/apis/org"
import formatErrorZodMessage from "@/utils/format-error-zod"
import { LoadingButton } from "@mui/lab"
import {
  Box,
  Checkbox,
  FormControlLabel,
  FormHelperText,
  Stack,
  TextField,
  Typography,
} from "@mui/material"
import Logo from "~/assets/logo-ava.png"
import { z } from "zod"

const loginSchema = z.object({
  username: z.string().min(1, "Enter your username"),
  password: z.string().min(1, "Enter your password"),
})

const signupSchema = z
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

const initialFormLogin = {
  username: "",
  password: "",
}

const initialFormSignup = {
  email: "",
  terms: false,
  username: "",
  password: "",
  confirmPassword: "",
  verificationCode: "",
}

export type LoginFormSchema = z.infer<typeof loginSchema>
export type SignupFormSchema = z.infer<typeof signupSchema>
export type ConfirmEmailFormSchema = z.infer<typeof confirmEmailSchema>

type FormError = Partial<LoginFormSchema> &
  Partial<Record<keyof SignupFormSchema, string>> &
  Partial<ConfirmEmailFormSchema> & {
    request?: string
  }

type PageProps = {
  params: {
    orgId: string
    contactId: string
  }

  searchParams: {
    inviteCode: string
  }
}

export default function Page({ params, searchParams }: PageProps) {
  const [step, setStep] = useState(1)
  const [type, setType] = useState<"LOGIN" | "SIGNUP">("LOGIN")
  const [errors, setErrors] = useState<FormError | null>(null)
  const [formLogin, setFormLogin] = useState<LoginFormSchema>(initialFormLogin)
  const [formSignup, setFormSignup] =
    useState<SignupFormSchema>(initialFormSignup)

  const initialized = useRef(false)

  const { push, replace } = useRouter()

  const inviteCode = searchParams.inviteCode
  const orgId = params.orgId
  const contactId = params.contactId

  const [getme, { isLoading: getMeLoading }] = useLazyGetMeQuery()
  const [bindContact, { isLoading: bindLoading }] = useBindContactMutation()

  const isLoading = getMeLoading || bindLoading

  useEffect(() => {
    if (!orgId || !contactId || !inviteCode) replace("/")
  }, [orgId, contactId, inviteCode, replace])

  useEffect(() => {
    async function run() {
      if (!initialized.current) {
        initialized.current = true

        try {
          await getme().unwrap()

          if (orgId && contactId && inviteCode) {
            try {
              const contact = await bindContact({
                _id: contactId,
                orgId,
                inviteCode,
              }).unwrap()
              push(`/app/contact-orgs/${contact._id}`)
            } catch (error) {
              push("/app")
            }
          }
        } catch (error) {
          replace(
            orgId && contactId && inviteCode
              ? `/?_next=/invitations/${orgId}/contacts/${contactId}?inviteCode=${inviteCode}`
              : "/"
          )
        }
      }
    }

    run()
  }, [inviteCode, getme, push, replace, orgId, bindContact, contactId])

  const title = useMemo(() => {
    if (type === "LOGIN") return "Login to your account"

    if (step === 2) return "Check Your Inbox"

    if (step === 3) return "Email verified"

    return "Create your account"
  }, [type, step])

  if (!orgId || !contactId || !inviteCode) return <div>No invitation</div>
  if (isLoading) return <div>Loading...</div>

  const submit = {
    login: (e: FormEvent<HTMLFormElement>) => {
      e.preventDefault()

      setErrors(null)

      const response = loginSchema.safeParse(formLogin)

      if (!response.success) {
        const error = formatErrorZodMessage<LoginFormSchema>(response.error)

        setErrors(error)

        return
      }

      console.log({ formLogin })
    },

    signup: (e: FormEvent<HTMLFormElement>) => {
      e.preventDefault()

      setErrors(null)

      if (!formSignup.terms) {
        setErrors((prev) => ({ ...prev, terms: "Accept the terms of use" }))

        return
      }

      const response = signupSchema.safeParse(formSignup)

      if (!response.success) {
        const error = formatErrorZodMessage<Partial<FormError>>(response.error)

        setErrors(error)

        return
      }

      setStep(2)
    },

    confirm: (e: FormEvent<HTMLFormElement>) => {
      e.preventDefault()

      setErrors(null)

      const response = confirmEmailSchema.safeParse(formSignup)

      if (!response.success) {
        const error = formatErrorZodMessage<FormError>(response.error)

        setErrors(error)

        return
      }

      setStep(3)
    },
  }

  return (
    <Stack sx={{ m: "auto", py: 10, maxWidth: "36rem" }}>
      <Typography sx={{ fontWeight: 700, textAlign: "center" }} variant="h5">
        You`ve been invited to interact with (Organization Name) <br />
        Sign in or create your profile now. It`s Free! 🎉
      </Typography>

      <Box
        sx={{ mt: 5, mb: 2, mx: "auto", height: "5rem", objectFit: "contain" }}
        src={Logo}
        alt="Logo Ava"
        component={Image}
      />

      <Typography
        sx={{ mb: 3, fontWeight: 700, textAlign: "center" }}
        variant="h3"
        component="h1"
      >
        {title}
      </Typography>

      {type === "LOGIN" && (
        <>
          <Stack
            sx={{ width: "100%" }}
            onSubmit={submit.login}
            component="form"
          >
            <TextField
              sx={{ mb: 3 }}
              label="Username"
              error={!!errors?.username}
              onChange={({ target }) =>
                setFormLogin((prev) => ({ ...prev, username: target.value }))
              }
              helperText={errors?.username}
            />

            <TextField
              type="password"
              label="Password"
              error={!!errors?.password}
              onChange={({ target }) =>
                setFormLogin((prev) => ({ ...prev, password: target.value }))
              }
              helperText={errors?.password}
            />

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
            {"Don't have an account?"}
            <Typography
              sx={{ color: "blue.500", fontWeight: 700 }}
              variant="body2"
              onClick={() => setType("SIGNUP")}
              component="button"
            >
              Sign up
            </Typography>
            your account.
          </Typography>
        </>
      )}

      {type === "SIGNUP" && (
        <>
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

              <Stack
                sx={{ width: "100%" }}
                onSubmit={submit.signup}
                component="form"
              >
                <TextField
                  label="Username"
                  error={!!errors?.username}
                  onChange={({ target }) =>
                    setFormSignup((prev) => ({
                      ...prev,
                      username: target.value,
                    }))
                  }
                  helperText={errors?.username}
                />

                <TextField
                  sx={{ my: 3 }}
                  label="Email"
                  error={!!errors?.email}
                  onChange={({ target }) =>
                    setFormSignup((prev) => ({ ...prev, email: target.value }))
                  }
                  helperText={errors?.email}
                />

                <TextField
                  type="password"
                  label="Create Password"
                  error={!!errors?.password}
                  onChange={({ target }) =>
                    setFormSignup((prev) => ({
                      ...prev,
                      password: target.value,
                    }))
                  }
                  helperText={errors?.password}
                />

                <TextField
                  sx={{ mt: 3 }}
                  type="password"
                  label="Confirm Password"
                  error={!!errors?.confirmPassword}
                  onChange={({ target }) =>
                    setFormSignup((prev) => ({
                      ...prev,
                      confirmPassword: target.value,
                    }))
                  }
                  helperText={errors?.confirmPassword}
                />

                <FormControlLabel
                  sx={{ mt: 1 }}
                  label="I agree to Terms of service and Privacy policy of AVA"
                  control={
                    <Checkbox
                      onChange={({ target }) =>
                        setFormSignup((prev) => ({
                          ...prev,
                          terms: target.checked,
                        }))
                      }
                    />
                  }
                />

                {errors?.terms && (
                  <FormHelperText error>{errors.terms}</FormHelperText>
                )}

                <LoadingButton sx={{ mt: 4.5 }} type="submit">
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
                Already have an account?
                <Typography
                  sx={{ color: "blue.500", fontWeight: 700 }}
                  onClick={() => setType("LOGIN")}
                  variant="body2"
                  component="button"
                >
                  Sign In
                </Typography>
                to your account.
              </Typography>
            </>
          )}

          {step === 2 && (
            <>
              {formSignup?.email && (
                <Typography
                  sx={{
                    mb: 4,
                    color: "gray.600",
                    textAlign: "center",
                  }}
                >
                  We have sent you a verification code to {formSignup.email}.
                  Please check the code.
                </Typography>
              )}

              <Stack
                sx={{ width: "100%" }}
                onSubmit={submit.confirm}
                component="form"
              >
                <TextField
                  label="Verification Code"
                  error={!!errors?.verificationCode}
                  onChange={({ target }) =>
                    setFormSignup((prev) => ({
                      ...prev,
                      verificationCode: target.value,
                    }))
                  }
                  helperText={errors?.verificationCode}
                />

                <LoadingButton sx={{ mt: 4.5 }} type="submit">
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
                Your account is now verified. Please
                <Typography
                  sx={{ color: "blue.500", fontWeight: 700 }}
                  onClick={() => setType("LOGIN")}
                  component="button"
                >
                  Sign In
                </Typography>
                to your account.
              </Typography>
            </>
          )}
        </>
      )}
    </Stack>
  )
}
