"use client"

import Image from "next/image"
import type { RootState } from "@/redux/store"
import { Box, Stack, Typography } from "@mui/material"
import { User } from "lucide-react"
import { useSelector } from "react-redux"

import Footer from "./footer"
import ListMessages from "./list-messages"

const data = {
  avatar: null,
  name: "Jane Doe",
}

export default function Room() {
  const room = useSelector((state: RootState) => state.rooms.currentRoom)

  return (
    <>
      <Stack
        sx={{
          px: 5,
          py: 2.5,
          gap: 2,
          alignItems: "center",
          borderBottom: "1px solid",
          flexDirection: "row",
          borderBottomColor: "gray.300",
        }}
      >
        <Stack
          sx={{
            width: "2.25rem",
            height: "2.25rem",
            position: "relative",
            alignItems: "center",
            aspectRatio: 1 / 1,
            borderRadius: "50%",
            justifyContent: "center",
            backgroundColor: "gray.200",
          }}
        >
          {data.avatar && (
            <Image
              src={data.avatar}
              alt=""
              fill
              style={{ objectFit: "cover", borderRadius: "50%" }}
            />
          )}

          {!data.avatar && (
            <Box
              sx={{ color: "gray.500" }}
              size={16}
              component={User}
              strokeWidth={3}
            />
          )}
        </Stack>

        <Typography sx={{ color: "gray.700", fontWeight: 600 }} variant="h5">
          {data.name}
        </Typography>
      </Stack>

      <ListMessages />

      <Footer />
    </>
  )
}
