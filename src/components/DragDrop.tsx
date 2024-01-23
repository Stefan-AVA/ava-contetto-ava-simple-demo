"use client"

import { PropsWithChildren, useCallback, useEffect, useState } from "react"
import { Box, SxProps, Theme, Typography } from "@mui/material"
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
    <Box
      {...getRootProps()}
      sx={{
        width: width || "100%",
        height: height || "100px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexDirection: "column",
        border: "dashed 2px #0658c2",
        borderRadius: circle ? "100%" : 4,
        background: isDragActive ? "#00000055" : "White",
        ":hover": {
          cursor: "pointer",
        },
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
    </Box>
  )
}

export default DragDrop
