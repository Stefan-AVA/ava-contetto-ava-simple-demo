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

const second = z.object({
  company: z.string().min(1, "Enter your company name"),
  industry: z.string().min(1, "Enter the industry"),
  headCount: z.string().min(1, "Enter the head count"),
  companyAddress: z.string().min(1, "Enter the company address"),
})

const third = z.object({})

const schema = {
  1: first,
  2: second,
  3: third,
}

type FirstFormSchema = z.infer<typeof first>
type SecondFormSchema = z.infer<typeof second>

type FormSchema = FirstFormSchema & SecondFormSchema

export default function Setup() {
  const [step, setStep] = useState(1)

  const methods = useForm<FormSchema>({
    resolver: zodResolver(schema[step as keyof typeof schema]),
  })

  async function submit() {
    const data = methods.getValues()

    if (step <= 2) return setStep((prev) => prev + 1)

    console.log({ data })

    // Send request to backend.
  }

  return (
    <div className="flex flex-col items-center mt-8 w-full">
      <Steps step={step} />

      <div className="flex w-full mt-5 py-14 px-20 flex-col border border-solid border-gray-300 rounded-xl">
        <FormProvider {...methods}>
          <form onSubmit={methods.handleSubmit(submit)}>
            <div className={cn("flex-col", step === 1 ? "flex" : "hidden")}>
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
            </div>

            <div
              className={cn("flex-col gap-6", step === 2 ? "flex" : "hidden")}
            >
              <FormInput
                name="company"
                label="Company Name"
                placeholder="Enter your company name"
              />

              <FormInput
                name="industry"
                label="Industry"
                placeholder="Enter the industry"
              />

              <FormInput
                name="headCount"
                label="Head Count"
                placeholder="Enter the head count"
              />

              <FormInput
                name="companyAddress"
                label="Company Address (Optional)"
                placeholder="Enter the company address"
              />
            </div>

            <div className={cn(step === 3 ? "flex" : "hidden")}>
              <p className="text-gray-800">
                I agree to the Terms of Service and Privacy Policy of the
                Realvault platform to start using it.
              </p>
            </div>

            <Button type="submit" className="mt-12 w-full">
              {step === 3 ? "Confirm" : "Next"}
            </Button>
          </form>
        </FormProvider>
      </div>
    </div>
  )
}
