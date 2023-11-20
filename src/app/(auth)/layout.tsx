"use client"

import { useEffect, type PropsWithChildren } from "react"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { useLazyGetMeQuery } from "@/redux/apis/auth"
import { setUser } from "@/redux/slices/app"
import { useAppDispatch } from "@/redux/store"
import { Box, Stack } from "@mui/material"
import Background from "~/assets/signup-background.jpg"

const LoginLayout = ({ children }: PropsWithChildren) => {
  const { replace } = useRouter()
  const dispatch = useAppDispatch()

  const [getme] = useLazyGetMeQuery()

  useEffect(() => {
    async function run() {
      try {
        const user = await getme().unwrap()

        dispatch(setUser(user))
        replace("/app")
      } catch (error) {}
    }

    run()
  }, [getme, dispatch, replace])

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
        {children}
      </Stack>
    </Stack>
  )
}

export default LoginLayout
