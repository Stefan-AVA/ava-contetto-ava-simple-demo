"use client"

import { Box, Button, Container, Stack } from "@mui/material"
import { fabric } from "fabric"
import { FabricJSCanvas, useFabricJSEditor } from "fabricjs-react"

export default function CanvasAdmin() {
  const { editor, onReady, selectedObjects } = useFabricJSEditor()

  console.log({ selectedObjects })

  function onClearAll() {
    editor?.deleteAll()
  }

  function onAddText() {
    editor?.addText("Text message")
  }

  function onAddCircle() {
    editor?.addCircle()
  }

  function onAddImage(files: FileList | null) {
    if (!files || (files && files.length <= 0)) return

    const file = files[0]

    const path = URL.createObjectURL(file)

    fabric.Image.fromURL(path, (oImg) => {
      console.log({ oImg })

      editor?.canvas.add(oImg)
    })
  }

  function onAddRectangle() {
    editor?.addRectangle()
  }

  function onDeleteElement() {
    editor?.deleteSelected()
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

      <Box
        sx={{
          mt: 5,

          ".editor-canvas": {
            width: "100%",
            height: "40rem",
            border: "1px solid",
            maxWidth: "40rem",
            borderColor: "gray.300",
            borderRadius: ".5rem",
          },
        }}
      >
        <FabricJSCanvas onReady={onReady} className="editor-canvas" />
      </Box>
    </Container>
  )
}
