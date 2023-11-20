"use client"

import {
  forwardRef,
  useState,
  type ChangeEvent,
  type ComponentProps,
} from "react"
import Image from "next/image"
import { Box, Stack, Typography, type SxProps } from "@mui/material"
import { Plus, UserCircle2 } from "lucide-react"

interface UploadProps extends ComponentProps<"input"> {
  sx?: SxProps
  error?: string
}

export const Upload = forwardRef<HTMLInputElement, UploadProps>(
  ({ sx, error, className, ...rest }, ref) => {
    const [preview, setPreview] = useState<string | null>(null)

    function onChange(e: ChangeEvent<HTMLInputElement>) {
      const file = e.target.files?.[0]

      if (!file) {
        setPreview(null)

        return
      }

      if (rest.onChange) rest.onChange(e)

      setPreview(URL.createObjectURL(file))
    }

    return (
      <Stack
        sx={{
          width: "fit-content",
          cursor: "pointer",
          position: "relative",
          ...sx,
        }}
      >
        <Stack
          sx={{
            width: "7rem",
            height: "7rem",
            bgcolor: "gray.300",
            position: "relative",
            alignItems: "center",
            aspectRatio: 1 / 1,
            borderRadius: "50%",
            pointerEvents: "none",
            justifyContent: "center",
          }}
        >
          {preview && (
            <Box
              sx={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
                userSelect: "none",
                borderRadius: "50%",
                pointerEvents: "none",
              }}
              src={preview}
              alt=""
              fill
              component={Image}
            />
          )}

          {!preview && (
            <Box
              sx={{ color: "white" }}
              size={64}
              component={UserCircle2}
              strokeWidth={1.5}
            />
          )}

          <Stack
            sx={{
              color: "white",
              width: "1.75rem",
              right: 0,
              border: "1px solid",
              height: "1.75rem",
              bottom: 0,
              bgcolor: "gray.300",
              position: "absolute",
              alignItems: "center",
              borderColor: "white",
              borderRadius: "50%",
              flexDirection: "row",
              justifyContent: "center",
            }}
          >
            <Plus size={20} />
          </Stack>
        </Stack>

        <input
          ref={ref}
          {...rest}
          type="file"
          style={{
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            cursor: "pointer",
            opacity: 0,
            position: "absolute",
          }}
          onChange={onChange}
        />

        {error && (
          <Typography
            sx={{ mt: 1.5, color: "red.500", textAlign: "center" }}
            variant="body2"
          >
            {error}
          </Typography>
        )}
      </Stack>
    )
  }
)

Upload.displayName = "Upload"
