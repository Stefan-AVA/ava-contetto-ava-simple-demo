"use client"

import { useCallback, useEffect, useRef } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { useLazyGetMeQuery } from "@/redux/apis/auth"
import { useAcceptInviteMutation } from "@/redux/apis/org"

type PageProps = {
  params: {
    orgId: string
  }
}

const Page = ({ params: { orgId } }: PageProps) => {
  const initialized = useRef(false)
  const { push, replace } = useRouter()

  const searchParams = useSearchParams()
  const code = searchParams.get("code")

  const [getme, { isLoading: getMeLoading }] = useLazyGetMeQuery()
  const [acceptInvit, { isLoading: acceptInviteLoading }] =
    useAcceptInviteMutation()
  const isLoading = getMeLoading || acceptInviteLoading

  useEffect(() => {
    if (!orgId || !code) {
      replace("/")
    }
  }, [orgId, code])

  const checkAuth = useCallback(async () => {
    if (!initialized.current) {
      initialized.current = true

      try {
        await getme().unwrap()

        if (orgId && code) {
          console.log("code: orgId ==>", code, orgId)
          try {
            await acceptInvit({
              id: orgId,
              code,
            })
            push(`/app/orgs`)
          } catch (error) {
            console.log("accept invite error ==>", error)
            push("/app")
          }
        }
      } catch (error) {
        console.log("accept getme error ===>", error)
        if (orgId && code) {
          replace(`/?_next=/invitations/${orgId}?code=${code}`)
        } else {
          replace("/")
        }
      }
    }
  }, [getme, replace, code, orgId])

  useEffect(() => {
    checkAuth()
  }, [])

  if (!orgId || !code) return <div>No invitation</div>
  if (isLoading) return <div>Loading...</div>

  return <div>Loading...</div>
}

export default Page
