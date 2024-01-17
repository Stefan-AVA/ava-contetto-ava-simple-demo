"use client"

import { useEffect, useRef, type PropsWithChildren } from "react"
import { useRouter } from "next/navigation"
import { useLazyGetMeQuery } from "@/redux/apis/auth"
import { useLazyGetOrgsQuery } from "@/redux/apis/org"
import { setOrgs, setUser } from "@/redux/slices/app"
import { useAppDispatch } from "@/redux/store"

import { AgentRole } from "@/types/agentProfile.types"
import AuthLayout from "@/components/auth-layout"

const LoginLayout = ({ children }: PropsWithChildren) => {
  const initialized = useRef(false)

  const { replace } = useRouter()
  const dispatch = useAppDispatch()

  const [getme] = useLazyGetMeQuery()
  const [getOrgs] = useLazyGetOrgsQuery()

  useEffect(() => {
    async function run() {
      if (!initialized.current) {
        initialized.current = true

        try {
          const user = await getme().unwrap()

          const orgs = await getOrgs().unwrap()

          dispatch(setUser(user))

          if (orgs) {
            const ownerAgent = orgs.agentProfiles.find(
              (agent) => agent.role === AgentRole.owner
            )

            dispatch(setOrgs(orgs))

            replace(`/app/agent-orgs/${ownerAgent?._id}`)

            return
          }

          replace("/app")
        } catch (error) {}
      }
    }

    run()
  }, [getme, dispatch, replace, getOrgs, initialized])

  return <AuthLayout>{children}</AuthLayout>
}

export default LoginLayout
