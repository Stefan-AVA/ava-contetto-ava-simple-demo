"use client"

import { useEffect, useRef } from "react"
import { useRouter } from "next/navigation"
import { useLazyGetMeQuery } from "@/redux/apis/auth"
import { useAcceptInviteMutation } from "@/redux/apis/org"

type PageProps = {
  params: {
    orgId: string
  }

  searchParams: {
    code: string
  }
}

const Page = ({ params, searchParams }: PageProps) => {
  const initialized = useRef(false)

  const { push, replace } = useRouter()

  const code = searchParams.code
  const orgId = params.orgId

  const [getme, { isLoading: getMeLoading }] = useLazyGetMeQuery()
  const [acceptInvit, { isLoading: acceptInviteLoading }] =
    useAcceptInviteMutation()

  const isLoading = getMeLoading || acceptInviteLoading

  useEffect(() => {
    if (!orgId || !code) replace("/")
  }, [orgId, code, replace])

  useEffect(() => {
    async function run() {
      if (!initialized.current) {
        initialized.current = true

        try {
          await getme().unwrap()

          if (orgId && code) {
            try {
              await acceptInvit({
                id: orgId,
                code,
              })
              push(`/app/orgs`)
            } catch (error) {
              push("/app")
            }
          }
        } catch (error) {
          replace(
            orgId && code ? `/?_next=/invitations/${orgId}?code=${code}` : "/"
          )
        }
      }
    }

    run()
  }, [code, getme, push, replace, orgId, acceptInvit])

  if (!orgId || !code) return <div>No invitation</div>
  if (isLoading) return <div>Loading...</div>

  return <div>Loading...</div>
}

export default Page
