"use client"

import { useState } from "react"
import { useInviteContactMutation } from "@/redux/apis/org"
import { parseError } from "@/utils/error"
import { zodResolver } from "@hookform/resolvers/zod"
import { FormProvider, useForm } from "react-hook-form"
import { z } from "zod"

import { IAgentProfile } from "@/types/agentProfile.types"
import { IContact } from "@/types/contact.types"
import Button from "@/components/button"
import { FormInput } from "@/components/input"

const inviteContactSchema = z.object({
  email: z
    .string()
    .email("Enter your valid email address")
    .min(1, "Enter your email"),
})

export type InviteContactSchema = z.infer<typeof inviteContactSchema>

interface IMyContacts {
  me?: IAgentProfile
  contacts: IContact[]
}

const MyContacts = ({ me, contacts = [] }: IMyContacts) => {
  const [reqestError, setRequestError] = useState("")

  const orgMethods = useForm<InviteContactSchema>({
    resolver: zodResolver(inviteContactSchema),
  })

  const [invite, { isLoading }] = useInviteContactMutation()

  const clearErrors = () => {
    orgMethods.clearErrors()
    setRequestError("")
  }

  const onSubmit = async (data: InviteContactSchema) => {
    try {
      clearErrors()

      await invite({
        id: me?.orgId as string,
        email: data.email,
      }).unwrap()
    } catch (error) {
      console.log("Invite error ==>", error)
      setRequestError(parseError(error))
    }
  }

  return (
    <div className="flex flex-col py-5 gap-6">
      <h3 className="font-bold text-lg mb-1">Invite a contact</h3>

      <FormProvider {...orgMethods}>
        <form
          onSubmit={orgMethods.handleSubmit(onSubmit)}
          className="flex flex-col w-full gap-6 max-w-[500px]"
        >
          <FormInput name="email" label="Email" placeholder="Enter the email" />
          <Button type="submit" loading={isLoading}>
            Invite
          </Button>
        </form>
      </FormProvider>

      {reqestError && (
        <p className="text-sm text-center text-red-500 mt-3">{reqestError}</p>
      )}

      <h3 className="font-bold text-lg mb-2 mt-6 pt-6 border-t border-solid border-t-gray-300">
        Contacts
      </h3>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-3 lg:grid-cols-5">
        {contacts.map(({ _id, username }) => (
          <div
            key={_id}
            className="flex items-center p-6 border border-solid border-gray-300 rounded-lg"
          >
            <span className="text-base font-bold capitalize">{username}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

export default MyContacts
