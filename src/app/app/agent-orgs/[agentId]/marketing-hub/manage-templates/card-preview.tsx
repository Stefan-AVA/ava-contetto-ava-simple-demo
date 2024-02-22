"use client"

import "swiper/css"

import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  type Dispatch,
  type SetStateAction,
} from "react"
import {
  useAddOrgTemplateMutation,
  useDeleteOrgTemplateMutation,
  useGetOrgTemplatesQuery,
} from "@/redux/apis/templates"
import { LoadingButton } from "@mui/lab"
import { Box, Stack, Typography } from "@mui/material"
import { Canvas, type CanvasOptions } from "fabric"
import { Star } from "lucide-react"
import { useSnackbar } from "notistack"
import { Swiper, SwiperSlide } from "swiper/react"

import type { ITemplate } from "@/types/template.types"

interface CardPreviewProps {
  data: [string, ITemplate[]][]
  orgId: string
  onCanvas: Dispatch<SetStateAction<Canvas[]>>
}

const WIDTH = 344 - 8

export default function CardPreview({
  data,
  orgId,
  onCanvas,
}: CardPreviewProps) {
  const ref = useRef<HTMLCanvasElement[]>([])

  const { enqueueSnackbar } = useSnackbar()

  const { data: orgTemplates } = useGetOrgTemplatesQuery(
    {
      orgId,
    },
    {
      skip: !orgId,
    }
  )

  const [addOrgTemplate, { isLoading: isLoadingAddOrgTemplate }] =
    useAddOrgTemplateMutation()
  const [deleteOrgTemplate, { isLoading: isLoadingDeleteOrgTemplate }] =
    useDeleteOrgTemplateMutation()

  async function onRemove(templateId: string) {
    await deleteOrgTemplate({
      orgId,
      templateId,
    }).unwrap()

    enqueueSnackbar("Template removed successfully", { variant: "success" })
  }

  async function onAdd(templateId: string) {
    await addOrgTemplate({
      orgId,
      templateId,
    }).unwrap()

    enqueueSnackbar("Template added successfully", { variant: "success" })
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

  const findTemplateAddedToOrganization = useCallback(
    (templateId: string) => {
      if (orgTemplates) {
        const template = orgTemplates.find(
          (orgTemplate) => orgTemplate.templateId === templateId
        )

        return template ?? null
      }

      return null
    },
    [orgTemplates]
  )

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

          const addedTemplate = findTemplateAddedToOrganization(_id)

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

                <Box
                  sx={{
                    top: 0,
                    left: 0,
                    width: "100%",
                    zIndex: 1,
                    height: "100%",
                    opacity: addedTemplate ? 0.5 : 0,
                    bgcolor: "gray.100",
                    position: "absolute",
                    transition: "all .3s ease-in-out",
                  }}
                  className="overlay"
                />

                <LoadingButton
                  sx={{
                    zIndex: 2,
                    opacity: 0,
                    position: "absolute",
                    transition: "all .3s ease-in-out",
                    pointerEvents: "none",
                  }}
                  onClick={() =>
                    addedTemplate ? onRemove(addedTemplate._id) : onAdd(_id)
                  }
                  loading={
                    isLoadingAddOrgTemplate || isLoadingDeleteOrgTemplate
                  }
                  className="on-action"
                >
                  {addedTemplate ? "Remove" : "Use"}
                </LoadingButton>

                {addedTemplate && (
                  <Box
                    sx={{
                      top: "1rem",
                      right: "1rem",
                      color: "secondary.main",
                      zIndex: 2,
                      position: "absolute",
                    }}
                    component={Star}
                  />
                )}
              </Stack>
            </SwiperSlide>
          )
        })}
      </Swiper>
    </Stack>
  ))
}
