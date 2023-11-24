"use client"

import { useEffect, useRef } from "react"
import { useRouter } from "next/navigation"
import { useLazyGetMeQuery } from "@/redux/apis/auth"
import { useBindContactMutation } from "@/redux/apis/org"

type PageProps = {
  params: {
    orgId: string
    contactId: string
  }

  searchParams: {
    inviteCode: string
  }
}

const Page = ({ params, searchParams }: PageProps) => {
  const initialized = useRef(false)

  const { push, replace } = useRouter()

  const inviteCode = searchParams.inviteCode
  const orgId = params.orgId
  const contactId = params.contactId

  const [getme, { isLoading: getMeLoading }] = useLazyGetMeQuery()
  const [bindContact, { isLoading: bindLoading }] = useBindContactMutation()

  const isLoading = getMeLoading || bindLoading

  useEffect(() => {
    if (!orgId || !contactId || !inviteCode) replace("/")
  }, [orgId, contactId, inviteCode, replace])

  useEffect(() => {
    async function run() {
      if (!initialized.current) {
        initialized.current = true

        try {
          await getme().unwrap()

          if (orgId && contactId && inviteCode) {
            try {
              const contact = await bindContact({
                _id: contactId,
                orgId,
                inviteCode,
              }).unwrap()
              push(`/app/contact-orgs/${contact._id}`)
            } catch (error) {
              push("/app")
            }
          }
        } catch (error) {
          replace(
            orgId && contactId && inviteCode
              ? `/?_next=/invitations/${orgId}/contacts/${contactId}?inviteCode=${inviteCode}`
              : "/"
          )
        }
      }
    }

    run()
  }, [inviteCode, getme, push, replace, orgId, contactId])

  if (!orgId || !contactId || !inviteCode) return <div>No invitation</div>
  if (isLoading) return <div>Loading...</div>

  return <div>Loading...</div>
}

export default Page
