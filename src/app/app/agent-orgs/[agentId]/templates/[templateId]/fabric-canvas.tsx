"use client"

import {
  useEffect,
  useMemo,
  useRef,
  type Dispatch,
  type SetStateAction,
} from "react"
import { Box } from "@mui/material"
import { Canvas, type CanvasOptions, type FabricObject } from "fabric"

interface FabricCanvasProps {
  canvas: Canvas[]
  onCanvas: Dispatch<SetStateAction<Canvas[]>>
  numberOfPages: number
  onSelectedElements: Dispatch<SetStateAction<FabricObject[]>>
}

export default function FabricCanvas({
  canvas,
  onCanvas,
  numberOfPages,
  onSelectedElements,
}: FabricCanvasProps) {
  const ref = useRef<HTMLCanvasElement[]>([])

  const pages = useMemo(
    () => Array.from(Array(numberOfPages), (_, x) => x),
    [numberOfPages]
  )

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

    const createdCanvas = [] as Canvas[]

    const refs = ref.current && ref.current.length > 0

    if (refs) {
      pages.forEach((page) => {
        const currRef = ref.current?.[page] as HTMLCanvasElement

        console.log({ currRef, page })

        const currCanvas = new Canvas(currRef, options)

        currCanvas.backgroundColor = "#FFF"

        createdCanvas.push(currCanvas)

        bindEvents(currCanvas)
      })

      onCanvas((prev) => [...prev, ...createdCanvas])
    }
    return () => {
      createdCanvas.forEach((currCanvas) => currCanvas.dispose())

      onCanvas([])

      onSelectedElements([])
    }
  }, [pages, onCanvas, onSelectedElements])

  return (
    <Box
      sx={{
        ".canvas-container canvas": {
          border: "1px solid",
          borderColor: "gray.300",
          borderRadius: ".5rem",
        },
      }}
    >
      {pages.map((page) => (
        <canvas
          id={`canvas-${page}`}
          key={page}
          ref={(curr) => {
            if (ref.current) ref.current[page] = curr as HTMLCanvasElement
          }}
        />
      ))}
    </Box>
  )
}
