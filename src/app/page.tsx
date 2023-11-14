"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import LoginLayout from "@/layouts/LoginLayout"
import { useLoginMutation } from "@/redux/apis/auth"
import { parseError } from "@/utils/error"
import { zodResolver } from "@hookform/resolvers/zod"
import Background from "~/assets/signup-background.jpg"
import { FormProvider, useForm } from "react-hook-form"
import { z } from "zod"

import Button from "@/components/button"
import { FormInput } from "@/components/input"

const schema = z.object({
  username: z.string().min(1, "Enter your username"),
  password: z.string().min(1, "Enter your password"),
})

export type LoginFormSchema = z.infer<typeof schema>

const LoginPage = () => {
  const { push } = useRouter()
  const searchParams = useSearchParams()
  const nextLink = searchParams.get("_next")

  const [reqestError, setRequestError] = useState("")

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
      <div className="flex flex-col min-h-screen h-full lg:flex-row">
        <Image
          src={Background}
          alt=""
          className="w-full h-96 object-cover lg:h-full lg:min-h-screen lg:w-1/2"
        />
        <div className="flex px-6 py-10 flex-col items-center w-full md:p-20 lg:w-1/2 2xl:px-40">
          <h1 className="text-3xl font-bold text-gray-800 mb-5">
            Login to your account
          </h1>

          <FormProvider {...methods}>
            <form
              onSubmit={methods.handleSubmit(submit)}
              className="flex flex-col w-full"
            >
              <FormInput
                name="username"
                label="Username"
                className="mb-6"
                placeholder="Enter your username"
              />

              <FormInput
                name="password"
                label="Password"
                isPassword
                placeholder="Enter your password"
              />
              <p className="text-sm text-gray-700 mt-3">
                <Link
                  href={
                    nextLink
                      ? `/forgot-password?_next=${nextLink}`
                      : "/forgot-password"
                  }
                  className="font-bold text-blue-500"
                >
                  Forgot password?
                </Link>
              </p>

              <Button type="submit" className="mt-9" loading={isLoading}>
                Sign In
              </Button>

              {reqestError && (
                <p className="text-sm text-center text-red-500 mt-3">
                  {reqestError}
                </p>
              )}
            </form>
          </FormProvider>

          <p className="text-sm text-gray-700 mt-10 text-center">
            {"Don't have an account? "}
            <Link
              href={nextLink ? `/signup?_next=${nextLink}` : "/signup"}
              className="font-bold text-blue-500"
            >
              Sign up
            </Link>{" "}
            your account.
          </p>
        </div>
      </div>
    </LoginLayout>
  )
}

export default LoginPage
