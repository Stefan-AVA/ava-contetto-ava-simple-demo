"use client"

import { useCallback, useEffect, useMemo, useState } from "react"
import { useRouter } from "next/navigation"
import { useGetOrgTemplateQuery } from "@/redux/apis/templates"
import { RootState } from "@/redux/store"
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Button,
  InputAdornment,
  Slider,
  Stack,
  TextField,
  Typography,
} from "@mui/material"
import { Canvas, FabricImage, Textbox, type FabricObject } from "fabric"
import PDF from "jspdf"
import { ChevronDown, ChevronRight, Minus, Plus } from "lucide-react"
import { useSelector } from "react-redux"

import FabricCanvas from "./fabric-canvas"
import { styles, textAligns } from "./utils"

interface BrandColoursProps {
  onChange?: (color: string) => void
}

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
  fontStyle: "normal",
  underline: false,
  fontWeight: "400",
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

  const currentOrg = useMemo(
    () => agentOrgs.find((agent) => agent._id === params.agentId)!,
    [params.agentId, agentOrgs]
  )

  const { data } = useGetOrgTemplateQuery(
    {
      orgId: currentOrg.orgId as string,
      templateId: params.templateId,
    },
    {
      skip: !currentOrg,
    }
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
    value: string | number | boolean
  ) {
    let customValue = value

    if (key === "fontStyle")
      customValue =
        style.fontStyle === value ? initialStyle.fontStyle : "italic"

    if (key === "fontWeight")
      customValue = style.fontWeight === value ? initialStyle.fontWeight : "700"

    if (key === "underline") customValue = !style.underline

    console.log({ key, customValue })

    setStyle((prev) => ({ ...prev, [key]: customValue }))

    if (selectedElements.length > 0) {
      selectedElements.forEach((object) => {
        if (object.type !== "textbox") {
          if (key === "backgroundColor") object.set({ fill: customValue })
        }

        if (
          object.type === "textbox" &&
          [
            "fontSize",
            "textColor",
            "textAlign",
            "underline",
            "fontStyle",
            "fontWeight",
          ].includes(key)
        ) {
          const customKey = key === "textColor" ? "fill" : key

          object.set({
            [customKey]: customValue,
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
    const palette: string[] = []

    if (currentOrg.org?.brand) palette.push(...currentOrg.org.brand.colors)

    palette.push(...["#000", "#FFF"])

    return palette
  }, [currentOrg.org])

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

  const BrandColours = useCallback(
    ({ onChange }: BrandColoursProps) => {
      if (currentOrg.org?.brand?.colors) {
        return (
          <Stack
            sx={{
              p: 4,
              gap: 2,
              borderBottom: "1px solid",
              borderBottomColor: "gray.200",
            }}
          >
            <Typography variant="h6">Brand colours</Typography>

            <Stack sx={{ gap: 4, flexWrap: "wrap", flexDirection: "row" }}>
              {colors.map((color) => (
                <Stack
                  sx={{
                    gap: 2,
                    width: onChange ? "45%" : "auto",
                    cursor: onChange ? "pointer" : "default",
                    alignItems: "center",
                    flexDirection: "row",
                  }}
                  key={color}
                  onClick={() => onChange?.(color)}
                >
                  <Box
                    sx={{
                      width: "2.5rem",
                      height: "2.5rem",
                      border: "1px solid",
                      bgcolor: color,
                      borderColor: color !== "#FFF" ? color : "gray.300",
                      borderRadius: ".75rem",
                    }}
                  />

                  {onChange && (
                    <Typography sx={{ color: "primary.main" }}>
                      {color.toUpperCase()}
                    </Typography>
                  )}
                </Stack>
              ))}
            </Stack>
          </Stack>
        )
      }

      return null
    },
    [colors, currentOrg.org?.brand?.colors]
  )

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

            <BrandColours />

            <Typography sx={{ py: 4, px: 14, textAlign: "center" }}>
              Click the elements on the template to edit them.
            </Typography>
          </>
        )}

        {selectedCurrentElement && (
          <Stack>
            {selectedCurrentElement.type === "TEXT" && (
              <>
                <Stack
                  sx={{
                    p: 4,
                    gap: 2,
                    borderBottom: "1px solid",
                    borderBottomColor: "gray.200",
                  }}
                >
                  <Typography variant="h6">Font Size</Typography>

                  <Stack
                    sx={{
                      gap: 3,
                      alignItems: "center",
                      flexDirection: "row",
                    }}
                  >
                    <Stack
                      sx={{
                        width: "1.5rem",
                        color: "primary.main",
                        height: "1.5rem",
                        cursor:
                          style.fontSize <= 12 ? "not-allowed" : "pointer",
                        border: "1px solid",
                        alignItems: "center",
                        borderColor: "primary.main",
                        borderRadius: "50%",
                        justifyContent: "center",
                      }}
                      onClick={() =>
                        onUpdateStylesAndCurrentElements(
                          "fontSize",
                          style.fontSize > 12
                            ? style.fontSize - 1
                            : style.fontSize
                        )
                      }
                      disabled={style.fontSize <= 12}
                      component="button"
                    >
                      <Minus />
                    </Stack>

                    <Slider
                      min={12}
                      max={48}
                      step={1}
                      value={style.fontSize}
                      onChange={(_, value) =>
                        onUpdateStylesAndCurrentElements(
                          "fontSize",
                          (value as number) ?? initialStyle.fontSize
                        )
                      }
                      valueLabelDisplay="auto"
                    />

                    <Stack
                      sx={{
                        width: "1.5rem",
                        color: "primary.main",
                        height: "1.5rem",
                        cursor:
                          style.fontSize >= 48 ? "not-allowed" : "pointer",
                        border: "1px solid",
                        alignItems: "center",
                        borderColor: "primary.main",
                        borderRadius: "50%",
                        justifyContent: "center",
                      }}
                      onClick={() =>
                        onUpdateStylesAndCurrentElements(
                          "fontSize",
                          style.fontSize < 48
                            ? style.fontSize + 1
                            : style.fontSize
                        )
                      }
                      disabled={style.fontSize >= 48}
                      component="button"
                    >
                      <Plus />
                    </Stack>
                  </Stack>
                </Stack>

                <BrandColours
                  onChange={(color) =>
                    onUpdateStylesAndCurrentElements("textColor", color)
                  }
                />

                <Stack
                  sx={{
                    p: 4,
                    gap: 2,
                    borderBottom: "1px solid",
                    borderBottomColor: "gray.200",
                  }}
                >
                  <Typography variant="h6">Style</Typography>

                  <Stack
                    sx={{
                      gap: 3,
                      alignItems: "center",
                      flexDirection: "row",
                      justifyContent: "space-between",
                    }}
                  >
                    {styles.map(({ key, type, icon: Icon }) => (
                      <Box
                        sx={{ color: "primary.main", cursor: "pointer" }}
                        key={key.toString()}
                        onClick={() =>
                          onUpdateStylesAndCurrentElements(
                            type as keyof typeof initialStyle,
                            key
                          )
                        }
                        component={Icon}
                      />
                    ))}
                  </Stack>
                </Stack>

                <Stack
                  sx={{
                    p: 4,
                    gap: 2,
                    borderBottom: "1px solid",
                    borderBottomColor: "gray.200",
                  }}
                >
                  <Typography variant="h6">Text Allignment</Typography>

                  <Stack
                    sx={{
                      gap: 3,
                      alignItems: "center",
                      flexDirection: "row",
                      justifyContent: "space-between",
                    }}
                  >
                    {textAligns.map(({ key, icon: Icon }) => (
                      <Box
                        sx={{ color: "primary.main", cursor: "pointer" }}
                        key={key}
                        onClick={() =>
                          onUpdateStylesAndCurrentElements("textAlign", key)
                        }
                        component={Icon}
                      />
                    ))}
                  </Stack>
                </Stack>
              </>
            )}
          </Stack>
        )}
      </Stack>
    </Stack>
  )
}
