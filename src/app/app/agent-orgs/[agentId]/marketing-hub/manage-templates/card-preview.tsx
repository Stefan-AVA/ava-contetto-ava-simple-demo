"use client"

import "swiper/css"

import {
  useEffect,
  useMemo,
  useRef,
  type Dispatch,
  type SetStateAction,
} from "react"
import {
  useAddOrgTemplateMutation,
  useHideShowTemplateMutation,
} from "@/redux/apis/templates"
import { LoadingButton } from "@mui/lab"
import {
  Box,
  CircularProgress,
  Stack,
  Tooltip,
  Typography,
} from "@mui/material"
import { Canvas, type CanvasOptions } from "fabric"
import { EyeOff } from "lucide-react"
import { Swiper, SwiperSlide } from "swiper/react"

import type { ITemplate } from "@/types/template.types"

interface CardPreviewProps {
  data: [string, ITemplate[]][]
  orgId: string
  onCanvas: Dispatch<SetStateAction<Canvas[]>>
  hasAUseButton?: boolean
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
  hasAUseButton,
  hasAHideButton,
}: CardPreviewProps) {
  const ref = useRef<HTMLCanvasElement[]>([])

  const [addOrgTemplate, { isLoading: isLoadingAddOrgTemplate }] =
    useAddOrgTemplateMutation()
  const [hideShowTemplate, { isLoading: isLoadingHideShowTemplate }] =
    useHideShowTemplateMutation()

  async function onAdd(templateId: string) {
    addOrgTemplate({
      orgId,
      templateId,
    })
  }

  async function onHide(templateId: string) {
    hideShowTemplate({
      orgId,
      hidden: true,
      templateId,
    })
  }

  const mergeElems = useMemo(() => {
    const arrayOfElems = data.map(([_, card]) => card)

    return arrayOfElems.reduce((acc, curr) => {
      return [...acc, ...curr]
    }, [])
  }, [data])

  useEffect(() => {
    const options: Partial<CanvasOptions> = {
      width: WIDTH,
      height: WIDTH,
    }

    const createdCanvas = [] as Canvas[]

    const refs = ref.current && ref.current.length > 0

    if (refs) {
      mergeElems.forEach((_, index) => {
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
  }, [mergeElems, onCanvas])

  return data.map(([key, cards]) => (
    <Stack sx={{ gap: 2, mb: 4 }} key={key}>
      <Typography sx={{ fontWeight: 600 }} variant="h6">
        {key}
      </Typography>

      <Swiper
        style={{ width: "100%" }}
        grabCursor
        spaceBetween={24}
        slidesPerView="auto"
      >
        {cards.map(({ _id }) => {
          const findIndex = mergeElems.findIndex((elem) => elem._id === _id)

          return (
            <SwiperSlide key={_id} style={{ width: "fit-content" }}>
              <Stack
                sx={{
                  border: "4px solid",
                  position: "relative",
                  alignItems: "center",
                  borderColor: "gray.200",
                  justifyContent: "center",

                  ":hover": {
                    ".overlay": {
                      opacity: 0.5,
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
                    if (ref.current)
                      ref.current[findIndex] = curr as HTMLCanvasElement
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
                      onClick={() => onHide(_id)}
                      component="button"
                      className="on-action"
                    >
                      {isLoadingHideShowTemplate ? (
                        <CircularProgress size="1.25rem" />
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
                  }}
                  className="overlay"
                />

                {hasAUseButton && (
                  <LoadingButton
                    sx={{
                      zIndex: 2,
                      opacity: 0,
                      position: "absolute",
                      transition: "all .3s ease-in-out",
                      pointerEvents: "none",
                    }}
                    onClick={() => onAdd(_id)}
                    loading={isLoadingAddOrgTemplate}
                    className="on-action"
                  >
                    Use
                  </LoadingButton>
                )}
              </Stack>
            </SwiperSlide>
          )
        })}
      </Swiper>
    </Stack>
  ))
}
