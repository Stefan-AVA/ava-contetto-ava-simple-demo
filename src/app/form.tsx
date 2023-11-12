"use client"

import { useRouter } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import { FormProvider, useForm } from "react-hook-form"
import { z } from "zod"

import Button from "@/components/button"
import { FormCheckbox } from "@/components/checkbox"
import { FormInput } from "@/components/input"

const schema = z.object({
  email: z
    .string()
    .email("Enter your valid email address")
    .min(1, "Enter your email"),
  password: z.string().min(1, "Enter your password"),
})

type FormSchema = z.infer<typeof schema>

export default function Form() {
  const { replace } = useRouter()

  const methods = useForm<FormSchema>({
    resolver: zodResolver(schema),
  })

  async function submit(data: FormSchema) {
    console.log({ data })

    // Send request to backend.

    replace("/app")
  }

  return (
    <FormProvider {...methods}>
      <form
        onSubmit={methods.handleSubmit(submit)}
        className="flex flex-col w-full"
      >
        <FormInput
          name="email"
          label="Email"
          className="mb-6"
          placeholder="Enter your valid email address"
        />

        <FormInput
          name="password"
          label="Password"
          isPassword
          placeholder="Enter your password"
        />

        <Button type="submit" className="mt-9">
          Sign In
        </Button>
      </form>
    </FormProvider>
  )
}
