"use client"

import { useEffect, type PropsWithChildren } from "react"
import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useLazyGetMeQuery } from "@/redux/apis/auth"
import { logout } from "@/redux/slices/app"
import { useAppDispatch } from "@/redux/store"
import { Box, Container, Stack } from "@mui/material"
import Logo from "~/assets/logo-ava.png"
import { Mail } from "lucide-react"

import Menu from "./user-menu"

export default function Layout({ children }: PropsWithChildren) {
  const { replace } = useRouter()
  const dispatch = useAppDispatch()

  const [getme] = useLazyGetMeQuery()

  useEffect(() => {
    async function run() {
      try {
        await getme().unwrap()
      } catch (error) {
        dispatch(logout())
        replace("/")
      }
    }

    run()
  }, [replace, dispatch, getme])

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
        {children}
      </Container>
    </Stack>
  )
}
