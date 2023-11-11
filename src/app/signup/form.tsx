"use client"

import { FormProvider, useForm } from "react-hook-form"

import { FormInput } from "@/components/input"

export default function Form() {
  const methods = useForm()

  async function submit() {
    //
  }

  return (
    <FormProvider {...methods}>
      <form
        onSubmit={methods.handleSubmit(submit)}
        className="flex flex-col w-full"
      >
        <FormInput name="name" label="Full Name" />

        <FormInput name="email" label="Email" className="my-6" />

        <FormInput name="password" label="Create Password" />

        <FormInput
          name="confirmPassword"
          label="Confirm Password"
          className="mt-6"
        />
      </form>
    </FormProvider>
  )
}
