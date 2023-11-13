"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import LoginLayout from "@/layouts/LoginLayout"
import { useConfirmEmailMutation, useSignupMutation } from "@/redux/apis/auth"
import { parseError } from "@/utils/error"
import { zodResolver } from "@hookform/resolvers/zod"
import Background from "~/assets/signup-background.jpg"
import { FormProvider, useForm } from "react-hook-form"
import { z } from "zod"

import Button from "@/components/button"
import { FormCheckbox } from "@/components/checkbox"
import { FormInput } from "@/components/input"

const singupSchema = z
  .object({
    username: z.string().min(1, "Enter your username"),
    terms: z
      .enum(["true"], {
        invalid_type_error: "Accept the terms of use",
      })
      .transform((value) => value === "true"),
    email: z
      .string()
      .email("Enter your valid email address")
      .min(1, "Enter your email"),
    password: z.string().min(8, "The password must contain at least 8 digits"),
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

const SignupPage = () => {
  const [reqestError, setRequestError] = useState("")
  const [step, setStep] = useState(1)

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

  const onSignup = async (data: SingupFormSchema) => {
    try {
      clearErrors()
      await signup(data).unwrap()
      setStep(2)
    } catch (error) {
      console.log("signup error ==>", error)
      setRequestError(parseError(error))
    }
  }

  const onConfirm = async (data: ConfirmEmailFormSchema) => {
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

  return (
    <LoginLayout>
      <div className="flex flex-col min-h-screen h-full lg:h-screen lg:flex-row">
        <Image
          src={Background}
          alt=""
          className="w-full h-96 object-cover lg:h-full lg:w-1/2"
        />

        <div className="flex px-6 py-10 flex-col items-center w-full overflow-y-auto md:p-20 lg:w-1/2 2xl:px-40 lg:h-screen">
          {step === 1 && (
            <>
              <h1 className="text-3xl font-bold text-gray-800">
                Create your account
              </h1>

              <p className="text-md mt-1 text-gray-600 mb-5">
                Enter the answer for following fields and get started
              </p>

              <FormProvider {...singupMethods}>
                <form
                  onSubmit={singupMethods.handleSubmit(onSignup)}
                  className="flex flex-col w-full"
                >
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
                    label="I agree to Terms of service and Privacy policy of RealVault"
                    className="mt-3"
                  />

                  <Button
                    type="submit"
                    className="mt-9"
                    loading={isSignupLoading}
                  >
                    Create account
                  </Button>
                  {reqestError && (
                    <p className="text-sm text-center text-red-500 mt-3">
                      {reqestError}
                    </p>
                  )}
                </form>
              </FormProvider>

              <p className="text-sm text-gray-700 mt-10 text-center">
                Already have an account?{" "}
                <Link href="/" className="font-bold text-blue-500">
                  Sign In
                </Link>{" "}
                to your account.
              </p>
            </>
          )}

          {step === 2 && (
            <>
              <h1 className="text-3xl font-bold text-gray-800">
                Check Your Inbox
              </h1>

              <p className="text-md mt-1 text-gray-600 mb-5">
                We have sent you a verification code to{" "}
                {singupMethods.getValues().email}. Please check the code.
              </p>

              <FormProvider {...confirmEmailMethods}>
                <form
                  onSubmit={confirmEmailMethods.handleSubmit(onConfirm)}
                  className="flex flex-col w-full"
                >
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
                </form>
              </FormProvider>
            </>
          )}

          {step === 3 && (
            <>
              <h1 className="text-3xl font-bold text-gray-800">
                Email verified
              </h1>

              <p className="text-gray-700 mt-10 text-center">
                Your account is now verified. Please{" "}
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

export default SignupPage
