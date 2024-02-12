"use client"

import { useEffect, useRef, type Dispatch, type SetStateAction } from "react"
import { Box, Unstable_Grid2 as Grid } from "@mui/material"
import { Canvas, type CanvasOptions } from "fabric"

import type { ITemplate } from "@/types/template.types"

interface CardPreviewProps {
  data: ITemplate[]
  onCanvas: Dispatch<SetStateAction<Canvas[]>>
}

/**
 * @todo
 * Adjust the card width according to the screen width.
 */
const WIDTH = 344 - 8

export default function CardPreview({ data, onCanvas }: CardPreviewProps) {
  const ref = useRef<HTMLCanvasElement[]>([])

  useEffect(() => {
    const options: Partial<CanvasOptions> = {
      width: WIDTH,
      height: WIDTH,
    }

    const createdCanvas = [] as Canvas[]

    const refs = ref.current && ref.current.length > 0

    if (refs) {
      data.forEach((_, index) => {
        if (createdCanvas[index]) return

        const currRef = ref.current?.[index] as HTMLCanvasElement

        const currCanvas = new Canvas(currRef, options)

        currCanvas.calcOffset()

        currCanvas.renderAll()

        createdCanvas.push(currCanvas)
      })

      onCanvas((prev) => [...prev, ...createdCanvas])
    }
    return () => {
      createdCanvas.forEach((currCanvas) => currCanvas.dispose())

      onCanvas([])
    }
  }, [data, onCanvas])

  return (
    <Grid container spacing={3}>
      {data.map(({ _id }, index) => (
        <Grid xs={12} md={2} lg={4} key={_id}>
          <Box sx={{ border: "4px solid", borderColor: "gray.200" }}>
            <canvas
              ref={(curr) => {
                if (ref.current) ref.current[index] = curr as HTMLCanvasElement
              }}
            />
          </Box>
        </Grid>
      ))}
    </Grid>
  )
}
