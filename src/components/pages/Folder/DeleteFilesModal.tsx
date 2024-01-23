"use client"

import { useState } from "react"
import { useDeletefilesMutation } from "@/redux/apis/media"
import { parseError } from "@/utils/error"
import { LoadingButton } from "@mui/lab"
import { FormHelperText, Modal, Stack, Typography } from "@mui/material"
import { useSnackbar } from "notistack"

import { ChonkyFile } from "."

interface IProps {
  orgId: string
  contactId?: string
  open: boolean
  setOpen: Function
  refetch: Function
  isRefetching: boolean
  files: ChonkyFile[]
}

interface IError {
  request?: string
}

const DeleteFilesModal = ({
  orgId,
  contactId,
  files,

  open,
  setOpen,
  refetch,
  isRefetching,
}: IProps) => {
  const { enqueueSnackbar } = useSnackbar()

  const [errors, setErrors] = useState<IError>({})

  const [deleteFiles, { isLoading }] = useDeletefilesMutation()
  const isUpdating = isLoading || isRefetching

  const onClose = () => {
    if (isUpdating) return

    setErrors({})
    setOpen([])
  }

  const onDelete = async () => {
    setErrors({})
    if (files.length === 0) {
      setErrors({ request: "Need to select more than 1 file" })
      return
    }

    try {
      await deleteFiles({
        orgId,
        contactId,
        folderIds: files.filter((file) => file.isDir).map((file) => file._id),
        fileIds: files.filter((file) => !file.isDir).map((file) => file._id),
      })

      await refetch()

      enqueueSnackbar("Delete success!", { variant: "success" })
      onClose()
    } catch (error) {
      setErrors({ request: parseError(error) })
      enqueueSnackbar("Delete error!", { variant: "error" })
    }
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
        <Typography variant="h4">Do you want delete these files?</Typography>
        <Typography variant="body1">This action can not be undone</Typography>

        <Stack spacing={1}>
          <LoadingButton
            loading={isUpdating}
            sx={{ textTransform: "none" }}
            onClick={onDelete}
            color="error"
          >
            Delete
          </LoadingButton>
          {errors.request && (
            <FormHelperText error>{errors.request}</FormHelperText>
          )}
        </Stack>
      </Stack>
    </Modal>
  )
}

export default DeleteFilesModal
