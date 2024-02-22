"use client"

import { useEffect, useMemo, useState } from "react"
import { Route } from "next"
import Link from "next/link"
import { useGetTemplatesQuery } from "@/redux/apis/templates"
import { RootState } from "@/redux/store"
import { Button, Stack, Typography } from "@mui/material"
import { Canvas } from "fabric"
import { useSelector } from "react-redux"

import type { ITemplate } from "@/types/template.types"
import Loading from "@/components/Loading"

import CardPreview from "./card-preview"

interface PageProps {
  params: {
    agentId: string
  }
}

const WIDTH = 344 - 8

export default function Collections({ params }: PageProps) {
  const [canvas, setCanvas] = useState<Canvas[]>([])

  const basePath = `/app/agent-orgs/${params.agentId}/marketing-hub`

  const agentOrgs = useSelector((state: RootState) => state.app.agentOrgs)

  const currentOrg = useMemo(
    () => agentOrgs.find((agent) => agent._id === params.agentId)!,
    [params.agentId, agentOrgs]
  )

  const { data } = useGetTemplatesQuery(
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

          await selectedCanvas.loadFromJSON(value.data[0])

          selectedCanvas.selection = false

          const scaleX = WIDTH / value.layout.width
          const scaleY = WIDTH / value.layout.height

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

  const groupByLayout = useMemo(() => {
    if (data) {
      const group = data.reduce(
        (acc, curr) => {
          const name = curr.layout.name

          acc[name] = acc[name] || []
          acc[name].push(curr)

          return acc
        },
        {} as Record<string, ITemplate[]>
      )

      return Object.entries(group)
    }

    return []
  }, [data])

  if (!data) return <Loading />

  return (
    <Stack>
      <Link href={`${basePath}/social-media` as Route}>
        <Button size="small" variant="outlined">
          Back to Marketing Hub
        </Button>
      </Link>

      <Typography sx={{ my: 3, fontWeight: 600 }} variant="h4">
        Add Templates For Your Team
      </Typography>

      {data.length > 0 && (
        <CardPreview
          data={groupByLayout}
          orgId={currentOrg.orgId}
          onCanvas={setCanvas}
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
