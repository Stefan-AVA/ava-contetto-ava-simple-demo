"use client"

import React from "react"
import Image from "next/image"
import Link from "next/link"
import { Box, IconButton, Stack } from "@mui/material"
import Logo from "~/assets/logo-ava.png"
import { Mail, MenuIcon } from "lucide-react"

import Menu from "./user-menu"

interface INav {
  loading: boolean
  toggleDrawer: (event?: React.KeyboardEvent | React.MouseEvent) => void
}
const Nav = ({ loading, toggleDrawer }: INav) => {
  return (
    <Stack
      sx={{
        p: 1,
        width: "100%",
        position: "sticky",
        transition: "all .3s ease-in-out",
        alignItems: "center",
        flexDirection: "row",
        justifyContent: "space-between",
        borderBottom: "1px solid #D9D9D9",
      }}
    >
      <Stack
        direction="row"
        spacing={1}
        sx={{ width: "100%", height: "100%" }}
        alignItems="center"
      >
        <IconButton
          sx={{
            display: {
              xs: "flex",
              md: "none",
            },
          }}
          onClick={toggleDrawer}
        >
          <MenuIcon />
        </IconButton>

        <Stack href="/" component={Link}>
          <Box
            sx={{ width: "100%", height: "2rem" }}
            src={Logo}
            alt="Logo Ava"
            priority
            component={Image}
          />
        </Stack>
      </Stack>

      <Stack
        sx={{
          gap: 2,
          alignItems: "center",
          flexDirection: "row",
        }}
      >
        {/* <Stack
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
          </Stack> */}

        <Menu />
      </Stack>
    </Stack>
  )
}

export default Nav
