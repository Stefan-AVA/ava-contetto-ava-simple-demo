"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import { useLazyGetFolderQuery, useMoveFilesMutation } from "@/redux/apis/media"
import { parseError } from "@/utils/error"
import { LoadingButton } from "@mui/lab"
import { IconButton, Modal, Paper, Stack, Typography } from "@mui/material"
import IconFolder from "~/assets/icon-folder.svg"
import { ChevronLeft, X } from "lucide-react"
import { useSnackbar } from "notistack"

import { IFolder } from "@/types/folder.types"

import { FileOrFolder } from "."

interface IProps {
  orgId: string
  agentId?: string
  contactId?: string
  isShared: boolean
  forAgentOnly: boolean
  open: boolean
  setOpen: Function
  isRefetching: boolean
  file?: FileOrFolder
}

const MoveFileModal = ({
  orgId,
  agentId,
  contactId,
  file,
  isShared = true,
  forAgentOnly = false,
  open,
  setOpen,
  isRefetching,
}: IProps) => {
  const [folder, setFolder] = useState<IFolder | undefined>(undefined)
  const [subFolders, setSubFolders] = useState<IFolder[]>([])

  const { enqueueSnackbar } = useSnackbar()

  const [getFolder, { isLoading, isFetching }] = useLazyGetFolderQuery()
  const [moveFiles, { isLoading: isMoving }] = useMoveFilesMutation()

  const onGetFolder = async (target?: IFolder) => {
    try {
      const { folder, subFolders } = await getFolder({
        orgId,
        agentId,
        contactId,
        isShared,
        forAgentOnly,
        folderId: target?._id,
      }).unwrap()

      setFolder(folder)
      setSubFolders(subFolders)
    } catch (error) {}
  }

  useEffect(() => {
    if (open) {
      const request = async () => {
        try {
          const { folder, subFolders } = await getFolder({
            orgId,
            agentId,
            contactId,
            isShared,
            forAgentOnly,
          }).unwrap()

          setFolder(folder)
          setSubFolders(subFolders)
        } catch (error) {}
      }
      request()
    }
  }, [open])

  const onClose = () => {
    setFolder(undefined)
    setSubFolders([])
    setOpen(undefined)
  }

  const onMove = async () => {
    if (!file || !folder) {
      enqueueSnackbar("Select folder first", { variant: "error" })
      return
    }

    try {
      await moveFiles({
        orgId,
        agentId,
        contactId,
        isShared,
        forAgentOnly,
        fileIds: file.isDir ? [] : [file._id],
        folderIds: file.isDir ? [file._id] : [],
        folderId: folder._id,
      }).unwrap()

      onClose()
    } catch (error) {
      enqueueSnackbar(parseError(error), { variant: "error" })
    }
  }

  return (
    <Modal open={open} onClose={onClose}>
      <Paper
        sx={{
          p: 4,
          top: "50%",
          left: "50%",
          width: "100%",
          maxWidth: "41rem",
          position: "absolute",
          overflowY: "auto",
          maxHeight: "90vh",
          transform: "translate(-50%, -50%)",
        }}
        variant="outlined"
      >
        <Stack
          sx={{
            alignItems: "center",
            flexDirection: "row",
            justifyContent: "space-between",
          }}
        >
          <Typography sx={{ fontWeight: 600 }} variant="h4">
            Move {file?.name}
          </Typography>

          <Stack
            sx={{
              color: "white",
              width: "2.5rem",
              height: "2.5rem",
              bgcolor: "gray.300",
              alignItems: "center",
              borderRadius: "50%",
              justifyContent: "center",
            }}
            onClick={() => onClose()}
            component="button"
          >
            <X strokeWidth={3} />
          </Stack>
        </Stack>

        {folder && (
          <Stack
            direction="row"
            mt={3}
            sx={{ borderBottom: "1px solid gray", alignItems: "center" }}
          >
            <IconButton
              onClick={() => {
                const parentFolder =
                  folder.parentFolders && folder.parentFolders.length > 0
                    ? folder.parentFolders[folder.parentFolders.length - 1]
                    : undefined
                onGetFolder(parentFolder)
              }}
            >
              <ChevronLeft size={20} color="black" />
            </IconButton>

            <Typography variant="h6">{folder.name}</Typography>
            <Typography variant="body1" sx={{ color: "red", ml: 1 }}>
              (folder name you are in)
            </Typography>
          </Stack>
        )}

        <Stack spacing={2} mt={3}>
          {subFolders.map((sf) => (
            <Stack
              key={sf._id}
              sx={{
                gap: 1.5,
                alignItems: "center",
                flexDirection: "row",
                ":hover": {
                  cursor: "pointer",
                },
              }}
              onClick={() => onGetFolder(sf)}
            >
              <Image src={IconFolder} alt="" width={32} />

              <Typography
                sx={{
                  color: "gray.700",
                  textAlign: "center",
                  fontWeight: 600,
                }}
                variant="body2"
              >
                {sf.name}
              </Typography>
            </Stack>
          ))}
        </Stack>

        <Stack spacing={1} mt={3}>
          <LoadingButton
            loading={isRefetching || isLoading || isFetching || isMoving}
            sx={{ textTransform: "none" }}
            disabled={!folder}
            onClick={onMove}
          >
            Move
          </LoadingButton>
        </Stack>
      </Paper>
    </Modal>
  )
}

export default MoveFileModal
