"use client"

import { useEffect, useRef, type Dispatch, type SetStateAction } from "react"
import { Box } from "@mui/material"
import * as fabric from "fabric"

interface CanvasProps {
  onCanvas: Dispatch<SetStateAction<fabric.Canvas | null>>
}

export default function Canvas({ onCanvas }: CanvasProps) {
  const ref = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const options: Partial<fabric.CanvasOptions> = {
      width: 640,
      height: 640,
    }

    const canvas = new fabric.Canvas(ref.current as HTMLCanvasElement, options)

    onCanvas(canvas)
    return () => {
      onCanvas(null)

      canvas.dispose()
    }
  }, [onCanvas])

  return (
    <Box
      sx={{
        ".canvas-container": {
          border: "1px solid",
          borderColor: "gray.300",
          borderRadius: ".5rem",
        },
      }}
    >
      <canvas ref={ref} />
    </Box>
  )
}
