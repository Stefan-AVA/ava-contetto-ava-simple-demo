"use client"

import { Stack } from "@mui/material"
import { FabricJSCanvas, useFabricJSEditor } from "fabricjs-react"

export default function CanvasAdmin() {
  const { editor, onReady } = useFabricJSEditor()

  const onAddCircle = () => {
    editor?.addCircle()
  }
  const onAddRectangle = () => {
    editor?.addRectangle()
  }

  return (
    <Stack>
      <button onClick={onAddCircle}>Add circle</button>
      <button onClick={onAddRectangle}>Add Rectangle</button>

      <FabricJSCanvas onReady={onReady} />
    </Stack>
  )
}
