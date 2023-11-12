"use client"

import { useState } from "react"
import { cn } from "@/utils/classname"
import { zodResolver } from "@hookform/resolvers/zod"
import { FormProvider, useForm } from "react-hook-form"
import { z } from "zod"

import { FormUpload } from "@/components/upload"

import Steps from "./steps"

const first = z.object({
  avatar: z.custom<FileList>(),
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
  }

  return (
    <div className="flex flex-col items-center mt-8 w-full">
      <Steps step={step} />

      <div className="flex w-full mt-5 py-14 px-20 flex-col border border-solid border-r-gray-300 rounded-xl">
        <FormProvider {...methods}>
          <form onSubmit={methods.handleSubmit(submit)}>
            <FormUpload name="avatar" />
          </form>
        </FormProvider>
      </div>
    </div>
  )
}
