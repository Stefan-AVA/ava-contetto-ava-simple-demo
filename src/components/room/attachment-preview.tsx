import { useRef } from "react"
import Image from "next/image"
import { Box, Stack, Typography } from "@mui/material"
import { X } from "lucide-react"

import useOutsideClick from "@/hooks/use-outside-click"

interface AttachmentPreviewProps {
  type: string
  fileUrl: string
  onClose: () => void
}

export default function AttachmentPreview({
  type,
  fileUrl,
  onClose,
}: AttachmentPreviewProps) {
  const ref = useRef<HTMLDivElement>(null)

  useOutsideClick(ref, onClose)

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
          ml: "auto",
          color: "white",
          width: "2.5rem",
          height: "2.5rem",
          bgcolor: "gray.300",
          alignItems: "center",
          borderRadius: "50%",
          justifyContent: "center",
        }}
        component="button"
      >
        <X strokeWidth={3} />
      </Stack>

      <Box sx={{ m: "auto" }} ref={ref}>
        {type.includes("image") ? (
          <Image src={fileUrl} alt="" width={960} height={480} />
        ) : (
          <Typography
            sx={{ textAlign: "center", maxWidth: "20rem" }}
            variant="h4"
          >
            This file can not be opened. Download to open.
          </Typography>
        )}
      </Box>
    </Stack>
  )
}
