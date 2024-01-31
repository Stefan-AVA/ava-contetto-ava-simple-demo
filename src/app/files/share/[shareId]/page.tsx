"use client"

// import Image from "next/image"
import { useState } from "react"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { useGetMeQuery } from "@/redux/apis/auth"
import {
  useCopySharedFileMutation,
  useGetSharedFileQuery,
  useLazyGetSharedFileQuery,
} from "@/redux/apis/fileshare"
import { Stack, Typography } from "@mui/material"
import { DownloadCloud, FolderPlus } from "lucide-react"
import { useSnackbar } from "notistack"

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

  const { push } = useRouter()
  const { enqueueSnackbar } = useSnackbar()

  const [downloading, setDownloading] = useState(false)

  const { data: file, isLoading } = useGetSharedFileQuery({
    shareId,
    orgId,
    code,
  })
  const { data: user } = useGetMeQuery()

  const [getDownloadUrl] = useLazyGetSharedFileQuery()
  const [copySharedFile, { isLoading: isCopying }] = useCopySharedFileMutation()

  const onDownload = async () => {
    setDownloading(true)
    try {
      const { name, downloadUrl } = await getDownloadUrl({
        shareId,
        orgId,
        code,
      }).unwrap()

      const response = await fetch(downloadUrl)
      const blob = await response.blob()

      const url = window.URL.createObjectURL(new Blob([blob]))
      const link = document.createElement("a")
      link.href = url
      link.setAttribute("download", name)

      // Append to html link element page
      document.body.appendChild(link)

      // Start download
      link.click()

      // Clean up and remove the link
      link.parentNode?.removeChild(link)
    } catch (error) {
      enqueueSnackbar("Error to download. please try again", {
        variant: "error",
      })
    }
    setDownloading(false)
  }

  const onCopy = async () => {
    if (!user) {
      push(`/?_next=/files/share/${shareId}&orgId=${orgId}&code=${code}`)
      return
    }
    try {
      await copySharedFile({
        orgId,
        shareId,
        code,
      }).unwrap()

      enqueueSnackbar("Saved", {
        variant: "success",
      })
    } catch (error) {
      enqueueSnackbar("Copy failed. please try again", {
        variant: "error",
      })
    }
  }

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
          {file?.name} (View Only)
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
              // transition: "all .3s ease-in-out",
              alignItems: "center",

              "&:hover": {
                opacity: 1,
              },
            }}
            component="button"
            onClick={onDownload}
            disabled={downloading}
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
            onClick={onCopy}
          >
            <FolderPlus />
            Save
          </Typography>
        </Stack>
      </Stack>

      {file?.mimetype.includes("image") ? (
        <Image
          src={file.downloadUrl}
          alt=""
          width={960}
          style={{ margin: "auto" }}
          height={480}
        />
      ) : (
        <Typography
          sx={{ m: "auto", textAlign: "center", maxWidth: "20rem" }}
          variant="h4"
        >
          This file can not be opened. Download to open.
        </Typography>
      )}
    </Stack>
  )
}

export default Page
