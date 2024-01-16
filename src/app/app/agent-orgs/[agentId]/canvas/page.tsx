"use client"

import { useState } from "react"
import {
  Box,
  Button,
  Container,
  MenuItem,
  Stack,
  TextField,
} from "@mui/material"
import {
  Canvas,
  Circle,
  FabricImage,
  Rect,
  Textbox,
  type FabricObject,
} from "fabric"
import { MuiColorInput } from "mui-color-input"

import { dmsans } from "@/styles/fonts"

import FabricCanvas from "./fabric-canvas"

const initialStyle = {
  fontSize: 16,
  textColor: "#000",
  lineHeight: 24,
  borderColor: "#000",
  fontFamily: dmsans.style.fontFamily,
  backgroundColor: "#000",
}

export default function Page() {
  const [style, setStyle] = useState(initialStyle)
  const [canvas, setCanvas] = useState<Canvas | null>(null)
  const [selectedElements, setSelectedElements] = useState<FabricObject[]>([])

  function onClearAll() {
    if (!canvas) return

    canvas.getObjects().forEach((object) => canvas.remove(object))
    canvas.discardActiveObject()
    canvas.renderAll()
  }

  function onAddText() {
    if (!canvas) return

    const text = new Textbox("Hello world", {
      fontSize: style.fontSize,
      lineHeight: style.lineHeight / 16,
      fontFamily: style.fontFamily,
    })

    canvas.add(text)
  }

  function onAddCircle() {
    if (!canvas) return

    const circle = new Circle({
      fill: style.backgroundColor,
      stroke: style.borderColor,
      radius: 20,
    })

    canvas.add(circle)
  }

  async function onAddImage(files: FileList | null) {
    if (!canvas || !files || (files && files.length <= 0)) return

    const file = files[0]

    const path = URL.createObjectURL(file)

    const image = await FabricImage.fromURL(path)

    canvas.add(image)
  }

  function onAddRectangle() {
    if (!canvas) return

    const rect = new Rect({
      fill: style.backgroundColor,
      width: 40,
      stroke: style.borderColor,
      height: 40,
    })

    canvas.add(rect)
  }

  function onDeleteElement() {
    if (!canvas) return

    canvas.getActiveObjects().forEach((object) => canvas.remove(object))
    canvas.discardActiveObject()
    canvas.renderAll()
  }

  function onUpdateStylesAndCurrentElements(
    key: keyof typeof initialStyle,
    value: string | number
  ) {
    setStyle((prev) => ({ ...prev, [key]: value }))

    if (selectedElements.length > 0) {
      selectedElements.forEach((object) => {
        console.log({ object: object.type })

        if (key === "backgroundColor") object.set({ fill: value })

        if (object.type !== "textbox" && key === "borderColor")
          object.set({ stroke: value })

        if (
          object.type === "textbox" &&
          ["fontSize", "textColor", "fontFamily", "lineHeight"].includes(key)
        ) {
          const customKey = key === "textColor" ? "color" : key

          object.set({
            [customKey]: key === "lineHeight" ? Number(value) / 16 : value,
          })
        }
      })
    }
  }

  console.log({ selectedElements })

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

      <Stack
        sx={{
          mb: 2,
          gap: 2,
          alignItems: "center",
          flexDirection: "row",
        }}
      >
        <TextField
          label="Font Family"
          value={style.fontFamily}
          select
          onChange={({ target }) =>
            onUpdateStylesAndCurrentElements("fontFamily", target.value)
          }
        >
          <MenuItem value={dmsans.style.fontFamily}>DM Sans</MenuItem>
          <MenuItem value="Inter">Inter</MenuItem>
          <MenuItem value="Roboto">Roboto</MenuItem>
          <MenuItem value="Open Sans">Open Sans</MenuItem>
          <MenuItem value="Plus Jakarta Sans">Plus Jakarta Sans</MenuItem>
          <MenuItem value="Lato">Lato</MenuItem>
          <MenuItem value="Raleway">Raleway</MenuItem>
          <MenuItem value="Nunito Sans">Nunito Sans</MenuItem>
        </TextField>

        <TextField
          label="Font Size"
          value={style.fontSize}
          inputMode="numeric"
          onChange={({ target }) =>
            onUpdateStylesAndCurrentElements(
              "fontSize",
              Number(target.value) ?? initialStyle.fontSize
            )
          }
        />

        <TextField
          label="Line Height"
          value={style.lineHeight}
          inputMode="numeric"
          onChange={({ target }) =>
            onUpdateStylesAndCurrentElements(
              "lineHeight",
              Number(target.value) ?? initialStyle.lineHeight
            )
          }
        />
      </Stack>

      <Stack
        sx={{
          mb: 5,
          gap: 2,
          alignItems: "center",
          flexDirection: "row",
        }}
      >
        <MuiColorInput
          value={style.textColor}
          label="Text Color"
          format="hex"
          onChange={(value) =>
            onUpdateStylesAndCurrentElements("textColor", value)
          }
          fullWidth
        />

        <MuiColorInput
          value={style.backgroundColor}
          label="Background Color"
          format="hex"
          onChange={(value) =>
            onUpdateStylesAndCurrentElements("backgroundColor", value)
          }
          fullWidth
        />

        <MuiColorInput
          value={style.borderColor}
          label="Border Color"
          format="hex"
          onChange={(value) =>
            onUpdateStylesAndCurrentElements("borderColor", value)
          }
          fullWidth
        />
      </Stack>

      <FabricCanvas
        onCanvas={setCanvas}
        onSelectedElements={setSelectedElements}
      />
    </Container>
  )
}
