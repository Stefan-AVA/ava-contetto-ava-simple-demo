"use client"

import { useCallback, useEffect, useState } from "react"
import { Box, Typography } from "@mui/material"
import { useDropzone, type DropzoneOptions } from "react-dropzone"

export interface IDragDropProps
  extends Omit<DropzoneOptions, "onDrop" | "onError"> {
  onChange: (files: File[]) => void
  dragActiveText?: string
  dragInactiveText?: string
  errorText?: string
  height?: number | string
  width?: number | string
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
}: IDragDropProps) => {
  const [error, setError] = useState("")

  const onDrop = useCallback((files: File[]) => {
    if (files.length > 0) onChange(files)
    else setError("Can't use this type of files!")
  }, [])

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
        borderRadius: "6px",
        margin: "5px 0",
        background: isDragActive ? "#00000055" : "White",
        ":hover": {
          cursor: "pointer",
        },
      }}
    >
      <input {...getInputProps()} />
      {errorText || error ? (
        <Typography sx={{ color: "#d73131" }} variant="body2">
          {errorText || error}
        </Typography>
      ) : isDragActive ? (
        <Typography variant="body2">
          {dragActiveText || "Drop the files here ..."}
        </Typography>
      ) : (
        <Typography variant="body2" sx={{ "&:hover": { cursor: "pointer" } }}>
          {dragInactiveText ||
            "Drag & drop some files here, or click to select files (jpeg, png, gif)"}
        </Typography>
      )}
    </Box>
  )
}

export default DragDrop
