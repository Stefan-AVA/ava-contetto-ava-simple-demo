"use client"

import { useState } from "react"
import { useInviteAgentMutation } from "@/redux/apis/org"
import { parseError } from "@/utils/error"
import { zodResolver } from "@hookform/resolvers/zod"
import { FormProvider, useForm } from "react-hook-form"
import { z } from "zod"

import { AgentRole, IAgentProfile } from "@/types/agentProfile.types"
import Button from "@/components/button"
import { FormInput } from "@/components/input"
import { FormSelect, schema as selectSchema } from "@/components/select"

const inviteAgentSchema = z.object({
  email: z
    .string()
    .email("Enter your valid email address")
    .min(1, "Enter your email"),
  role: selectSchema("Select a role"),
})

export type InviteAgentSchema = z.infer<typeof inviteAgentSchema>

interface IOrgMembers {
  me?: IAgentProfile
  members: IAgentProfile[]
}

const OrgMembers = ({ me, members = [] }: IOrgMembers) => {
  const [reqestError, setRequestError] = useState("")

  const orgMethods = useForm<InviteAgentSchema>({
    resolver: zodResolver(inviteAgentSchema),
  })

  const [invite, { isLoading }] = useInviteAgentMutation()

  const clearErrors = () => {
    orgMethods.clearErrors()
    setRequestError("")
  }

  const onSubmit = async (data: InviteAgentSchema) => {
    try {
      clearErrors()

      await invite({
        id: me?.orgId as string,
        email: data.email,
        role: data.role.value,
      }).unwrap()
    } catch (error) {
      console.log("Invite error ==>", error)
      setRequestError(parseError(error))
    }
  }

  return (
    <div className="flex flex-col py-5 max-w-[500px]">
      {(me?.role === AgentRole.owner || me?.role === AgentRole.admin) && (
        <>
          <h3 className="font-bold text-lg mb-1">Invite a member</h3>
          <FormProvider {...orgMethods}>
            <form
              onSubmit={orgMethods.handleSubmit(onSubmit)}
              className="flex flex-col w-full gap-3"
            >
              <FormInput
                name="email"
                label="Email"
                placeholder="Enter the email"
              />
              <FormSelect
                name="role"
                label="Role"
                options={
                  me.role === AgentRole.owner
                    ? [
                        {
                          value: AgentRole.admin,
                          label: AgentRole.admin,
                        },
                        {
                          value: AgentRole.agent,
                          label: AgentRole.agent,
                        },
                      ]
                    : [
                        {
                          value: AgentRole.agent,
                          label: AgentRole.agent,
                        },
                      ]
                }
                placeholder="Select a role"
              />
              <Button type="submit" loading={isLoading}>
                Invite
              </Button>
            </form>
          </FormProvider>
          {reqestError && (
            <p className="text-sm text-center text-red-500 mt-3">
              {reqestError}
            </p>
          )}
        </>
      )}

      <h3 className="font-bold text-lg mb-1 mt-5">Members</h3>
      <div className="flex flex-col gap-3">
        {members.map(({ _id, username, role }) => (
          <div key={_id} className="flex items-center">
            <span className="text-base font-bold capitalize">{username}</span>
            <span className="text-xs ml-2">({role})</span>
            {username === me?.username && (
              <span className="text-xs ml-2">You</span>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

export default OrgMembers
