"use client"

import { useEffect, useRef, type Dispatch, type SetStateAction } from "react"
import { Box } from "@mui/material"
import { Canvas, type CanvasOptions, type FabricObject } from "fabric"

interface FabricCanvasProps {
  onCanvas: Dispatch<SetStateAction<Canvas | null>>
  onSelectedElements: Dispatch<SetStateAction<FabricObject[]>>
}

export default function FabricCanvas({
  onCanvas,
  onSelectedElements,
}: FabricCanvasProps) {
  const ref = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const options: Partial<CanvasOptions> = {
      width: 640,
      height: 640,
    }

    const bindEvents = (canvas: Canvas) => {
      canvas.on("selection:cleared", () => {
        onSelectedElements([])
      })
      canvas.on("selection:created", (e) => {
        onSelectedElements(e.selected)
      })
      canvas.on("selection:updated", (e) => {
        onSelectedElements(e.selected)
      })
    }

    const canvas = new Canvas(ref.current as HTMLCanvasElement, options)

    onCanvas(canvas)

    bindEvents(canvas)
    return () => {
      onCanvas(null)

      canvas.dispose()

      onSelectedElements([])
    }
  }, [onCanvas, onSelectedElements])

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
