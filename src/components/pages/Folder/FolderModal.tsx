"use client"

import { useEffect, useState } from "react"
import {
  useCreateFolderMutation,
  useRenameFolderMutation,
} from "@/redux/apis/media"
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

import { IFolder } from "@/types/folder.types"

interface IProps {
  orgId: string
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
  name?: string
  request?: string
}

const FolderModal = ({
  orgId,
  contactId,
  folderId,
  isShared = true,
  forAgentOnly = false,
  folder,

  open,
  setOpen,
  refetch,
  isRefetching,
}: IProps) => {
  const [name, setName] = useState(folder?.name || "")
  const [errors, setErrors] = useState<IError>({})

  const { enqueueSnackbar } = useSnackbar()

  const [createFolder, { isLoading: isFolderCreating }] =
    useCreateFolderMutation()

  const [renameFolder, { isLoading: isFolderRenaming }] =
    useRenameFolderMutation()

  useEffect(() => {
    if (folder) {
      setName(folder.name)
    }
  }, [folder])

  const onClose = () => {
    setName("")
    setErrors({})
    setOpen(false)
  }

  const onSubmit = async () => {
    setErrors({})

    if (!name) {
      setErrors({ name: "Folder name is required" })
      return
    }

    try {
      if (folder) {
        // rename
        await renameFolder({
          name,
          orgId,
          contactId,
          folderId: folder._id,
        })
        enqueueSnackbar("Folder is updated", { variant: "success" })
      } else {
        // create folder
        await createFolder({
          name,
          orgId,
          contactId,
          folderId,
          isShared,
          forAgentOnly,
        })
        enqueueSnackbar("Folder is created", { variant: "success" })
      }

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
        <Typography variant="h4">
          {folder ? "Rename Folder" : "Create Folder"}
        </Typography>
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
            loading={isFolderCreating || isFolderRenaming || isRefetching}
            sx={{ textTransform: "none" }}
            onClick={onSubmit}
          >
            {folder ? "Rename" : "Create"}
          </LoadingButton>
          {errors.request && (
            <FormHelperText error>{errors.request}</FormHelperText>
          )}
        </Stack>
      </Stack>
    </Modal>
  )
}

export default FolderModal
