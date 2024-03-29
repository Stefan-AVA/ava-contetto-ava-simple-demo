"use client"

import { useCallback, useEffect, useState, type PropsWithChildren } from "react"
import {
  Stack,
  Typography,
  useTheme,
  type SxProps,
  type Theme,
} from "@mui/material"
import { useDropzone, type DropzoneOptions } from "react-dropzone"

export interface IDragDropProps
  extends Omit<DropzoneOptions, "onDrop" | "onError"> {
  onChange: (files: File[]) => void
  dragActiveText?: string
  dragInactiveText?: string
  errorText?: string
  height?: number | string
  width?: number | string
  circle?: boolean
  sx?: SxProps<Theme>
}

const DragDrop = ({
  onChange,
  accept,
  multiple,
  dragActiveText,
  dragInactiveText,
  errorText,
  height,
  width,
  circle,
  sx,
  children,
}: PropsWithChildren<IDragDropProps>) => {
  const [error, setError] = useState("")

  const { palette } = useTheme()

  const onDrop = useCallback(
    (files: File[]) => {
      if (files.length > 0) onChange(files)
      else setError("Can't use this type of files!")
    },
    [onChange]
  )

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept,
    multiple,
  })

  useEffect(() => {
    if (isDragActive) setError("")
  }, [isDragActive])

  return (
    <Stack
      {...getRootProps()}
      sx={{
        width: width || "100%",
        height: height || "100px",
        cursor: "pointer",
        border: "2px dashed",
        bgcolor: isDragActive ? `${palette.primary.main}20` : "white",
        alignItems: "center",
        borderColor: isDragActive ? "primary.main" : "gray.500",
        borderRadius: circle ? "50%" : 4,
        justifyContent: "center",

        ...sx,
      }}
    >
      <input {...getInputProps()} />
      {errorText || error ? (
        <Typography sx={{ color: "#d73131" }} variant="body2">
          {errorText || error}
        </Typography>
      ) : isDragActive ? (
        <Typography variant="body2">{dragActiveText || ""}</Typography>
      ) : (
        <Typography variant="body2" sx={{ "&:hover": { cursor: "pointer" } }}>
          {dragInactiveText || ""}
        </Typography>
      )}

      {children}
    </Stack>
  )
}

export default DragDrop
