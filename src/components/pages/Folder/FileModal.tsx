"use client"

import { useEffect, useState } from "react"
import { useRenameFileMutation } from "@/redux/apis/media"
import { parseError } from "@/utils/error"
import { LoadingButton } from "@mui/lab"
import {
  FormHelperText,
  Modal,
  Stack,
  TextField,
  Typography,
} from "@mui/material"
import { useSnackbar } from "notistack"

import { IFile } from "@/types/folder.types"

interface IProps {
  orgId: string
  agentId?: string
  contactId?: string
  folderId?: string
  open: boolean
  setOpen: Function
  refetch: Function
  isRefetching: boolean
  file?: IFile
}

interface IError {
  name?: string
  request?: string
}

const FileModal = ({
  orgId,
  agentId,
  contactId,
  folderId,
  file,

  open,
  setOpen,
  refetch,
  isRefetching,
}: IProps) => {
  const [name, setName] = useState(file?.name || "")
  const [errors, setErrors] = useState<IError>({})

  const { enqueueSnackbar } = useSnackbar()

  const [renamefile, { isLoading }] = useRenameFileMutation()

  useEffect(() => {
    if (file) {
      setName(file.name)
    }
  }, [file])

  const onClose = () => {
    setName("")
    setErrors({})
    setOpen(undefined)
  }

  const onSubmit = async () => {
    setErrors({})

    if (!name) {
      setErrors({ name: "Folder name is required" })
      return
    }
    if (!file) {
      setErrors({ request: "You didn't select any file" })
      return
    }

    try {
      await renamefile({
        orgId,
        agentId,
        contactId,
        folderId,
        fileId: file._id,
        name,
      })
      enqueueSnackbar("file name is changed", { variant: "success" })

      await refetch()
      onClose()
    } catch (error) {
      setErrors({ request: parseError(error) })
    }
  }

  return (
    <Modal
      open={open}
      onClose={onClose}
      sx={{ display: "flex", alignItems: "center", justifyContent: "center" }}
    >
      <Stack
        width={300}
        spacing={3}
        sx={{ background: "white", padding: 3, borderRadius: 2 }}
      >
        <Typography variant="h4">Rename File</Typography>
        <TextField
          label="Folder Name"
          value={name}
          onChange={({ target }) => {
            setErrors({})
            setName(target.value)
          }}
          error={!!errors.name}
          helperText={errors.name}
        />

        <Stack spacing={1}>
          <LoadingButton
            loading={isRefetching || isLoading}
            sx={{ textTransform: "none" }}
            onClick={onSubmit}
          >
            Rename
          </LoadingButton>
          {errors.request && (
            <FormHelperText error>{errors.request}</FormHelperText>
          )}
        </Stack>
      </Stack>
    </Modal>
  )
}

export default FileModal
