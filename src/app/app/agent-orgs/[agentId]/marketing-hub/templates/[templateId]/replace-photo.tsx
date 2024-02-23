import { useEffect, useState } from "react"
import Image from "next/image"
import { useParams } from "next/navigation"
// import { useGetBrochuresQuery } from "@/redux/apis/brochure"
import {
  useGetFolderQuery,
  useGetPublicFileUrlMutation,
  useGetUploadFileUrlMutation,
  useStoreFileMutation,
} from "@/redux/apis/media"
import { LoadingButton, TabContext, TabList, TabPanel } from "@mui/lab"
import {
  Box,
  Button,
  CircularProgress,
  Unstable_Grid2 as Grid,
  Stack,
  Tab,
  Typography,
} from "@mui/material"
import { CheckCircle2, UploadCloud } from "lucide-react"
import { useSnackbar } from "notistack"

import DragDrop from "@/components/DragDrop"

type ListingFiles = {
  id: string
  url: string
}

interface ReplacePhotoProps {
  orgId: string
  onSelectImage: (fileUrl: string) => void
}

export default function ReplacePhoto({
  orgId,
  onSelectImage,
}: ReplacePhotoProps) {
  const [tab, setTab] = useState("1")
  const [files, setFiles] = useState<File[]>([])
  const [listingFiles, setListingFiles] = useState<ListingFiles[]>([])
  const [loadingUploadFiles, setLoadingUploadFiles] = useState(false)
  const [loadingListingFiles, setLoadingListingFiles] = useState(false)

  const params = useParams()

  const { enqueueSnackbar } = useSnackbar()

  // const { data } = useGetBrochuresQuery({
  //   orgId,
  // })

  const agentId = params.agentId as string

  const { data, isFetching, refetch } = useGetFolderQuery(
    { orgId, agentId, isShared: true, forAgentOnly: true },
    { skip: !orgId }
  )

  const [storeFile] = useStoreFileMutation()

  const [getPublicFileUrl] = useGetPublicFileUrlMutation()

  const [getUploadFileUrl] = useGetUploadFileUrlMutation()

  async function uploadFile(file: File) {
    const { singedUrl, key } = await getUploadFileUrl({
      name: file.name,
      type: file.type,
      orgId,
      agentId: params.agentId as string,
    }).unwrap()

    const res = await fetch(singedUrl, {
      body: file,
      method: "PUT",
      headers: {
        "Content-Type": file.type,
      },
    })

    if (res.ok) {
      await storeFile({
        orgId,
        name: file.name,
        type: file.type,
        size: file.size,
        s3Key: key,
        agentId: params.agentId as string,
        isShared: true,
        forAgentOnly: true,
      })

      return
    }

    enqueueSnackbar(`An error occurred while sending the file: ${file.name}`, {
      variant: "error",
    })
  }

  async function onUploadFiles() {
    setLoadingUploadFiles(true)

    for await (const file of files) {
      await uploadFile(file)
    }

    await refetch()

    setLoadingUploadFiles(false)

    enqueueSnackbar("Upload success!", { variant: "success" })

    setFiles([])

    setTab("1")
  }

  useEffect(() => {
    if (data?.files) {
      const fetchFiles = async () => {
        const signedFiles: ListingFiles[] = []

        setLoadingListingFiles(true)

        const filterFiles = data.files.filter(({ mimetype }) =>
          mimetype.includes("image/")
        )

        for await (const file of filterFiles) {
          const fileUrl = await getPublicFileUrl({
            orgId,
            fileId: file._id,
            isShared: true,
          }).unwrap()

          signedFiles.push({
            id: file._id,
            url: fileUrl.publicUrl as string,
          })
        }

        setLoadingListingFiles(false)

        setListingFiles(signedFiles)
      }

      fetchFiles()
    }
  }, [orgId, data?.files, getPublicFileUrl])

  return (
    <TabContext value={tab}>
      <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
        <TabList onChange={(_, currTab) => setTab(currTab)}>
          <Tab label="Files" value="1" />

          <Tab label="Upload" value="2" />
        </TabList>
      </Box>
      <TabPanel sx={{ p: 0 }} value="1">
        {loadingListingFiles && <CircularProgress size="1.5rem" />}

        {!loadingListingFiles && listingFiles.length > 0 && (
          <Grid container spacing={3}>
            {listingFiles.map(({ id, url }) => (
              <Grid xs={6} key={id}>
                <Image
                  src={url}
                  alt=""
                  width={180}
                  style={{
                    objectFit: "contain",
                    borderRadius: ".75rem",
                  }}
                  height={180}
                  onClick={() => onSelectImage(url)}
                />
              </Grid>
            ))}
          </Grid>
        )}

        {!loadingListingFiles && listingFiles.length <= 0 && (
          <Typography
            sx={{ color: "gray.500", textAlign: "center" }}
            variant="body2"
          >
            {`You don't have files yet`}
          </Typography>
        )}
      </TabPanel>

      <TabPanel sx={{ p: 0 }} value="2">
        <DragDrop
          sx={{
            width: "100%",
            height: "auto",
            maxHeight: 500,
            minHeight: 200,
            overflow: "auto",
          }}
          multiple
          onChange={setFiles}
        >
          <Stack
            sx={{
              py: 3,
              alignItems: "center",
            }}
          >
            <Box
              sx={{ color: "primary.main" }}
              size={56}
              component={UploadCloud}
            />

            <Typography
              sx={{ mt: 1.5, textAlign: "center", fontWeight: "600" }}
              variant="h6"
            >
              Drag and drop files here
            </Typography>

            <Typography sx={{ textAlign: "center" }} variant="h6">
              or
            </Typography>

            <Button sx={{ mt: 1 }} variant="outlined">
              Upload
            </Button>
          </Stack>
        </DragDrop>

        {files.length > 0 && (
          <>
            <Stack sx={{ mt: 2, gap: 1 }}>
              {files.map((file) => (
                <Stack
                  sx={{
                    px: 2,
                    py: 1,
                    gap: 2,
                    width: "100%",
                    bgcolor: "gray.200",
                    alignItems: "center",
                    borderRadius: ".75rem",
                    flexDirection: "row",
                    justifyContent: "space-between",
                  }}
                  key={file.name}
                >
                  <Stack sx={{ width: "88%" }}>
                    <Typography
                      sx={{
                        maxWidth: "100%",
                        overflow: "hidden",
                        fontWeight: "600",
                        whiteSpace: "nowrap",
                        textOverflow: "ellipsis",
                      }}
                      variant="body2"
                    >
                      {file.name}
                    </Typography>

                    <Typography sx={{ color: "gray.500" }} variant="body2">
                      {(file.size / (1024 * 1024)).toFixed(2)}mb
                    </Typography>
                  </Stack>

                  <Box
                    sx={{
                      color: "primary.main",
                      minWidth: "1.25rem",
                      aspectRatio: "1/1",
                    }}
                    size={20}
                    component={CheckCircle2}
                  />
                </Stack>
              ))}
            </Stack>

            <LoadingButton
              sx={{ mt: 3 }}
              loading={loadingUploadFiles || isFetching}
              onClick={onUploadFiles}
              fullWidth
            >
              Upload
            </LoadingButton>
          </>
        )}
      </TabPanel>
    </TabContext>
  )
}
