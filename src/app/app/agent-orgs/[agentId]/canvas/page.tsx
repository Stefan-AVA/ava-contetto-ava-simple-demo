"use client"

import { useState } from "react"
import { Box, Button, Container, Stack } from "@mui/material"
import { Canvas, Circle, FabricImage, Rect, Textbox } from "fabric"

import FabricCanvas from "./fabric-canvas"

const STROKE = "#000000"
const FILL = "rgba(255, 255, 255, 0.0)"

export default function Page() {
  const [canvas, setCanvas] = useState<Canvas | null>(null)

  function onClearAll() {
    if (!canvas) return

    canvas.getObjects().forEach((object) => canvas.remove(object))
    canvas.discardActiveObject()
    canvas.renderAll()
  }

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

  async function onAddImage(files: FileList | null) {
    if (!canvas || !files || (files && files.length <= 0)) return

    const file = files[0]

    const path = URL.createObjectURL(file)

    const image = await FabricImage.fromURL(path)

    canvas.add(image)
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

  function onDeleteElement() {
    if (!canvas) return

    canvas.getActiveObjects().forEach((object) => canvas.remove(object))
    canvas.discardActiveObject()
    canvas.renderAll()
  }

  return (
    <Container>
      <Stack
        sx={{
          mb: 5,
          gap: 2,
          alignItems: "center",
          flexDirection: "row",
        }}
      >
        <Button size="small" onClick={onAddText} variant="outlined">
          Add text
        </Button>
        <Box sx={{ position: "relative" }}>
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
        </Box>
        <Button size="small" onClick={onAddCircle} variant="outlined">
          Add circle
        </Button>
        <Button size="small" onClick={onAddRectangle} variant="outlined">
          Add Rectangle
        </Button>
        <Button size="small" onClick={onDeleteElement} variant="outlined">
          Delete element
        </Button>
        <Button size="small" onClick={onClearAll} variant="outlined">
          Clear all
        </Button>
      </Stack>

      <FabricCanvas onCanvas={setCanvas} />
    </Container>
  )
}
