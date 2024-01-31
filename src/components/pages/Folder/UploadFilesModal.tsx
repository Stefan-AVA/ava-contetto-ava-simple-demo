"use client"

import { useState } from "react"
import {
  useGetUploadFileUrlMutation,
  useStoreFileMutation,
} from "@/redux/apis/media"
import { parseError } from "@/utils/error"
import { LoadingButton } from "@mui/lab"
import {
  Box,
  Button,
  FormHelperText,
  Unstable_Grid2 as Grid,
  Modal,
  Stack,
  Typography,
} from "@mui/material"
import { CheckCircle2, File, UploadCloud } from "lucide-react"
import { useSnackbar } from "notistack"

import { IFolder } from "@/types/folder.types"
import DragDrop from "@/components/DragDrop"

interface IProps {
  orgId: string
  agentId?: string
  contactId?: string
  folderId?: string
  isShared: boolean
  forAgentOnly?: boolean
  open: boolean
  setOpen: Function
  refetch: Function
  isRefetching: boolean
  folder?: IFolder
}

interface IError {
  request?: string
}

const UploadFilesModal = ({
  orgId,
  agentId,
  contactId,
  folderId,
  isShared = true,
  forAgentOnly = false,

  open,
  setOpen,
  refetch,
  isRefetching,
}: IProps) => {
  const [files, setFiles] = useState<File[]>([])
  const [uploading, setUploading] = useState(false)
  // TODO: implement uploading status
  const [uploadingFiles, setUploadingFiles] = useState<File[]>([])
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([])
  const [faildFiles, setFailedFiles] = useState<File[]>([])
  const [errors, setErrors] = useState<IError>({})

  const { enqueueSnackbar } = useSnackbar()

  const [getUploadFileUrl] = useGetUploadFileUrlMutation()

  const [storeFile] = useStoreFileMutation()

  const onClose = () => {
    if (uploading) return

    setFiles([])
    setUploadedFiles([])
    setUploadedFiles([])
    setFailedFiles([])
    setErrors({})
    setOpen(false)
  }

  const onFileChange = (files: File[]) => {
    setFiles(files)
    setUploadedFiles([])
    setUploadedFiles([])
    setFailedFiles([])
  }

  const uploadFile = async (file: File) => {
    setUploadingFiles((prev) => [...prev, file])
    const { singedUrl, key } = await getUploadFileUrl({
      orgId,
      agentId,
      contactId,
      name: file.name,
      type: file.type,
    }).unwrap()

    // upload to s3
    const res = await fetch(singedUrl, {
      method: "PUT",
      body: file,
      headers: {
        "Content-Type": file.type,
      },
    })

    if (res.ok) {
      await storeFile({
        orgId,
        agentId,
        contactId,
        folderId,
        name: file.name,
        type: file.type,
        size: file.size,
        s3Key: key,
        isShared,
        forAgentOnly,
      })
      setUploadingFiles((prev) => [...prev.filter((f) => f !== file)])
      setUploadedFiles((prev) => [...prev, file])
    } else {
      // throw error
      setUploadingFiles((prev) => [...prev.filter((f) => f !== file)])
      setFailedFiles((prev) => [...prev, file])
    }
  }

  const onUpload = async () => {
    setErrors({})
    if (files.length === 0) {
      setErrors({ request: "Need to select more than 1 file" })
      return
    }

    setUploading(true)

    try {
      const uploadPromises = files.map((file) => uploadFile(file))
      await Promise.all(uploadPromises)

      await refetch()

      enqueueSnackbar("Upload success!", { variant: "success" })
      onClose()
    } catch (error) {
      setErrors({ request: parseError(error) })
    }
    setUploading(false)
  }

  return (
    <Modal
      open={open}
      onClose={onClose}
      sx={{ display: "flex", alignItems: "center", justifyContent: "center" }}
    >
      <Stack
        width={{ xs: 300, sm: 500 }}
        spacing={3}
        sx={{ background: "white", padding: 3, borderRadius: 2 }}
      >
        <Typography sx={{ fontWeight: 600 }} variant="h4">
          Upload Files
        </Typography>

        <DragDrop
          sx={{
            width: "100%",
            height: "auto",
            maxHeight: 500,
            minHeight: 200,
            overflow: "auto",
          }}
          multiple
          onChange={onFileChange}
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
          <Stack sx={{ gap: 1 }}>
            {files.map((file) => (
              <Stack
                sx={{
                  px: 2,
                  py: 1,
                  bgcolor: "gray.200",
                  alignItems: "center",
                  borderRadius: ".75rem",
                  flexDirection: "row",
                  justifyContent: "space-between",
                }}
                key={file.name}
              >
                <Stack>
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

                <Box sx={{ color: "primary.main" }} component={CheckCircle2} />
              </Stack>
            ))}
          </Stack>
        )}

        <LoadingButton loading={isRefetching || uploading} onClick={onUpload}>
          Upload
        </LoadingButton>

        {errors.request && (
          <FormHelperText sx={{ mt: 1 }} error>
            {errors.request}
          </FormHelperText>
        )}
      </Stack>
    </Modal>
  )
}

export default UploadFilesModal
