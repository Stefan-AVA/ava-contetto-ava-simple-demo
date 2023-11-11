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
      <form onSubmit={methods.handleSubmit(submit)}>
        <FormInput name="name" label="Full Name" />

        <FormInput name="email" label="Email" />

        <FormInput name="password" label="Create Password" />

        <FormInput name="confirmPassword" label="Confirm Password" />
      </form>
    </FormProvider>
  )
}
