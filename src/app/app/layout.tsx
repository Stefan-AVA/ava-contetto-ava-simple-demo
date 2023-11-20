"use client"

import { useEffect, type PropsWithChildren } from "react"
import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useLazyGetMeQuery } from "@/redux/apis/auth"
import { useLazyGetOrgsQuery } from "@/redux/apis/org"
import { logout, setOrgs } from "@/redux/slices/app"
import { useAppDispatch } from "@/redux/store"
import { Box, CircularProgress, Container, Stack } from "@mui/material"
import Logo from "~/assets/logo-ava.png"
import { Mail } from "lucide-react"

import type { IOrg } from "@/types/org.types"

import Menu from "./user-menu"

export default function Layout({ children }: PropsWithChildren) {
  const { replace } = useRouter()

  const dispatch = useAppDispatch()

  const [getme, { isLoading: isLoadingMe }] = useLazyGetMeQuery()
  const [getOrgs, { isLoading: isLoadingOrgs }] = useLazyGetOrgsQuery()

  useEffect(() => {
    async function run() {
      try {
        await getme().unwrap()
        const orgs = await getOrgs().unwrap()

        const listOrgs = orgs.agentProfiles.map(({ org }) => org as IOrg)

        dispatch(setOrgs(listOrgs))

        const findOrg = listOrgs[0]._id

        replace(`/app/orgs/${findOrg}/dashboard`)
      } catch (error) {
        dispatch(logout())
        replace("/")
      }
    }

    run()
  }, [replace, dispatch, getme, getOrgs])

  return (
    <Stack>
      <Stack
        sx={{
          pt: {
            xs: 2.5,
            md: 4,
          },
          px: {
            xs: 4,
            md: 8,
          },
          width: "100%",
          position: "absolute",
          alignItems: "center",
          flexDirection: "row",
          justifyContent: "space-between",
        }}
      >
        <Stack href="/" component={Link}>
          <Box
            sx={{ width: "100%", height: "2rem" }}
            src={Logo}
            alt="Logo Ava"
            priority
            component={Image}
          />
        </Stack>

        <Stack
          sx={{
            gap: 2,
            alignItems: "center",
            flexDirection: "row",
          }}
        >
          <Stack
            sx={{
              width: {
                xs: "3rem",
                md: "4rem",
              },
              height: {
                xs: "3rem",
                md: "4rem",
              },
              color: "blue.800",
              border: "1px solid",
              alignItems: "center",
              borderColor: "green.500",
              borderRadius: "50%",
              justifyContent: "center",
            }}
            type="button"
            component="button"
          >
            <Mail />
          </Stack>

          <Menu />
        </Stack>
      </Stack>

      <Container
        sx={{
          mt: 20,
          pb: 12,
          position: "relative",
        }}
      >
        {(isLoadingMe || isLoadingOrgs) && <CircularProgress size="1.25rem" />}

        {!(isLoadingMe || isLoadingOrgs) && children}
      </Container>
    </Stack>
  )
}
