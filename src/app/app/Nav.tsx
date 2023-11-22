"use client"

import React from "react"
import Image from "next/image"
import Link from "next/link"
import { Box, CircularProgress, IconButton, Stack } from "@mui/material"
import Logo from "~/assets/logo-ava.png"
import { Mail, MenuIcon } from "lucide-react"

import Menu from "./user-menu"

interface INav {
  loading: boolean
  toggleDrawer: (event?: React.KeyboardEvent | React.MouseEvent) => void
}

export default function Nav({ loading, toggleDrawer }: INav) {
  return (
    <Stack
      sx={{
        top: 0,
        width: "100%",
        height: "4rem",
        bgcolor: "white",
        position: "sticky",
        transition: "all .3s ease-in-out",
        alignItems: "center",
        borderBottom: "1px solid",
        flexDirection: "row",
        justifyContent: "space-between",
        borderBottomColor: "gray.300",
      }}
    >
      <Stack
        sx={{
          pl: 3.5,
          gap: 1,
          width: "100%",
          height: "100%",
          maxWidth: "19.5rem",
          alignItems: "center",
          borderRight: "1px solid",
          borderRightColor: "gray.300",
        }}
        direction="row"
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
          pr: 3.5,
          gap: 2,
          flex: 1,
          alignItems: "center",
          flexDirection: "row",
          justifyContent: "flex-end",
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

        {loading && <CircularProgress size="1.25rem" />}
        {!loading && <Menu />}
      </Stack>
    </Stack>
  )
}
