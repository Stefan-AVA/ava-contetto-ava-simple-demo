"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import LoginLayout from "@/layouts/LoginLayout"
import {
  useForgotPasswordConfirmMutation,
  useForgotPasswordMutation,
} from "@/redux/apis/auth"
import { parseError } from "@/utils/error"
import { zodResolver } from "@hookform/resolvers/zod"
import Background from "~/assets/signup-background.jpg"
import { FormProvider, useForm } from "react-hook-form"
import { z } from "zod"

import Button from "@/components/button"
import { FormInput } from "@/components/input"

const forgotPasswordSchema = z.object({
  email: z
    .string()
    .email("Enter your valid email address")
    .min(1, "Enter your email"),
})

const confirmForgotPasswordSchema = z
  .object({
    verificationCode: z.string().min(4, "Enter your username"),
    password: z.string().min(8, "The password must contain at least 8 digits"),
    confirmPassword: z.string().min(1, "Confirm your password"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    path: ["confirmPassword"],
    message: "Passwords are not the same",
  })
export type ForgotPasswordFormSchema = z.infer<typeof forgotPasswordSchema>
export type ConfirmForgotPasswordFormSchema = z.infer<
  typeof confirmForgotPasswordSchema
>

const ForgotPasswordPage = () => {
  const [reqestError, setRequestError] = useState("")
  const [step, setStep] = useState(1)

  const forgotPasswordMethods = useForm<ForgotPasswordFormSchema>({
    resolver: zodResolver(forgotPasswordSchema),
  })
  const confirmForgotPasswordMethods = useForm<ConfirmForgotPasswordFormSchema>(
    {
      resolver: zodResolver(confirmForgotPasswordSchema),
    }
  )

  const [forgotPassword, { isLoading: isForgotPasswordLoading }] =
    useForgotPasswordMutation()
  const [forgotPasswordConfirm, { isLoading: isConfirmLoading }] =
    useForgotPasswordConfirmMutation()

  const clearErrors = () => {
    forgotPasswordMethods.clearErrors()
    confirmForgotPasswordMethods.clearErrors()
    setRequestError("")
  }

  const onSignup = async (data: ForgotPasswordFormSchema) => {
    try {
      clearErrors()
      await forgotPassword(data).unwrap()
      setStep(2)
    } catch (error) {
      console.log("forgotPassword error ==>", error)
      setRequestError(parseError(error))
    }
  }

  const onConfirm = async (data: ConfirmForgotPasswordFormSchema) => {
    const { email } = forgotPasswordMethods.getValues()
    try {
      clearErrors()
      await forgotPasswordConfirm({
        email,
        verificationCode: data.verificationCode,
        password: data.password,
      }).unwrap()
      setStep(3)
    } catch (error) {
      console.log("confirmemail error ==>", error)
      setRequestError(parseError(error))
    }
  }

  return (
    <LoginLayout>
      <div className="flex flex-col min-h-screen h-full lg:flex-row">
        <Image
          src={Background}
          alt=""
          className="w-full h-96 object-cover lg:h-full lg:min-h-screen lg:w-1/2"
        />

        <div className="flex px-6 py-10 flex-col items-center w-full md:p-20 lg:w-1/2 2xl:px-40">
          {step === 1 && (
            <>
              <h1 className="text-3xl font-bold text-gray-800">
                Forgot Password
              </h1>

              <p className="text-md text-gray-600 mt-5">
                Please enter your email. We will send you a verification code
              </p>

              <FormProvider {...forgotPasswordMethods}>
                <form
                  onSubmit={forgotPasswordMethods.handleSubmit(onSignup)}
                  className="flex flex-col w-full"
                >
                  <FormInput
                    name="email"
                    label="Email"
                    className="my-6"
                    placeholder="Enter your valid email address"
                  />

                  <Button
                    type="submit"
                    className="mt-9"
                    loading={isForgotPasswordLoading}
                  >
                    Send email
                  </Button>
                  {reqestError && (
                    <p className="text-sm text-center text-red-500 mt-3">
                      {reqestError}
                    </p>
                  )}
                </form>
              </FormProvider>
            </>
          )}

          {step === 2 && (
            <>
              <h1 className="text-3xl font-bold text-gray-800">
                Forgot Password
              </h1>

              <p className="text-md mt-1 text-gray-600 mb-5">
                We have sent you a verification code to{" "}
                {forgotPasswordMethods.getValues().email}. Please check the
                code.
              </p>

              <FormProvider {...confirmForgotPasswordMethods}>
                <form
                  onSubmit={confirmForgotPasswordMethods.handleSubmit(
                    onConfirm
                  )}
                  className="flex flex-col w-full"
                >
                  <FormInput
                    name="verificationCode"
                    label="Verification Code"
                    placeholder="Enter your verification code"
                  />

                  <FormInput
                    name="password"
                    label="New Password"
                    className="mt-6"
                    isPassword
                    placeholder="New password"
                  />

                  <FormInput
                    name="confirmPassword"
                    label="Confirm Password"
                    className="mt-6"
                    isPassword
                    placeholder="Confirm your password"
                  />

                  <Button
                    type="submit"
                    className="mt-9"
                    loading={isConfirmLoading}
                  >
                    Confirm
                  </Button>
                  {reqestError && (
                    <p className="text-sm text-center text-red-500 mt-3">
                      {reqestError}
                    </p>
                  )}
                </form>
              </FormProvider>
            </>
          )}

          {step === 3 && (
            <>
              <h1 className="text-3xl font-bold text-gray-800">
                Password updated
              </h1>

              <p className="text-gray-700 mt-10 text-center">
                Please{" "}
                <Link href="/" className="font-bold text-blue-500">
                  Sign In
                </Link>{" "}
                to your account.
              </p>
            </>
          )}
        </div>
      </div>
    </LoginLayout>
  )
}

export default ForgotPasswordPage
