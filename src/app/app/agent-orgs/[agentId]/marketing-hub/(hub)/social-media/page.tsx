"use client"

import { useEffect, useMemo, useState } from "react"
import { useGetOrgTemplatesQuery } from "@/redux/apis/templates"
import { RootState } from "@/redux/store"
import { Stack, Typography } from "@mui/material"
import { Canvas } from "fabric"
import { useSelector } from "react-redux"

import Loading from "@/components/Loading"

import CardPreview from "./card-preview"

interface PageProps {
  params: {
    agentId: string
  }
}

/**
 * @todo
 * Adjust the card width according to the screen width.
 */
const WIDTH = 344 - 8

export default function Collections({ params }: PageProps) {
  const [canvas, setCanvas] = useState<Canvas[]>([])

  const agentOrgs = useSelector((state: RootState) => state.app.agentOrgs)

  const currentOrg = useMemo(
    () => agentOrgs.find((agent) => agent._id === params.agentId)!,
    [params.agentId, agentOrgs]
  )

  const { data } = useGetOrgTemplatesQuery(
    {
      orgId: currentOrg.orgId,
    },
    {
      skip: !currentOrg,
    }
  )

  useEffect(() => {
    if (data && data.length > 0 && canvas.length > 0) {
      const run = async () => {
        for await (const [key, value] of data.entries()) {
          const selectedCanvas = canvas[Number(key)]

          const ctx = selectedCanvas.contextTop

          if (!ctx) return

          await selectedCanvas.loadFromJSON(value.template.data[0])

          selectedCanvas.selection = false

          const scaleX = WIDTH / value.template.layout.width
          const scaleY = WIDTH / value.template.layout.height

          const background = selectedCanvas.backgroundImage

          if (background) {
            background.scaleX = background.scaleX * scaleX
            background.scaleY = background.scaleY * scaleY
          }

          selectedCanvas.forEachObject((object) => {
            object.hasControls = false
            object.lockRotation = true
            object.lockMovementX = true
            object.lockMovementY = true

            object.scaleX = object.scaleX * scaleX
            object.scaleY = object.scaleY * scaleY
            object.left = object.left * scaleX
            object.top = object.top * scaleY

            object.setCoords()
          })

          selectedCanvas.renderAll()
        }
      }

      run()
    }
  }, [data, canvas])

  if (!data) return <Loading />

  return (
    <Stack>
      {data.length > 0 && (
        <CardPreview
          data={data}
          orgId={currentOrg._id}
          onCanvas={setCanvas}
          hasAUseButton
          hasAHideButton
        />
      )}

      {data.length <= 0 && (
        <Stack
          sx={{
            px: 3,
            my: 5,
            mx: "auto",
            gap: 2,
            maxWidth: "22rem",
            alignItems: "center",
          }}
        >
          <Typography
            sx={{
              color: "gray.600",
              textAlign: "center",
            }}
          >
            There are no templates available at this time.
          </Typography>
        </Stack>
      )}
    </Stack>
  )
}
