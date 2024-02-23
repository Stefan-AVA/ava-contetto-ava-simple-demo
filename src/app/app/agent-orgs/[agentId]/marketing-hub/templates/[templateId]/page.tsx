"use client"

import { useCallback, useEffect, useMemo, useState } from "react"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { useGetOrgTemplateQuery } from "@/redux/apis/templates"
import { RootState } from "@/redux/store"
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Button,
  Unstable_Grid2 as Grid,
  InputAdornment,
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
import { ChevronDown, ChevronRight } from "lucide-react"
import { useSelector } from "react-redux"

import BrandColours from "./brand-colours"
import FabricCanvas from "./fabric-canvas"
import ReplacePhoto from "./replace-photo"
import Slider from "./slider"
import { rotate, styles, textAligns } from "./utils"
import WrapperAction from "./wrapper-action"

type SelectedText = {
  type: "TEXT"
  elem: Textbox
}

type SelectedLogo = {
  type: "LOGO"
  elem: FabricImage
}

type SelectedImage = {
  type: "IMAGE"
  elem: FabricImage
}

type SelectedSymbol = {
  type: "SYMBOL"
  elem: Rect | Circle
}

type SelectedElement =
  | SelectedText
  | SelectedLogo
  | SelectedImage
  | SelectedSymbol

interface PageParams {
  params: {
    agentId: string
    templateId: string
  }
}

const initialStyle = {
  zoom: 1,
  fontSize: 16,
  textColor: "#000",
  textAlign: "left",
  fontStyle: "normal",
  underline: false,
  fontWeight: "400",
  backgroundColor: "#000",
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

  const selectedCurrentElement: SelectedElement | null = useMemo(() => {
    if (selectedElements.length > 0) {
      const elem = selectedElements[0]

      if (elem instanceof Textbox) {
        return {
          elem,
          type: "TEXT",
        }
      }

      if (elem instanceof Circle || elem instanceof Rect) {
        return {
          elem,
          type: "SYMBOL",
        }
      }

      if (elem instanceof FabricImage) {
        const block = elem as FabricImage & { id: string }

        if (block.id === "logo") {
          return {
            elem,
            type: "LOGO",
          }
        }

        if (block.id === "image") {
          return {
            elem,
            type: "IMAGE",
          }
        }
      }
    }

    return null
  }, [selectedElements])

  async function onUpdateLogoOrImage(fileUrl: string) {
    if (
      selectedCurrentElement &&
      (selectedCurrentElement.type === "LOGO" ||
        selectedCurrentElement.type === "IMAGE")
    ) {
      await selectedCurrentElement.elem.setSrc(fileUrl)

      selectedCanvas.renderAll()
    }
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
    key: keyof typeof initialStyle | "rotate",
    value: string | number | boolean
  ) {
    let customValue = value

    if (key === "fontStyle")
      customValue =
        style.fontStyle === value ? initialStyle.fontStyle : "italic"

    if (key === "fontWeight")
      customValue = style.fontWeight === value ? initialStyle.fontWeight : "700"

    if (key === "underline") customValue = !style.underline

    setStyle((prev) => ({ ...prev, [key]: customValue }))

    if (selectedElements.length > 0) {
      selectedElements.forEach((object) => {
        if (object.type === "image") {
          if (key === "zoom") object.scale(value as number)

          if (key === "rotate") {
            const angle = object.angle

            const newAngle =
              angle === 355 ? 0 : angle + (value === "right" ? 10 : -10)

            object.rotate(newAngle)
          }
        }

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
    if (data && canvas.length > 0) {
      const run = async () => {
        const templates = data.template.data

        const layoutTemplate = data.template.layout

        for await (const [key, value] of templates.entries()) {
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
        }

        for (const object of canvas) {
          object.setDimensions({
            width: layoutTemplate.width,
            height: layoutTemplate.height,
          })

          object.renderAll()
        }
      }

      run()
    }
  }, [data, canvas])

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

  const logos = currentOrg.org?.brand?.logos ?? []
  const colors = currentOrg.org?.brand?.colors ?? []

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

            <BrandColours brandColours={colors} />

            <Typography sx={{ py: 4, px: 14, textAlign: "center" }}>
              Click the elements on the template to edit them.
            </Typography>
          </>
        )}

        {selectedCurrentElement && (
          <Stack>
            {selectedCurrentElement.type === "TEXT" && (
              <>
                <WrapperAction title="Font Size">
                  <Slider
                    min={12}
                    max={48}
                    step={1}
                    value={style.fontSize}
                    onAdd={(value) =>
                      onUpdateStylesAndCurrentElements("fontSize", value)
                    }
                    onRemove={(value) =>
                      onUpdateStylesAndCurrentElements("fontSize", value)
                    }
                    onChange={(_, value) =>
                      onUpdateStylesAndCurrentElements(
                        "fontSize",
                        (value as number) ?? initialStyle.fontSize
                      )
                    }
                  />
                </WrapperAction>

                <BrandColours
                  onChange={(color) =>
                    onUpdateStylesAndCurrentElements("textColor", color)
                  }
                  brandColours={colors}
                />

                <WrapperAction title="Style">
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
                </WrapperAction>

                <WrapperAction title="Text Allignment">
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
                </WrapperAction>
              </>
            )}

            {selectedCurrentElement.type === "LOGO" && (
              <WrapperAction title="Replace Logo">
                {logos.length > 0 && (
                  <Grid container spacing={3}>
                    {logos.map((logo) => (
                      <Grid xs={6} key={logo}>
                        <Image
                          src={logo}
                          alt=""
                          width={180}
                          style={{
                            objectFit: "contain",
                            borderRadius: ".75rem",
                          }}
                          height={140}
                          onClick={() => onUpdateLogoOrImage(logo)}
                        />
                      </Grid>
                    ))}
                  </Grid>
                )}
              </WrapperAction>
            )}

            {selectedCurrentElement.type === "IMAGE" && (
              <>
                <WrapperAction title="Replace Photo">
                  <ReplacePhoto
                    orgId={currentOrg.orgId as string}
                    onSelectImage={onUpdateLogoOrImage}
                  />
                </WrapperAction>

                <WrapperAction title="Rotate">
                  <Stack
                    sx={{
                      gap: 3,
                      alignItems: "center",
                      flexDirection: "row",
                    }}
                  >
                    {rotate.map(({ key, icon: Icon }) => (
                      <Box
                        sx={{ color: "primary.main", cursor: "pointer" }}
                        key={key}
                        onClick={() =>
                          onUpdateStylesAndCurrentElements("rotate", key)
                        }
                        component={Icon}
                      />
                    ))}
                  </Stack>
                </WrapperAction>
              </>
            )}

            {selectedCurrentElement.type === "SYMBOL" && (
              <BrandColours
                onChange={(color) =>
                  onUpdateStylesAndCurrentElements("backgroundColor", color)
                }
                brandColours={colors}
              />
            )}

            {["LOGO", "IMAGE"].includes(selectedCurrentElement.type) && (
              <WrapperAction title="Zoom">
                <Slider
                  min={0.1}
                  max={2}
                  step={0.1}
                  value={style.zoom}
                  onAdd={(value) =>
                    onUpdateStylesAndCurrentElements("zoom", value)
                  }
                  onRemove={(value) =>
                    onUpdateStylesAndCurrentElements("zoom", value)
                  }
                  onChange={(_, value) =>
                    onUpdateStylesAndCurrentElements(
                      "zoom",
                      (value as number) ?? initialStyle.zoom
                    )
                  }
                />
              </WrapperAction>
            )}
          </Stack>
        )}
      </Stack>
    </Stack>
  )
}
