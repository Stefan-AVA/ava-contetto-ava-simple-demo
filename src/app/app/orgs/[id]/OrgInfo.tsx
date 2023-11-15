"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useCreateOrgMutation, useUpdateOrgMutation } from "@/redux/apis/org"
import { parseError } from "@/utils/error"
import { zodResolver } from "@hookform/resolvers/zod"
import { FormProvider, useForm } from "react-hook-form"
import { z } from "zod"

import { AgentRole } from "@/types/agentProfile.types"
import { IOrg } from "@/types/org.types"
import Button from "@/components/button"
import { FormInput } from "@/components/input"

const orgSchema = z.object({
  name: z.string().min(1, "Enter name"),
})

export type OrgSchema = z.infer<typeof orgSchema>

interface IOrgInfo {
  org?: IOrg
  role?: AgentRole
  isCreate?: boolean
}

const OrgInfo = ({ org, role, isCreate = false }: IOrgInfo) => {
  const { push } = useRouter()
  const [reqestError, setRequestError] = useState("")

  const orgMethods = useForm<OrgSchema>({
    resolver: zodResolver(orgSchema),
    values: {
      name: org?.name || "",
    },
  })

  const [updateOrg, { isLoading: isUpdateLoading }] = useUpdateOrgMutation()
  const [createOrg, { isLoading: isCreateLoading }] = useCreateOrgMutation()

  const clearErrors = () => {
    orgMethods.clearErrors()
    setRequestError("")
  }

  const onSubmit = async (data: OrgSchema) => {
    try {
      clearErrors()
      if (!isCreate && org) {
        // update org
        await updateOrg({ ...org, name: data.name }).unwrap()
      }
      if (isCreate) {
        const res = await createOrg({ name: data.name }).unwrap()
        push(`/app/orgs/${res.orgId}`)
      }
    } catch (error) {
      console.log("org submit error ==>", error)
      setRequestError(parseError(error))
    }
  }

  return (
    <div className="flex flex-col py-5 max-w-[500px]">
      <FormProvider {...orgMethods}>
        <form
          onSubmit={orgMethods.handleSubmit(onSubmit)}
          className="flex flex-col w-full gap-6"
        >
          <FormInput
            name="name"
            label="Organization Name"
            placeholder="Enter organization name"
            disabled={!isCreate && role !== AgentRole.owner}
          />
          {!isCreate && role === AgentRole.owner && (
            <Button type="submit" loading={isUpdateLoading}>
              Update
            </Button>
          )}
          {isCreate && (
            <Button type="submit" loading={isCreateLoading}>
              Create a new Organization
            </Button>
          )}
          {reqestError && (
            <p className="text-sm text-center text-red-500 mt-3">
              {reqestError}
            </p>
          )}
        </form>
      </FormProvider>
    </div>
  )
}

export default OrgInfo
