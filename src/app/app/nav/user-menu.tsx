"use client"

import { useState } from "react"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { RootState } from "@/redux/store"
import { nameInitials } from "@/utils/format-name"
import { Box, Menu, MenuItem, Stack, Typography } from "@mui/material"
import { useSelector } from "react-redux"

export default function User() {
  const [anchor, setAnchor] = useState<HTMLElement | null>(null)

  const { push } = useRouter()

  const user = useSelector((state: RootState) => state.app.user)

  const options = [
    {
      label: "Search",
      action: () => {
        setAnchor(null)
        push("/app")
      },
    },
    {
      label: "Profile",
      action: () => {
        setAnchor(null)
        push("/app/profile")
      },
    },
  ]

  return (
    <Box sx={{ position: "relative" }}>
      <Stack
        sx={{
          width: "3rem",
          height: "3rem",
          color: "blue.800",
          border: "1px solid",
          alignItems: "center",
          borderColor: "gray.300",
          borderRadius: "50%",
          justifyContent: "center",
        }}
        type="button"
        onClick={({ currentTarget }) => setAnchor(currentTarget)}
        component="button"
      >
        {user?.image ? (
          <Box
            sx={{ objectFit: "cover", borderRadius: "50%" }}
            src={user.image}
            alt=""
            width={48}
            height={48}
            component={Image}
          />
        ) : (
          <Typography>
            {nameInitials(user?.name || user?.username || "U")}
          </Typography>
        )}
      </Stack>

      <Menu
        id="menu"
        open={Boolean(anchor)}
        onClose={() => setAnchor(null)}
        anchorEl={anchor}
        keepMounted
        anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
        transformOrigin={{ horizontal: "right", vertical: "top" }}
      >
        {options.map(({ label, action }) => (
          <MenuItem key={label} onClick={action}>
            {label}
          </MenuItem>
        ))}
      </Menu>
    </Box>
  )
}
