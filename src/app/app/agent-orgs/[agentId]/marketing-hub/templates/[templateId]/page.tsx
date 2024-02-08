"use client"

import { useCallback, useEffect, useMemo, useState } from "react"
import { useRouter } from "next/navigation"
import { RootState } from "@/redux/store"
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Button,
  InputAdornment,
  MenuItem,
  Slider,
  Stack,
  TextField,
  Typography,
} from "@mui/material"
import { Canvas, FabricImage, Textbox, type FabricObject } from "fabric"
import PDF from "jspdf"
import { ChevronDown, ChevronRight } from "lucide-react"
import { MuiColorInput } from "mui-color-input"
import { useSelector } from "react-redux"

import { dmsans } from "@/styles/fonts"

import FabricCanvas from "./fabric-canvas"

interface PageParams {
  params: {
    agentId: string
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

const dumpTemplate = {
  0: `{ "version": "6.0.0-beta17", "objects": [ { "rx": 0, "ry": 0, "type": "Rect", "version": "6.0.0-beta17", "originX": "left", "originY": "top", "left": 0, "top": 0, "width": 40, "height": 40, "fill": "#000", "stroke": "#000", "strokeWidth": 1, "strokeDashArray": null, "strokeLineCap": "butt", "strokeDashOffset": 0, "strokeLineJoin": "miter", "strokeUniform": false, "strokeMiterLimit": 4, "scaleX": 16.2104, "scaleY": 16.2104, "angle": 0, "flipX": false, "flipY": false, "opacity": 1, "shadow": null, "visible": true, "backgroundColor": "", "fillRule": "nonzero", "paintFirst": "fill", "globalCompositeOperation": "source-over", "skewX": 0, "skewY": 0 }, { "rx": 0, "ry": 0, "type": "Rect", "version": "6.0.0-beta17", "originX": "left", "originY": "top", "left": -60.591, "top": 405.1052, "width": 40, "height": 40, "fill": "#2d43b8", "stroke": "#2d43b8", "strokeWidth": 1, "strokeDashArray": null, "strokeLineCap": "butt", "strokeDashOffset": 0, "strokeLineJoin": "miter", "strokeUniform": false, "strokeMiterLimit": 4, "scaleX": 20.3902, "scaleY": 3.4853, "angle": 353.4102, "flipX": false, "flipY": false, "opacity": 1, "shadow": null, "visible": true, "backgroundColor": "", "fillRule": "nonzero", "paintFirst": "fill", "globalCompositeOperation": "source-over", "skewX": 0, "skewY": 0 }, { "fontSize": 32, "fontWeight": "400", "fontFamily": "'__DM_Sans_88fdc4', '__DM_Sans_Fallback_88fdc4'", "fontStyle": "normal", "lineHeight": 2, "text": "Hello world", "charSpacing": 0, "textAlign": "center", "styles": [], "pathStartOffset": 0, "pathSide": "left", "pathAlign": "baseline", "underline": false, "overline": false, "linethrough": false, "textBackgroundColor": "", "direction": "ltr", "minWidth": 20, "splitByGrapheme": false, "type": "Textbox", "version": "6.0.0-beta17", "originX": "left", "originY": "top", "left": 33.8807, "top": 448.2357, "width": 579, "height": 36.16, "fill": "#ffffff", "stroke": null, "strokeWidth": 1, "strokeDashArray": null, "strokeLineCap": "butt", "strokeDashOffset": 0, "strokeLineJoin": "miter", "strokeUniform": false, "strokeMiterLimit": 4, "scaleX": 1, "scaleY": 1, "angle": 353.3482, "flipX": false, "flipY": false, "opacity": 1, "shadow": null, "visible": true, "backgroundColor": "", "fillRule": "nonzero", "paintFirst": "fill", "globalCompositeOperation": "source-over", "skewX": 0, "skewY": 0 } ], "background": "#FFF" }`,
}

export default function Page({ params }: PageParams) {
  const [style, setStyle] = useState(initialStyle)
  const [canvas, setCanvas] = useState<Canvas[]>([])
  const [currCanvas, setCurrCanvas] = useState(0)
  const [selectedElements, setSelectedElements] = useState<FabricObject[]>([])

  const { back } = useRouter()

  const selectedCanvas = canvas[currCanvas]

  const agentOrgs = useSelector((state: RootState) => state.app.agentOrgs)

  const org = useMemo(
    () => agentOrgs.find((agent) => agent._id === params.agentId)?.org,
    [params.agentId, agentOrgs]
  )

  function onSave() {
    const data = {} as Record<string, string>

    canvas.forEach((curr, index) => {
      data[index] = curr.toJSON()
    })

    console.log(JSON.stringify(data))
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

  const onDeleteElement = useCallback(() => {
    selectedCanvas
      .getActiveObjects()
      .forEach((object) => selectedCanvas.remove(object))
    selectedCanvas.discardActiveObject()
    selectedCanvas.renderAll()
  }, [selectedCanvas])

  async function onExportToPDF() {
    const pdf = new PDF("p", "mm", "a4")

    canvas.forEach((curr, index) => {
      if (index !== 0) pdf.addPage()

      const dataURL = curr.toDataURL({
        top: 0,
        left: 0,
        width: selectedCanvas.width,
        height: selectedCanvas.height,
        format: "png",
        quality: 100,
        multiplier: 1.0,
      })

      pdf.addImage(dataURL, "PNG", 10, 10, 190, 190)
    })

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
            "fontWeight",
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
    if (canvas.length > 0) {
      const run = async () => {
        const templates = JSON.parse(JSON.stringify(dumpTemplate)) as Record<
          string,
          string
        >

        Object.entries(templates).forEach(async ([key, value]) => {
          const selectedCanvas = canvas[Number(key)]

          const ctx = selectedCanvas.contextTop

          if (!ctx) return

          await selectedCanvas.loadFromJSON(value)

          selectedCanvas.selection = false

          selectedCanvas.forEachObject((object) => {
            object.hasControls = false
            object.lockRotation = true
            object.lockMovementX = true
            object.lockMovementY = true
          })

          selectedCanvas.renderAll()
        })
      }

      run()
    }
  }, [canvas])

  useEffect(() => {
    function keyboard({ key }: KeyboardEvent) {
      if (key === "Escape") selectedCanvas.discardActiveObject()
      if (key === "Backspace" && selectedElements.length <= 0) onDeleteElement()

      selectedCanvas.renderAll()
    }

    document.addEventListener("keydown", keyboard)

    return () => {
      document.removeEventListener("keydown", keyboard)
    }
  }, [selectedCanvas, onDeleteElement, selectedElements])

  const colors = useMemo(() => {
    const palette: string[] = ["#000", "#FFF"]

    if (org?.brand) palette.push(...org.brand.colors)

    return palette
  }, [org])

  const selectedCurrentElement = useMemo(() => {
    if (selectedElements.length > 0) {
      const elem = selectedElements[0]

      if (elem instanceof Textbox) {
        return {
          elem,
          type: "TEXT",
        }
      }
    }

    return null
  }, [selectedElements])

  console.log({ selectedCurrentElement })

  return (
    <Stack
      sx={{
        height: "calc(100vh - 4rem)",
        bgcolor: "gray.100",
        flexDirection: "row",
      }}
    >
      <link
        rel="stylesheet"
        href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Lato:wght@300;400;700&family=Nunito+Sans:opsz,wght@6..12,300;6..12,400;6..12,500;6..12,600;6..12,700&family=Open+Sans:wght@300;400;500;600;700&family=Plus+Jakarta+Sans:wght@300;400;500;600;700&family=Raleway:wght@300;400;500;600;700&family=Roboto:wght@300;400;500;700&display=swap"
        crossOrigin="anonymous"
      />

      <Stack sx={{ p: 4, gap: 4, flexGrow: 1, overflow: "auto" }}>
        <Stack
          sx={{
            gap: 2,
            alignItems: "center",
            flexDirection: "row",
            justifyContent: "space-between",
          }}
        >
          <Button size="small" onClick={back} variant="outlined">
            Back to All Templates
          </Button>
        </Stack>

        <FabricCanvas
          onCanvas={setCanvas}
          currCanvas={currCanvas}
          onCurrCanvas={setCurrCanvas}
          numberOfPages={3}
          onSelectedElements={setSelectedElements}
        />
      </Stack>

      <Stack
        sx={{
          width: "100%",
          height: "100%",
          bgcolor: "white",
          maxWidth: "27rem",
          overflowY: "auto",
          borderLeft: "1px solid",
          borderColor: "gray.300",
        }}
      >
        <Stack
          sx={{
            p: 4,
            borderBottom: "1px solid",
            borderBottomColor: "gray.200",
          }}
        >
          <Accordion defaultExpanded>
            <AccordionSummary expandIcon={<ChevronDown />}>
              <Typography variant="h6">
                Populate template with listing data
              </Typography>
            </AccordionSummary>

            <AccordionDetails sx={{ px: 0 }}>
              <TextField
                label="Search Address or MLS"
                fullWidth
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <Button
                        sx={{
                          p: 1,
                          width: "2rem",
                          height: "2rem",
                          minWidth: "2rem",
                        }}
                      >
                        <ChevronRight />
                      </Button>
                    </InputAdornment>
                  ),
                }}
              />
            </AccordionDetails>
          </Accordion>
        </Stack>

        {!selectedCurrentElement && (
          <>
            <Stack
              sx={{
                p: 4,
                gap: 2,
                flexWrap: "wrap",
                borderBottom: "1px solid",
                flexDirection: "row",
                borderBottomColor: "gray.200",
              }}
            >
              <Button
                sx={{ width: "47%" }}
                size="small"
                variant="outlined"
                onClick={onSave}
              >
                Save draft
              </Button>

              <Button
                sx={{ width: "47%" }}
                size="small"
                variant="outlined"
                onClick={onExportToPDF}
              >
                Share
              </Button>

              <Button sx={{ width: "47%" }} size="small" variant="outlined">
                Download image
              </Button>

              <Button sx={{ width: "47%" }} size="small" variant="outlined">
                Schedule
              </Button>
            </Stack>

            {org?.brand?.colors && (
              <Stack
                sx={{
                  p: 4,
                  gap: 2,
                  borderBottom: "1px solid",
                  borderBottomColor: "gray.200",
                }}
              >
                <Typography variant="h6">Brand colours</Typography>

                <Stack sx={{ gap: 2, flexWrap: "wrap", flexDirection: "row" }}>
                  {colors.map((color) => (
                    <Box
                      sx={{
                        width: "2.5rem",
                        height: "2.5rem",
                        border: "1px solid",
                        bgcolor: color,
                        borderColor: "gray.200",
                        borderRadius: ".75rem",
                      }}
                      key={color}
                    />
                  ))}
                </Stack>
              </Stack>
            )}

            <Typography sx={{ py: 4, px: 14, textAlign: "center" }}>
              Click the elements on the template to edit them.
            </Typography>
          </>
        )}

        {selectedCurrentElement && (
          <Stack>
            {selectedCurrentElement.type === "TEXT" && (
              <Stack
                sx={{
                  p: 4,
                  gap: 2,
                  borderBottom: "1px solid",
                  borderBottomColor: "gray.200",
                }}
              >
                <Typography variant="h6">Font Size</Typography>

                <Slider min={12} step={1} max={48} />
              </Stack>
            )}
          </Stack>
        )}

        {selectedCurrentElement?.type === "TEXT" && (
          <>
            <Stack
              sx={{
                mb: 2,
                gap: {
                  xs: 1,
                  sm: 2,
                },
                flexWrap: "wrap",
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
                gap: {
                  xs: 1,
                  sm: 2,
                },
                flexWrap: "wrap",
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
          </>
        )}
      </Stack>
    </Stack>
  )
}
