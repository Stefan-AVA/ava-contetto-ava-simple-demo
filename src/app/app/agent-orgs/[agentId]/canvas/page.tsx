"use client"

import { useState } from "react"
import { Button, Container, Stack } from "@mui/material"
import { Canvas, Circle, Rect, Textbox } from "fabric"

import FabricCanvas from "./fabric-canvas"

const STROKE = "#000000"
const FILL = "rgba(255, 255, 255, 0.0)"

export default function Page() {
  const [canvas, setCanvas] = useState<Canvas | null>(null)

  function onAddText() {
    const text = new Textbox("Hello world", {
      fontSize: 24,
      lineHeight: 1.25,
      fontFamily: "Arial",
    })

    canvas?.add(text)
  }

  function onAddCircle() {
    const circle = new Circle({
      fill: FILL,
      stroke: STROKE,
      radius: 20,
    })

    canvas?.add(circle)
  }

  function onAddRectangle() {
    const rect = new Rect({
      fill: FILL,
      width: 40,
      stroke: STROKE,
      height: 40,
    })

    canvas?.add(rect)
  }

  return (
    <Container>
      <Stack
        sx={{
          gap: 2,
          alignItems: "center",
          flexDirection: "row",
        }}
      >
        <Button size="small" onClick={onAddText} variant="outlined">
          Add text
        </Button>
        {/* <Box sx={{ position: "relative" }}>
          <Box
            sx={{
              width: "100%",
              height: "100%",
              zIndex: 99,
              opacity: 0,
              position: "absolute",
            }}
            type="file"
            onChange={({ target }) => onAddImage(target.files)}
            component="input"
          />

          <Button size="small" variant="outlined">
            Add Image
          </Button>
          </Box> */}
        <Button size="small" onClick={onAddCircle} variant="outlined">
          Add circle
        </Button>
        <Button size="small" onClick={onAddRectangle} variant="outlined">
          Add Rectangle
        </Button>
        {/* <Button size="small" onClick={onDeleteElement} variant="outlined">
          Delete element
        </Button>
        <Button size="small" onClick={onClearAll} variant="outlined">
          Clear all
        </Button>  */}
      </Stack>

      <FabricCanvas onCanvas={setCanvas} />
    </Container>
  )
}
