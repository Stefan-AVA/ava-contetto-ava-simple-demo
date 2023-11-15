"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import secrets from "@/constants/secrets"
import { cn } from "@/utils/classname"
import { zodResolver } from "@hookform/resolvers/zod"
import { FormProvider, useForm } from "react-hook-form"
import { z } from "zod"

import Button from "@/components/button"
import { FormInput } from "@/components/input"
import { FormPhoneInput } from "@/components/phone-input"
import { FormSelect, schema as selectSchema } from "@/components/select"
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
  industry: selectSchema("Select the industry"),
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

  const { replace } = useRouter()

  const methods = useForm<FormSchema>({
    resolver: zodResolver(schema[step as keyof typeof schema]),
  })

  useEffect(() => {
    if (window !== undefined) {
      const fullName = sessionStorage.getItem(secrets.fullName)

      if (fullName) methods.setValue("name", fullName)
    }
  }, [methods])

  async function submit() {
    const data = methods.getValues()

    if (step <= 2) return setStep((prev) => prev + 1)

    console.log({ data })

    // Send request to backend.

    replace("/app")
  }

  return (
    <div className="flex flex-col items-center mt-8 w-full">
      <Steps step={step} />

      <div className="flex w-full mt-5 py-12 px-6 flex-col border border-solid border-gray-300 rounded-xl md:py-14 md:px-20">
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

              <FormSelect
                name="industry"
                label="Industry"
                options={[
                  { value: "industry-1", label: "Industry 1" },
                  { value: "industry-2", label: "Industry 2" },
                  { value: "industry-3", label: "Industry 3" },
                ]}
                placeholder="Enter the industry"
              />

              <FormInput
                name="headCount"
                type="number"
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
                I agree to the Terms of Service and Privacy Policy of the AVA
                platform to start using it.
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
