import type { PropsWithChildren } from "react"
import Image from "next/image"
import { Stack, Typography } from "@mui/material"

interface ShareViewProps extends PropsWithChildren {
  title: string
  fileUrl?: string | null
  type?: string
}

export default function ShareView({
  title,
  fileUrl,
  type,
  children,
}: ShareViewProps) {
  console.log(fileUrl)
  return (
    <Stack
      sx={{
        p: 4,
        top: 0,
        left: 0,
        color: "white",
        width: "100svw",
        zIndex: 999,
        position: "fixed",
        minHeight: "100svh",
        backgroundColor: "rgba(0, 0, 0, .8)",
      }}
    >
      <Stack
        sx={{
          gap: 3,
          position: "relative",
          alignItems: {
            sm: "center",
          },
          flexDirection: {
            xs: "column",
            sm: "row",
          },
          justifyContent: {
            xs: "space-between",
            md: "flex-end",
          },
        }}
      >
        <Typography
          sx={{
            left: 0,
            right: 0,
            position: { md: "absolute" },
            textAlign: { xs: "left", md: "center" },
            fontWeight: "700",
          }}
          variant="h6"
        >
          {title}
        </Typography>

        <Stack
          sx={{
            gap: 6,
            alignItems: "center",
            flexDirection: "row",
          }}
        >
          {children}
        </Stack>
      </Stack>

      {fileUrl && type?.includes("image") ? (
        <Image
          src={fileUrl}
          alt=""
          width={960}
          style={{ margin: "auto" }}
          height={480}
        />
      ) : (
        <Typography
          sx={{ m: "auto", textAlign: "center", maxWidth: "20rem" }}
          variant="h4"
        >
          This file can not be opened. Download to open.
        </Typography>
      )}
    </Stack>
  )
}
