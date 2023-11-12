"use client"

import { useRouter } from "next/navigation"
import secrets from "@/constants/secrets"
import { zodResolver } from "@hookform/resolvers/zod"
import { FormProvider, useForm } from "react-hook-form"
import { z } from "zod"

import Button from "@/components/button"
import { FormCheckbox } from "@/components/checkbox"
import { FormInput } from "@/components/input"

const schema = z
  .object({
    name: z.string().min(1, "Enter your full name"),
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

type FormSchema = z.infer<typeof schema>

export default function Form() {
  const { replace } = useRouter()

  const methods = useForm<FormSchema>({
    resolver: zodResolver(schema),
  })

  async function submit(data: FormSchema) {
    console.log({ data })

    sessionStorage.setItem(secrets.fullName, data.name)

    // Send request to backend.

    replace("/signup/setup")
  }

  return (
    <FormProvider {...methods}>
      <form
        onSubmit={methods.handleSubmit(submit)}
        className="flex flex-col w-full"
      >
        <FormInput
          name="name"
          label="Full Name"
          placeholder="Enter your full name"
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

        <Button type="submit" className="mt-9">
          Create account
        </Button>
      </form>
    </FormProvider>
  )
}
