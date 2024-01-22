"use client"

import { useCallback, useEffect, useState } from "react"
import {
  Box,
  Button,
  Container,
  MenuItem,
  Stack,
  TextField,
  Typography,
} from "@mui/material"
import {
  Canvas,
  Circle,
  FabricImage,
  Rect,
  Textbox,
  type FabricObject,
} from "fabric"
import PDF from "jspdf"
import { MuiColorInput } from "mui-color-input"

import { dmsans } from "@/styles/fonts"

import FabricCanvas from "./fabric-canvas"

interface PageParams {
  params: {
    templateId: string
  }
}

const initialStyle = {
  fontSize: 16,
  textColor: "#000",
  textAlign: "left",
  lineHeight: 24,
  fontWeight: "400",
  fontFamily: dmsans.style.fontFamily,
  borderColor: "#000",
  backgroundColor: "#000",
}

const dumpTemplate = `{ "version": "6.0.0-beta17", "objects": [ { "rx": 0, "ry": 0, "type": "Rect", "version": "6.0.0-beta17", "originX": "left", "originY": "top", "left": 0, "top": 0, "width": 40, "height": 40, "fill": "#000", "stroke": "#000", "strokeWidth": 1, "strokeDashArray": null, "strokeLineCap": "butt", "strokeDashOffset": 0, "strokeLineJoin": "miter", "strokeUniform": false, "strokeMiterLimit": 4, "scaleX": 16.2104, "scaleY": 16.2104, "angle": 0, "flipX": false, "flipY": false, "opacity": 1, "shadow": null, "visible": true, "backgroundColor": "", "fillRule": "nonzero", "paintFirst": "fill", "globalCompositeOperation": "source-over", "skewX": 0, "skewY": 0 }, { "rx": 0, "ry": 0, "type": "Rect", "version": "6.0.0-beta17", "originX": "left", "originY": "top", "left": -60.591, "top": 405.1052, "width": 40, "height": 40, "fill": "#2d43b8", "stroke": "#2d43b8", "strokeWidth": 1, "strokeDashArray": null, "strokeLineCap": "butt", "strokeDashOffset": 0, "strokeLineJoin": "miter", "strokeUniform": false, "strokeMiterLimit": 4, "scaleX": 20.3902, "scaleY": 3.4853, "angle": 353.4102, "flipX": false, "flipY": false, "opacity": 1, "shadow": null, "visible": true, "backgroundColor": "", "fillRule": "nonzero", "paintFirst": "fill", "globalCompositeOperation": "source-over", "skewX": 0, "skewY": 0 }, { "fontSize": 32, "fontWeight": "400", "fontFamily": "'__DM_Sans_88fdc4', '__DM_Sans_Fallback_88fdc4'", "fontStyle": "normal", "lineHeight": 2, "text": "Hello world", "charSpacing": 0, "textAlign": "center", "styles": [], "pathStartOffset": 0, "pathSide": "left", "pathAlign": "baseline", "underline": false, "overline": false, "linethrough": false, "textBackgroundColor": "", "direction": "ltr", "minWidth": 20, "splitByGrapheme": false, "type": "Textbox", "version": "6.0.0-beta17", "originX": "left", "originY": "top", "left": 33.8807, "top": 448.2357, "width": 579, "height": 36.16, "fill": "#ffffff", "stroke": null, "strokeWidth": 1, "strokeDashArray": null, "strokeLineCap": "butt", "strokeDashOffset": 0, "strokeLineJoin": "miter", "strokeUniform": false, "strokeMiterLimit": 4, "scaleX": 1, "scaleY": 1, "angle": 353.3482, "flipX": false, "flipY": false, "opacity": 1, "shadow": null, "visible": true, "backgroundColor": "", "fillRule": "nonzero", "paintFirst": "fill", "globalCompositeOperation": "source-over", "skewX": 0, "skewY": 0 } ], "background": "#FFF" }`

export default function Page({ params }: PageParams) {
  const [json, setJson] = useState("")
  const [style, setStyle] = useState(initialStyle)
  const [canvas, setCanvas] = useState<Canvas[]>([])
  const [currCanvas, setCurrCanvas] = useState(0)
  const [selectedElements, setSelectedElements] = useState<FabricObject[]>([])

  const isCreate = params.templateId === "create"

  const selectedCanvas = canvas[currCanvas]

  function saveToJSON() {
    const data = selectedCanvas.toJSON()

    setJson(data)
  }

  function onClearAll() {
    selectedCanvas
      .getObjects()
      .forEach((object) => selectedCanvas.remove(object))
    selectedCanvas.discardActiveObject()
    selectedCanvas.renderAll()
  }

  function onAddText() {
    const text = new Textbox("Hello world", {
      fontSize: style.fontSize,
      fontWeight: style.fontWeight,
      lineHeight: style.lineHeight / 16,
      fontFamily: style.fontFamily,
      lockScalingY: true,
    })

    selectedCanvas.add(text)

    selectedCanvas.bringObjectToFront(text)
  }

  function onAddCircle() {
    const circle = new Circle({
      fill: style.backgroundColor,
      stroke: style.borderColor,
      radius: 20,
    })

    selectedCanvas.add(circle)

    selectedCanvas.bringObjectToFront(circle)
  }

  async function onAddImage(files: FileList | null) {
    if (!files || (files && files.length <= 0)) return

    const file = files[0]

    // Send image to backend to register.

    const path = URL.createObjectURL(file)

    const image = await FabricImage.fromURL(path)

    selectedCanvas.add(image)

    selectedCanvas.sendObjectToBack(image)
  }

  function onSendToBack() {
    selectedCanvas
      .getActiveObjects()
      .forEach((object) => selectedCanvas.sendObjectToBack(object))
    selectedCanvas.discardActiveObject()
    selectedCanvas.renderAll()
  }

  function onAddRectangle() {
    const rect = new Rect({
      fill: style.backgroundColor,
      width: 40,
      stroke: style.borderColor,
      height: 40,
    })

    selectedCanvas.add(rect)

    selectedCanvas.bringObjectToFront(rect)
  }

  const onDeleteElement = useCallback(() => {
    selectedCanvas
      .getActiveObjects()
      .forEach((object) => selectedCanvas.remove(object))
    selectedCanvas.discardActiveObject()
    selectedCanvas.renderAll()
  }, [selectedCanvas])

  async function onExportToPDF() {
    const dataURL = selectedCanvas.toDataURL({
      top: 0,
      left: 0,
      width: selectedCanvas.width,
      height: selectedCanvas.height,
      format: "png",
      quality: 100,
      multiplier: 1.0,
    })

    const pdf = new PDF("p", "mm", "a4")

    pdf.addImage(dataURL, "PNG", 10, 10, 190, 190)

    pdf.save("template.pdf")
  }

  function onUpdateStylesAndCurrentElements(
    key: keyof typeof initialStyle,
    value: string | number
  ) {
    setStyle((prev) => ({ ...prev, [key]: value }))

    if (selectedElements.length > 0) {
      selectedElements.forEach((object) => {
        if (object.type !== "textbox") {
          if (key === "backgroundColor") object.set({ fill: value })

          if (key === "borderColor") object.set({ stroke: value })
        }

        if (
          object.type === "textbox" &&
          [
            "fontSize",
            "textColor",
            "textAlign",
            "fontFamily",
            "lineHeight",
          ].includes(key)
        ) {
          const customKey = key === "textColor" ? "fill" : key

          const customValue = () => {
            if (customKey === "lineHeight") return Number(value) / 16

            if (customKey === "fontFamily") return `'${value}', sans-serif`

            return value
          }

          object.set({
            [customKey]: customValue(),
          })
        }
      })

      selectedCanvas.renderAll()
    }
  }

  useEffect(() => {
    if (!isCreate) {
      const run = async () => {
        const template = JSON.parse(JSON.stringify(dumpTemplate))

        await selectedCanvas.loadFromJSON(template)

        selectedCanvas.selection = false

        selectedCanvas.forEachObject((object) => {
          object.hasControls = false
          object.lockRotation = true
          object.lockMovementX = true
          object.lockMovementY = true
        })

        selectedCanvas.renderAll()
      }

      run()
    }
  }, [isCreate, selectedCanvas])

  useEffect(() => {
    function keyboard({ key }: KeyboardEvent) {
      if (key === "Escape") selectedCanvas.discardActiveObject()
      if (key === "Backspace") onDeleteElement()

      selectedCanvas.renderAll()
    }

    document.addEventListener("keydown", keyboard)

    return () => {
      document.removeEventListener("keydown", keyboard)
    }
  }, [selectedCanvas, onDeleteElement])

  return (
    <Container sx={{ display: "flex", flexDirection: "column" }}>
      <link
        rel="stylesheet"
        href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Lato:wght@300;400;700&family=Nunito+Sans:opsz,wght@6..12,300;6..12,400;6..12,500;6..12,600;6..12,700&family=Open+Sans:wght@300;400;500;600;700&family=Plus+Jakarta+Sans:wght@300;400;500;600;700&family=Raleway:wght@300;400;500;600;700&family=Roboto:wght@300;400;500;700&display=swap"
        crossOrigin="anonymous"
      />

      {isCreate && (
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
          <Button size="small" onClick={onSendToBack} variant="outlined">
            Send to back
          </Button>
          <Button size="small" onClick={onDeleteElement} variant="outlined">
            Delete element
          </Button>
          <Button size="small" onClick={onClearAll} variant="outlined">
            Clear all
          </Button>
        </Stack>
      )}

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

        <TextField
          label="Font Align"
          value={style.textAlign}
          select
          onChange={({ target }) =>
            onUpdateStylesAndCurrentElements("textAlign", target.value)
          }
        >
          <MenuItem value="left">Left</MenuItem>
          <MenuItem value="center">Center</MenuItem>
          <MenuItem value="right">Right</MenuItem>
        </TextField>

        <TextField
          label="Font Weight"
          value={style.fontWeight}
          select
          onChange={({ target }) =>
            onUpdateStylesAndCurrentElements("fontWeight", target.value)
          }
        >
          <MenuItem value="300">300</MenuItem>
          <MenuItem value="400">400</MenuItem>
          <MenuItem value="500">500</MenuItem>
          <MenuItem value="600">600</MenuItem>
          <MenuItem value="700">700</MenuItem>
        </TextField>
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
        canvas={canvas}
        onCanvas={setCanvas}
        numberOfPages={3}
        onSelectedElements={setSelectedElements}
      />

      <Stack
        sx={{ mt: 8, gap: 2, justifyContent: "flex-end", flexDirection: "row" }}
      >
        <Button onClick={onExportToPDF}>Export to PDF</Button>

        {isCreate && <Button onClick={saveToJSON}>Save</Button>}
      </Stack>

      {json && (
        <Box sx={{ p: 4, mt: 2, bgcolor: "gray.200", borderRadius: 2 }}>
          <Typography>{JSON.stringify(json, undefined, 2)}</Typography>
        </Box>
      )}
    </Container>
  )
}
