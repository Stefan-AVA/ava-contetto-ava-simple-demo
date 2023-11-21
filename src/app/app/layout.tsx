"use client"

import { useEffect, type PropsWithChildren } from "react"
import Image from "next/image"
import Link from "next/link"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { useLazyGetMeQuery } from "@/redux/apis/auth"
import { useLazyGetOrgsQuery } from "@/redux/apis/org"
import { logout, setOrgs } from "@/redux/slices/app"
import { useAppDispatch } from "@/redux/store"
import { Box, CircularProgress, Container, Stack } from "@mui/material"
import Logo from "~/assets/logo-ava.png"
import { Mail } from "lucide-react"

import type { IOrg } from "@/types/org.types"

import Menu from "./user-menu"

interface LayoutProps extends PropsWithChildren {
  searchParams: {
    sidebar: string
  }
}

export default function Layout({ children }: LayoutProps) {
  const { replace } = useRouter()

  const pathname = usePathname()

  const dispatch = useAppDispatch()

  const [getme, { isLoading: isLoadingMe }] = useLazyGetMeQuery()
  const [getOrgs, { isLoading: isLoadingOrgs }] = useLazyGetOrgsQuery()

  const params = useSearchParams()

  const sidebar = params.get("sidebar")

  const openSidebar = sidebar === "open"

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

  function paddingLeftMenu() {
    if (openSidebar) return 44

    if (pathname.includes("/dashboard")) return 14

    return 8
  }

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
          pl: {
            xs: 4,
            md: paddingLeftMenu(),
          },
          width: "100%",
          position: "absolute",
          transition: "all .3s ease-in-out",
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
