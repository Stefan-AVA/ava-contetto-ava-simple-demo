"use client"

import { useState } from "react"
import { usePostMeMutation } from "@/redux/apis/auth"
import { setUser } from "@/redux/slices/app"
import { RootState, useAppDispatch } from "@/redux/store"
import { parseError } from "@/utils/error"
import { zodResolver } from "@hookform/resolvers/zod"
import { FormProvider, useForm } from "react-hook-form"
import { useSelector } from "react-redux"
import { z } from "zod"

import { IUser } from "@/types/user.types"
import Button from "@/components/button"
import { FormInput } from "@/components/input"

// import { FormPhoneInput } from "@/components/phone-input"
// import { FormUpload } from "@/components/upload"

const schema = z.object({
  name: z.string().min(1, "Enter your full name"),
  // phone: z.string().min(1, "Enter your phone number"),
  // avatar: z.custom<FileList>(),
  // country: z.string().min(1, "Enter your country"),
})

export type ProfileFormSchema = z.infer<typeof schema>

const Page = () => {
  const dispatch = useAppDispatch()

  const [reqestError, setRequestError] = useState("")

  const user = useSelector((state: RootState) => state.app.user)

  const methods = useForm<ProfileFormSchema>({
    resolver: zodResolver(schema),
    values: {
      name: user?.name || "",
    },
  })

  const [updateProfile, { isLoading }] = usePostMeMutation()

  const clearErrors = () => {
    methods.clearErrors()
    setRequestError("")
  }

  const submit = async (data: ProfileFormSchema) => {
    try {
      clearErrors()
      const updatedUser = await updateProfile({
        ...(user as IUser),
        name: data.name,
      }).unwrap()

      dispatch(setUser(updatedUser))
    } catch (error) {
      console.log("signup error ==>", error)
      setRequestError(parseError(error))
    }
  }

  return (
    <div className="flex flex-col items-center w-full">
      <div className="flex w-full max-w-[500px] flex-col">
        <FormProvider {...methods}>
          <form onSubmit={methods.handleSubmit(submit)}>
            {/* <FormUpload name="avatar" className="mx-auto" /> */}

            <FormInput
              name="username"
              label="Username"
              className="mt-7 mb-6"
              disabled
              value={user?.username || ""}
            />

            <FormInput
              name="name"
              label="Display Name"
              className="mt-7 mb-6"
              placeholder="Enter your name"
            />

            <Button type="submit" className="mt-12 w-full" loading={isLoading}>
              Submit
            </Button>
          </form>
        </FormProvider>
      </div>
    </div>
  )
}

export default Page
