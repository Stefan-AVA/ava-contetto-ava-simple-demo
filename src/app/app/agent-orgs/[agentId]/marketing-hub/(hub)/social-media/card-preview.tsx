"use client"

import { useEffect, useRef, type Dispatch, type SetStateAction } from "react"
import { Route } from "next"
import Link from "next/link"
import { useParams } from "next/navigation"
import { useHideShowTemplateMutation } from "@/redux/apis/templates"
import { parseError } from "@/utils/error"
import {
  Box,
  CircularProgress,
  Unstable_Grid2 as Grid,
  Stack,
  Tooltip,
} from "@mui/material"
import { Canvas, type CanvasOptions } from "fabric"
import { Eye, EyeOff } from "lucide-react"
import { useSnackbar } from "notistack"

import type { IOrgTemplate } from "@/types/orgTemplate.types"

interface CardPreviewProps {
  data: IOrgTemplate[]
  orgId: string
  onCanvas: Dispatch<SetStateAction<Canvas[]>>
  hasAHideButton?: boolean
}

/**
 * @todo
 * Adjust the card width according to the screen width.
 */
const WIDTH = 344 - 8

export default function CardPreview({
  data,
  orgId,
  onCanvas,
  hasAHideButton,
}: CardPreviewProps) {
  const ref = useRef<HTMLCanvasElement[]>([])

  const params = useParams()

  const { enqueueSnackbar } = useSnackbar()

  const [hideShowTemplate, { isLoading: isLoadingHideShowTemplate }] =
    useHideShowTemplateMutation()

  async function onHide(templateId: string, hidden: boolean) {
    hideShowTemplate({
      orgId,
      hidden,
      templateId,
    })
      .unwrap()
      .then(() =>
        enqueueSnackbar(
          `Template ${hidden ? "hidden" : "unhidden"} successfully`,
          { variant: "success" }
        )
      )
      .catch((error) =>
        enqueueSnackbar(parseError(error), { variant: "error" })
      )
  }

  useEffect(() => {
    const options: Partial<CanvasOptions> = {
      width: WIDTH,
      height: WIDTH,
    }

    const createdCanvas = [] as Canvas[]

    const refs = ref.current && ref.current.length > 0

    if (refs) {
      data.forEach((_, index) => {
        if (createdCanvas[index]) return

        const currRef = ref.current?.[index] as HTMLCanvasElement

        const currCanvas = new Canvas(currRef, options)

        currCanvas.calcOffset()

        currCanvas.renderAll()

        createdCanvas.push(currCanvas)
      })

      onCanvas((prev) => [...prev, ...createdCanvas])
    }

    return () => {
      createdCanvas.forEach((currCanvas) => currCanvas.dispose())

      onCanvas([])
    }
  }, [data, onCanvas])

  return (
    <Grid container spacing={3}>
      {data.map(({ _id, hidden }, index) => (
        <Grid xs={12} md={2} lg={4} key={_id}>
          <Stack
            sx={{
              border: "4px solid",
              position: "relative",
              alignItems: "center",
              borderColor: "gray.200",
              justifyContent: "center",

              ":hover": {
                ".overlay": {
                  cursor: "pointer",
                  opacity: 0.5,
                  pointerEvents: "auto",
                },

                ".on-action": {
                  opacity: 1,
                  pointerEvents: "auto",
                },
              },
            }}
          >
            <canvas
              ref={(curr) => {
                if (ref.current) ref.current[index] = curr as HTMLCanvasElement
              }}
            />

            {hasAHideButton && (
              <Tooltip title="Hide from team" placement="top-start">
                <Stack
                  sx={{
                    top: "1rem",
                    right: "1rem",
                    width: "2.5rem",
                    color: "primary.main",
                    height: "2.5rem",
                    border: "1px solid",
                    zIndex: 2,
                    bgcolor: "white",
                    opacity: 0,
                    position: "absolute",
                    alignItems: "center",
                    transition: "all .3s ease-in-out",
                    borderColor: "gray.200",
                    borderRadius: "50%",
                    pointerEvents: "none",
                    justifyContent: "center",
                  }}
                  onClick={() => onHide(_id, !hidden)}
                  component="button"
                  className="on-action"
                >
                  {isLoadingHideShowTemplate ? (
                    <CircularProgress size="1.25rem" />
                  ) : hidden ? (
                    <Eye size={20} />
                  ) : (
                    <EyeOff size={20} />
                  )}
                </Stack>
              </Tooltip>
            )}

            <Box
              sx={{
                top: 0,
                left: 0,
                width: "100%",
                zIndex: 1,
                height: "100%",
                opacity: 0,
                bgcolor: "gray.100",
                position: "absolute",
                transition: "all .3s ease-in-out",
                pointerEvents: "none",
              }}
              href={
                `/app/agent-orgs/${params.agentId}/marketing-hub/templates/${_id}` as Route
              }
              component={Link}
              className="overlay"
            />
          </Stack>
        </Grid>
      ))}
    </Grid>
  )
}
