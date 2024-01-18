"use client"

import { useEffect, useState } from "react"
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
  lineHeight: 24,
  fontWeight: "400",
  fontFamily: dmsans.style.fontFamily,
  borderColor: "#000",
  backgroundColor: "#000",
}

const dumpTemplate = `{ "version": "6.0.0-beta17", "objects": [ { "fontSize": 16, "fontWeight": "400", "fontFamily": "'__DM_Sans_88fdc4', '__DM_Sans_Fallback_88fdc4'", "fontStyle": "normal", "lineHeight": 1.5, "text": "Hello world", "charSpacing": 0, "textAlign": "left", "styles": [], "pathStartOffset": 0, "pathSide": "left", "pathAlign": "baseline", "underline": false, "overline": false, "linethrough": false, "textBackgroundColor": "", "direction": "ltr", "minWidth": 20, "splitByGrapheme": false, "type": "Textbox", "version": "6.0.0-beta17", "originX": "left", "originY": "top", "left": 80, "top": 57, "width": 118, "height": 18.08, "fill": "rgb(0,0,0)", "stroke": null, "strokeWidth": 1, "strokeDashArray": null, "strokeLineCap": "butt", "strokeDashOffset": 0, "strokeLineJoin": "miter", "strokeUniform": false, "strokeMiterLimit": 4, "scaleX": 1, "scaleY": 1, "angle": 0, "flipX": false, "flipY": false, "opacity": 1, "shadow": null, "visible": true, "backgroundColor": "", "fillRule": "nonzero", "paintFirst": "fill", "globalCompositeOperation": "source-over", "skewX": 0, "skewY": 0 }, { "radius": 20, "startAngle": 0, "endAngle": 360, "type": "Circle", "version": "6.0.0-beta17", "originX": "left", "originY": "top", "left": 169, "top": 110, "width": 40, "height": 40, "fill": "#000", "stroke": "#000", "strokeWidth": 1, "strokeDashArray": null, "strokeLineCap": "butt", "strokeDashOffset": 0, "strokeLineJoin": "miter", "strokeUniform": false, "strokeMiterLimit": 4, "scaleX": 1, "scaleY": 1, "angle": 0, "flipX": false, "flipY": false, "opacity": 1, "shadow": null, "visible": true, "backgroundColor": "", "fillRule": "nonzero", "paintFirst": "fill", "globalCompositeOperation": "source-over", "skewX": 0, "skewY": 0 }, { "rx": 0, "ry": 0, "type": "Rect", "version": "6.0.0-beta17", "originX": "left", "originY": "top", "left": 80, "top": 106, "width": 40, "height": 40, "fill": "#000", "stroke": "#000", "strokeWidth": 1, "strokeDashArray": null, "strokeLineCap": "butt", "strokeDashOffset": 0, "strokeLineJoin": "miter", "strokeUniform": false, "strokeMiterLimit": 4, "scaleX": 1, "scaleY": 1, "angle": 0, "flipX": false, "flipY": false, "opacity": 1, "shadow": null, "visible": true, "backgroundColor": "", "fillRule": "nonzero", "paintFirst": "fill", "globalCompositeOperation": "source-over", "skewX": 0, "skewY": 0 } ], "background": "#FFF" }`

export default function Page({ params }: PageParams) {
  const [json, setJson] = useState("")
  const [style, setStyle] = useState(initialStyle)
  const [canvas, setCanvas] = useState<Canvas | null>(null)
  const [selectedElements, setSelectedElements] = useState<FabricObject[]>([])

  const isCreate = params.templateId === "create"

  function saveToJSON() {
    if (!canvas) return

    const data = canvas.toJSON()

    setJson(data)
  }

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
      fontWeight: style.fontWeight,
      lineHeight: style.lineHeight / 16,
      fontFamily: style.fontFamily,
      lockScalingY: true,
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

  async function onExportToPDF() {
    if (!canvas) return

    const dataURL = canvas.toDataURL({
      top: 0,
      left: 0,
      width: canvas.width,
      height: canvas.height,
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

    if (canvas && selectedElements.length > 0) {
      selectedElements.forEach((object) => {
        if (object.type !== "textbox") {
          if (key === "backgroundColor") object.set({ fill: value })

          if (key === "borderColor") object.set({ stroke: value })
        }

        if (
          object.type === "textbox" &&
          ["fontSize", "textColor", "fontFamily", "lineHeight"].includes(key)
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

      canvas.renderAll()
    }
  }

  useEffect(() => {
    if (canvas && !isCreate) {
      const run = async () => {
        const template = JSON.parse(JSON.stringify(dumpTemplate))

        await canvas.loadFromJSON(template)

        canvas.selection = false

        canvas.forEachObject((object) => {
          object.hasControls = false
          object.lockRotation = true
          object.lockMovementX = true
          object.lockMovementY = true
        })

        canvas.renderAll()
      }

      run()
    }
  }, [canvas, isCreate])

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
        onCanvas={setCanvas}
        onSelectedElements={setSelectedElements}
      />

      <Stack
        sx={{ mt: 8, gap: 2, justifyContent: "flex-end", flexDirection: "row" }}
      >
        <Button onClick={onExportToPDF}>Export to PDF</Button>

        <Button onClick={saveToJSON}>Save</Button>
      </Stack>

      {json && (
        <Box sx={{ p: 4, mt: 2, bgcolor: "gray.200", borderRadius: 2 }}>
          <Typography>{JSON.stringify(json, undefined, 2)}</Typography>
        </Box>
      )}
    </Container>
  )
}
