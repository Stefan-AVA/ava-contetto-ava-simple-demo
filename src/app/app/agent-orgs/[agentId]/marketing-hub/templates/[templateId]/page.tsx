"use client"

import { useCallback, useEffect, useMemo, useState } from "react"
import { useRouter } from "next/navigation"
import { useGetOrgTemplateQuery } from "@/redux/apis/templates"
import { RootState } from "@/redux/store"
import { Box, Button, Stack, useMediaQuery } from "@mui/material"
import {
  Canvas,
  Circle,
  FabricImage,
  Rect,
  Textbox,
  type FabricObject,
} from "fabric"
import PDF from "jspdf"
import {
  CalendarCheck2,
  ChevronLeft,
  DownloadCloud,
  Share2,
  UploadCloud,
} from "lucide-react"
import { useSelector } from "react-redux"

import FabricCanvas from "./fabric-canvas"
import LateralActions from "./lateral-actions"
import SearchField from "./search-field"
import type { SelectedElement } from "./types"

interface PageParams {
  params: {
    agentId: string
    templateId: string
  }
}

export default function Page({ params }: PageParams) {
  const [canvas, setCanvas] = useState<Canvas[]>([])
  const [currCanvas, setCurrCanvas] = useState(0)
  const [selectedElements, setSelectedElements] = useState<FabricObject[]>([])

  const { back } = useRouter()

  const isResponsive = useMediaQuery("(max-width:900px)")

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

  async function onSave() {
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

  function onClearSelectedElements() {
    selectedCanvas.discardActiveObject()

    selectedCanvas.renderAll()
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

  return (
    <Stack
      sx={{
        height: "calc(100vh - 4rem)",
        bgcolor: "gray.100",
        flexDirection: {
          xs: "column",
          md: "row",
        },
      }}
    >
      <link
        rel="stylesheet"
        href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Lato:wght@300;400;700&family=Nunito+Sans:opsz,wght@6..12,300;6..12,400;6..12,500;6..12,600;6..12,700&family=Open+Sans:wght@300;400;500;600;700&family=Plus+Jakarta+Sans:wght@300;400;500;600;700&family=Raleway:wght@300;400;500;600;700&family=Roboto:wght@300;400;500;700&display=swap"
        crossOrigin="anonymous"
      />

      {isResponsive && (
        <>
          <Stack
            sx={{
              py: 3,
              px: 4,
              bgcolor: "white",
              alignItems: "center",
              borderBottom: "1px solid",
              flexDirection: "row",
              justifyContent: "space-between",
              borderBottomColor: "gray.300",
            }}
          >
            <Box
              sx={{
                px: 0,
                color: "gray.700",
                border: "none",
              }}
              onClick={back}
              component="button"
            >
              <ChevronLeft />
            </Box>

            <Stack
              sx={{
                gap: 2,
                alignItems: "center",
                flexDirection: "row",
              }}
            >
              <Box
                sx={{ color: "gray.700" }}
                onClick={onSave}
                component="button"
              >
                <UploadCloud />
              </Box>

              <Box
                sx={{ color: "gray.700" }}
                onClick={onExportToPDF}
                component="button"
              >
                <DownloadCloud />
              </Box>

              <Box sx={{ color: "gray.700" }} component="button">
                <Share2 />
              </Box>

              <Box sx={{ color: "gray.700" }} component="button">
                <CalendarCheck2 />
              </Box>
            </Stack>
          </Stack>

          <SearchField orgId={currentOrg.orgId as string} isResponsive />
        </>
      )}

      <Stack sx={{ p: 4, gap: 4, flexGrow: 1, overflow: "auto" }}>
        {!isResponsive && (
          <Button
            sx={{ width: "fit-content" }}
            size="small"
            onClick={back}
            variant="outlined"
          >
            Back to All Templates
          </Button>
        )}

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
          top: {
            xs: "4rem",
            md: 0,
          },
          width: "100%",
          right: 0,
          height: {
            xs: "calc(100vh - 4rem)",
            md: "100%",
          },
          zIndex: 2,
          bgcolor: "white",
          maxWidth: {
            xs: selectedElements.length > 0 ? "100%" : 0,
            md: "27rem",
          },
          position: {
            xs: "fixed",
            md: "relative",
          },
          overflowY: "auto",
          transition: "all .3s ease-in-out",
          borderLeft: "1px solid",
          borderColor: "gray.300",
          transformOrigin: "right",
        }}
      >
        {isResponsive && (
          <Stack
            sx={{
              pt: 2,
              px: 4,
            }}
          >
            <Box
              sx={{
                px: 0,
                color: "gray.700",
              }}
              onClick={onClearSelectedElements}
              component="button"
            >
              <ChevronLeft />
            </Box>
          </Stack>
        )}

        {!isResponsive && <SearchField orgId={currentOrg.orgId as string} />}

        <LateralActions
          onSave={onSave}
          isResponsive={isResponsive}
          onExportToPDF={onExportToPDF}
          selectedCanvas={selectedCanvas}
          selectedElements={selectedElements}
          selectedCurrentElement={selectedCurrentElement}
        />
      </Stack>
    </Stack>
  )
}
