import { type PropsWithChildren } from "react"
import Image from "next/image"
import { Box, Stack } from "@mui/material"
import Logo from "~/assets/logo-ava.png"
import Background from "~/assets/signup-background.jpg"

export default function AuthLayout({ children }: PropsWithChildren) {
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
