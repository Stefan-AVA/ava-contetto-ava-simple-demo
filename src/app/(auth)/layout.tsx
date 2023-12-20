"use client"

import { useEffect, useRef, type PropsWithChildren } from "react"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { useLazyGetMeQuery } from "@/redux/apis/auth"
import { useLazyGetOrgsQuery } from "@/redux/apis/org"
import { setOrgs, setUser } from "@/redux/slices/app"
import { useAppDispatch } from "@/redux/store"
import { Box, Stack } from "@mui/material"
import Logo from "~/assets/logo-ava.png"
import Background from "~/assets/signup-background.jpg"

import { AgentRole } from "@/types/agentProfile.types"

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
  }, [getme, dispatch, replace, getOrgs])

  return (
    <Stack
      sx={{
        height: "100%",
        minHeight: "100vh",
        flexDirection: {
          xs: "column",
          md: "row",
        },
      }}
    >
      <Box
        sx={{
          width: {
            xs: "100%",
            md: "50%",
          },
          height: {
            xs: "24rem",
            md: "100%",
          },
          objectFit: "cover",
          minHeight: {
            md: "100vh",
          },
        }}
        src={Background}
        alt=""
        priority
        component={Image}
      />

      <Stack
        sx={{
          px: {
            xs: 3,
            sm: 10,
            lg: 20,
          },
          py: {
            xs: 5,
            sm: 10,
          },
          width: {
            xs: "100%",
            md: "50%",
          },
          height: {
            xs: "100%",
            md: "100vh",
          },
          overflowY: "auto",
          alignItems: "center",
        }}
      >
        <Box
          sx={{ mb: 5, height: "3rem", objectFit: "contain" }}
          src={Logo}
          alt="Logo Ava"
          component={Image}
        />

        {children}
      </Stack>
    </Stack>
  )
}

export default LoginLayout
