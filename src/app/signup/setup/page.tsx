"use client"

import { useState } from "react"
import { cn } from "@/utils/classname"
import { zodResolver } from "@hookform/resolvers/zod"
import { FormProvider, useForm } from "react-hook-form"
import { z } from "zod"

import Button from "@/components/button"
import { FormInput } from "@/components/input"
import { FormPhoneInput } from "@/components/phone-input"
import { FormUpload } from "@/components/upload"

import Steps from "./steps"

const first = z.object({
  name: z.string().min(1, "Enter your full name"),
  phone: z.string().min(1, "Enter your phone number"),
  avatar: z.custom<FileList>(),
  country: z.string().min(1, "Enter your country"),
  username: z.string().min(1, "Enter your user name"),
})

const schema = {
  1: first,
}

type FirstFormSchema = z.infer<typeof first>

type FormSchema = FirstFormSchema

export default function Setup() {
  const [step, setStep] = useState(1)

  const methods = useForm<FormSchema>({
    resolver: zodResolver(schema[step as keyof typeof schema]),
  })

  async function submit(data: FormSchema) {
    console.log({ data })

    setStep((prev) => prev + 1)
  }

  return (
    <div className="flex flex-col items-center mt-8 w-full">
      <Steps step={step} />

      <div className="flex w-full mt-5 py-14 px-20 flex-col border border-solid border-gray-300 rounded-xl">
        <FormProvider {...methods}>
          <form onSubmit={methods.handleSubmit(submit)}>
            <FormUpload name="avatar" className="mx-auto" />

            <FormInput
              name="username"
              label="User Name"
              className="mt-7 mb-6"
              placeholder="Enter your user name"
            />

            <FormInput
              name="name"
              label="Full Name"
              placeholder="Enter your full name"
            />

            <FormPhoneInput
              name="phone"
              label="Phone Number"
              className="my-6"
              placeholder="Enter your phone number"
            />

            <FormInput
              name="country"
              label="Country"
              placeholder="Enter your country"
            />

            <Button type="submit" className="mt-12 w-full">
              Next
            </Button>
          </form>
        </FormProvider>
      </div>
    </div>
  )
}
