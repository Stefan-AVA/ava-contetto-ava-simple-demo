"use client"

// import Image from "next/image"
import {
  useCopySharedFileMutation,
  useGetSharedFileQuery,
  useLazyGetSharedFileQuery,
} from "@/redux/apis/fileshare"
import { Stack, Typography } from "@mui/material"
import { DownloadCloud, FolderPlus } from "lucide-react"

import Loading from "@/components/Loading"

type PageProps = {
  params: {
    shareId: string
  }
  searchParams: {
    orgId: string
    code: string
  }
}

const Page = ({ params, searchParams }: PageProps) => {
  const { shareId } = params
  const { orgId, code } = searchParams

  const { data, isLoading } = useGetSharedFileQuery({
    shareId,
    orgId,
    code,
  })

  const [getDownloadUrl] = useLazyGetSharedFileQuery()
  const [copySharedFile] = useCopySharedFileMutation()

  if (!orgId || !code) return <div>No Content</div>

  if (isLoading) return <Loading />

  return (
    <Stack
      sx={{
        p: 4,
        top: 0,
        left: 0,
        color: "white",
        width: "100svw",
        zIndex: 999,
        position: "fixed",
        minHeight: "100svh",
        backgroundColor: "rgba(0, 0, 0, .8)",
      }}
    >
      <Stack
        sx={{
          gap: 3,
          position: "relative",
          alignItems: {
            sm: "center",
          },
          flexDirection: {
            xs: "column",
            sm: "row",
          },
          justifyContent: {
            xs: "space-between",
            md: "flex-end",
          },
        }}
      >
        <Typography
          sx={{
            left: 0,
            right: 0,
            position: { md: "absolute" },
            textAlign: { xs: "left", md: "center" },
            fontWeight: "700",
          }}
          variant="h6"
        >
          File Name (View Only)
        </Typography>

        <Stack
          sx={{
            gap: 6,
            alignItems: "center",
            flexDirection: "row",
          }}
        >
          <Typography
            sx={{
              gap: 2,
              color: "white",
              display: "flex",
              opacity: 0.7,
              transition: "all .3s ease-in-out",
              alignItems: "center",

              "&:hover": {
                opacity: 1,
              },
            }}
            component="button"
          >
            <DownloadCloud />
            Download
          </Typography>

          <Typography
            sx={{
              gap: 2,
              color: "white",
              display: "flex",
              opacity: 0.7,
              transition: "all .3s ease-in-out",
              alignItems: "center",

              "&:hover": {
                opacity: 1,
              },
            }}
            component="button"
          >
            <FolderPlus />
            Save
          </Typography>
        </Stack>
      </Stack>

      <Typography
        sx={{ m: "auto", textAlign: "center", maxWidth: "20rem" }}
        variant="h4"
      >
        This file can not be opened. Download to open.
      </Typography>

      {/* <Image
        src="/assets/signup-background.jpg"
        alt=""
        width={960}
        style={{ margin: "auto" }}
        height={480}
      /> */}
    </Stack>
  )
}

export default Page
