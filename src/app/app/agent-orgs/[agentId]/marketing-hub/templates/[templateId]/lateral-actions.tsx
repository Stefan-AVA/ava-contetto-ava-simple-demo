import { useMemo, useState } from "react"
import Image from "next/image"
import { useParams } from "next/navigation"
import { type RootState } from "@/redux/store"
import {
  Box,
  Button,
  Unstable_Grid2 as Grid,
  Stack,
  Typography,
} from "@mui/material"
import { Canvas, type FabricObject } from "fabric"
import { useSelector } from "react-redux"

import BrandColours from "./brand-colours"
import ReplacePhoto from "./replace-photo"
import Slider from "./slider"
import type { SelectedElement } from "./types"
import { rotate, styles, textAligns } from "./utils"
import WrapperAction from "./wrapper-action"

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

interface LateralActionsProps {
  onSave: () => Promise<void>
  isResponsive: boolean
  onExportToPDF: () => Promise<void>
  selectedCanvas: Canvas
  selectedElements: FabricObject[]
  selectedCurrentElement: SelectedElement | null
}

export default function LateralActions({
  onSave,
  isResponsive,
  onExportToPDF,
  selectedCanvas,
  selectedElements,
  selectedCurrentElement,
}: LateralActionsProps) {
  const [style, setStyle] = useState(initialStyle)

  const params = useParams()

  const agentOrgs = useSelector((state: RootState) => state.app.agentOrgs)

  const currentOrg = useMemo(
    () => agentOrgs.find((agent) => agent._id === params.agentId)!,
    [params.agentId, agentOrgs]
  )

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

  const logos = currentOrg.org?.brand?.logos ?? []
  const colors = currentOrg.org?.brand?.colors ?? []

  return (
    <Stack>
      {!selectedCurrentElement && (
        <>
          {!isResponsive && (
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
          )}

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
  )
}
