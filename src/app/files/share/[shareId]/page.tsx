"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useGetMeQuery } from "@/redux/apis/auth"
import {
  useCopySharedFileMutation,
  useGetSharedFileQuery,
  useLazyGetSharedFileQuery,
} from "@/redux/apis/fileshare"
import { Box, Button, CircularProgress } from "@mui/material"
import { DownloadCloud, FolderPlus } from "lucide-react"
import { useSnackbar } from "notistack"

import Loading from "@/components/Loading"
import ShareView from "@/components/pages/Folder/share-view"

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
  const [copySharedFile, { isLoading: isCopyingLoading }] =
    useCopySharedFileMutation()

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

      document.body.appendChild(link)

      link.click()

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
    <ShareView
      title={`${file?.name} (View Only)`}
      fileUrl={file?.mimetype.includes("image") ? file.downloadUrl : null}
    >
      <Button
        sx={{
          p: 1,
          color: "white",
          opacity: 0.7,
          transition: "all .3s ease-in-out",

          "&:hover": {
            opacity: 1,
          },
        }}
        variant="text"
        onClick={onDownload}
        disabled={downloading}
        startIcon={
          downloading ? (
            <CircularProgress color="inherit" size="1.25rem" />
          ) : (
            <DownloadCloud />
          )
        }
      >
        Download
      </Button>

      <Button
        sx={{
          p: 1,
          color: "white",
          opacity: 0.7,
          transition: "all .3s ease-in-out",

          "&:hover": {
            opacity: 1,
          },
        }}
        onClick={onCopy}
        variant="text"
        disabled={isCopyingLoading}
        startIcon={
          isCopyingLoading ? (
            <CircularProgress color="inherit" size="1.25rem" />
          ) : (
            <Box sx={{ pointerEvents: "none" }} component={FolderPlus} />
          )
        }
      >
        Save
      </Button>
    </ShareView>
  )
}

export default Page
