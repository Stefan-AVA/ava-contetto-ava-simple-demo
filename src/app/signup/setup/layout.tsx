import type { PropsWithChildren } from "react"
import Image from "next/image"
import { Box, Stack, Typography } from "@mui/material"
import Logo from "~/assets/logo-ava.png"

export default function Layout({ children }: PropsWithChildren) {
  return (
    <Stack>
      <Stack
        sx={{
          py: 1.5,
          px: {
            xs: 3,
            md: 8,
          },
          width: "100%",
          alignItems: "center",
          borderBottom: "1px solid",
          justifyContent: "space-between",
          borderBottomColor: "gray.300",
        }}
      >
        <Box
          sx={{ width: "auto", height: "2rem" }}
          src={Logo}
          alt="Logo Ava"
          component={Image}
        />
      </Stack>

      <Stack
        sx={{
          my: 6,
          px: 3,
          mx: "auto",
          width: "100%",
          maxWidth: "42rem",
        }}
      >
        <Typography
          sx={{ color: "gray.800", textAlign: "center", fontWeight: 700 }}
          variant="h3"
          component="h1"
        >
          Profile Setup
        </Typography>

        <Typography
          sx={{ color: "gray.600", textAlign: "center" }}
          variant="body2"
        >
          Setup your profile to start today.
        </Typography>

        {children}
      </Stack>
    </Stack>
  )
}
