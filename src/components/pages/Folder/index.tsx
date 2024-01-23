"use client"

import React, { useMemo, useRef, useState } from "react"
import { Route } from "next"
import Link from "next/link"
import { useRouter } from "next/navigation"
import {
  useGetDownloadFileUrlMutation,
  useGetFolderQuery,
  useMoveFilesMutation,
} from "@/redux/apis/media"
import {
  ChonkyActions,
  ChonkyIconName,
  ChonkyIconProps,
  CustomVisibilityState,
  defineFileAction,
  FileBrowser,
  FileBrowserHandle,
  FileContextMenu,
  FileList,
  MapFileActionsToData,
} from "@aperturerobotics/chonky"
import { Breadcrumbs, Button, Stack, Typography } from "@mui/material"
import { Edit, File, FileUp, Folder, FolderPlus, Trash } from "lucide-react"
import { useSnackbar } from "notistack"

import { IFile, IFolder } from "@/types/folder.types"
import Loading from "@/components/Loading"

import DeleteFilesModal from "./DeleteFilesModal"
import FileModal from "./FileModal"
import FolderModal from "./FolderModal"
import UploadFilesModal from "./UploadFilesModal"

const CustomIcon = (props: ChonkyIconProps) => {
  switch (props.icon) {
    case ChonkyIconName.folder:
      return <Folder />
    case ChonkyIconName.trash:
      return <Trash />
    case ChonkyIconName.folderCreate:
      return <FolderPlus />
    case ChonkyIconName.upload:
      return <FileUp />
    case "Edit":
      return <Edit />
    default:
      return <File />
  }
}

interface IProps {
  orgId: string
  agentId?: string
  contactId?: string
  folderId?: string
  isShared?: boolean
  forAgentOnly?: boolean
}

export type ChonkyFile = (IFolder | IFile) & {
  id: string
  isDir?: boolean
}

const FolderPage = ({
  orgId,
  agentId,
  contactId,
  folderId,
  isShared = true,
  forAgentOnly = false, // we may need this param later, but based on figma, we may not need this for now
}: IProps) => {
  const fileBrowserRef = useRef<FileBrowserHandle>(null)
  const { push } = useRouter()
  const { enqueueSnackbar } = useSnackbar()

  const [selectedFiles, setSelectedFiles] = useState<ChonkyFile[]>([])
  const [activeFolder, setActiveFolder] = useState<IFolder | undefined>(
    undefined
  )
  const [activeFile, setActiveFile] = useState<IFile | undefined>(undefined)
  const [deleteFiles, setDeleteFiles] = useState<ChonkyFile[]>([])
  const [folderModalOpen, setFolderModalOpen] = useState(false)
  const [uploadModalOpen, setUploadModalOpen] = useState(false)

  const { data, isLoading, isFetching, refetch } = useGetFolderQuery(
    { orgId, contactId, isShared, forAgentOnly, folderId },
    { skip: !orgId }
  )
  const [getDwonloadFileUrl] = useGetDownloadFileUrlMutation()
  const [moveFiles, { isLoading: isMovingFiles }] = useMoveFilesMutation()

  const files = useMemo(
    () =>
      data
        ? [
            ...data.subFolders.map((folder) => ({
              ...folder,
              id: folder._id,
              isDir: true,
            })),
            ...data.files.map((file) => ({ ...file, id: file._id })),
          ]
        : [],
    [data]
  )

  // define custom actions
  const deleteFilesAction = defineFileAction({
    id: "action_delete_files",
    requiresSelection: true,
    customVisibility: () => {
      const count = selectedFiles.length
      return count === 0
        ? CustomVisibilityState.Hidden
        : CustomVisibilityState.Default
    },
    hotkeys: ["del"],
    button: {
      name: "Delete",
      toolbar: true,
      contextMenu: true,
      icon: ChonkyIconName.trash,
    },
  })
  const renameAction = defineFileAction({
    id: "action_rename",
    selectionTransform: () => {
      const set = new Set<string>()
      if (selectedFiles.length > 0) {
        set.add(selectedFiles[0].id)
      }
      return set
    },
    requiresSelection: true,
    customVisibility: () => {
      const count = selectedFiles.length
      return count === 0
        ? CustomVisibilityState.Hidden
        : count === 1
          ? CustomVisibilityState.Default
          : CustomVisibilityState.Disabled
    },
    hotkeys: ["ctrl+r"],
    button: {
      name: "Rename",
      toolbar: true,
      contextMenu: true,
      icon: "Edit",
    },
  })
  const createFolderAction = defineFileAction({
    id: "action_create_folder",
    requiresSelection: false,
    selectionTransform: () => {
      const set = new Set<string>()
      return set
    },
    customVisibility: () => {
      return selectedFiles.length === 0
        ? CustomVisibilityState.Default
        : CustomVisibilityState.Hidden
    },
    hotkeys: ["shift+n"],
    button: {
      name: "Create Folder",
      toolbar: true,
      contextMenu: true,
      icon: ChonkyIconName.folderCreate,
    },
  })
  const uploadFilesAction = defineFileAction({
    id: "action_upload_files",
    requiresSelection: false,
    selectionTransform: () => {
      const set = new Set<string>()
      return set
    },
    customVisibility: () => {
      return selectedFiles.length === 0
        ? CustomVisibilityState.Default
        : CustomVisibilityState.Hidden
    },
    hotkeys: ["ctrl+u"],
    button: {
      name: "Upload files",
      toolbar: true,
      contextMenu: true,
      icon: ChonkyIconName.upload,
    },
  })

  const onDownloadFile = async (file: ChonkyFile) => {
    try {
      const { url } = await getDwonloadFileUrl({
        orgId,
        contactId,
        folderId,
        fileId: file._id,
      }).unwrap()

      window.open(url, "_blank")
    } catch (error) {
      enqueueSnackbar("Something is wrong can't donwload file", {
        variant: "error",
      })
    }
  }

  const onMoveFiles = async (targetFolder: IFolder, files: ChonkyFile[]) => {
    try {
      await moveFiles({
        orgId,
        contactId,
        folderId: targetFolder._id,
        folderIds: files.filter((file) => file.isDir).map((file) => file._id),
        fileIds: files.filter((file) => !file.isDir).map((file) => file._id),
      })

      await refetch()
    } catch (error) {
      enqueueSnackbar("Move failed", {
        variant: "error",
      })
    }
  }

  const onFileAction = (data: MapFileActionsToData<any>) => {
    const { id, payload, state } = data

    switch (id) {
      case "change_selection":
        setSelectedFiles(state.selectedFiles)
        break
      case "action_create_folder":
        setFolderModalOpen(true)
        setActiveFolder(undefined)
        break
      case "action_rename": {
        const file = selectedFiles[0]
        if (file) {
          if (file.isDir) {
            // rename folder
            setFolderModalOpen(true)
            setActiveFolder(file)
          } else {
            // rename file
            setActiveFile(file as IFile)
          }
        }
        break
      }
      case "action_upload_files":
        setUploadModalOpen(true)
        break
      case "open_files": {
        const targetFile = payload.targetFile
        if (targetFile.isDir) {
          // open folder
          if (agentId) {
            if (contactId) {
              // TODO: yuri please update this url based on contact files UI
              push(
                `/app/agent-orgs/${agentId}/folders/${isShared ? "shared" : "me"}/${targetFile.id}`
              )
            } else {
              push(
                `/app/agent-orgs/${agentId}/folders/${isShared ? "shared" : "me"}/${targetFile.id}`
              )
            }
          } else {
            push(
              `/app/contact-orgs/${contactId}/folders/${targetFile.id}` as Route
            )
          }
        } else {
          // download file
          onDownloadFile(targetFile)
        }
        break
      }
      case "end_drag_n_drop": {
        const target = payload.destination as IFolder
        onMoveFiles(target, state.selectedFiles)
        break
      }
      case "action_delete_files":
        setDeleteFiles(state.selectedFiles)
        break
      default:
        break
    }
  }

  const baseRoute = useMemo(() => {
    if (agentId) {
      if (isShared) {
        return `/app/agent-orgs/${agentId}/folders/shared`
      } else {
        if (contactId) {
          // TODO: yuri please update this url based on contact files UI
          return `/app/agent-orgs/${agentId}/folders/shared`
        } else {
          return `/app/agent-orgs/${agentId}/folders/me`
        }
      }
    } else if (contactId) {
      return `/app/contact-orgs/${contactId}/folders`
    } else {
      return ""
    }
  }, [agentId, contactId, isShared, forAgentOnly])

  if (isLoading) return <Loading />

  return (
    <Stack spacing={2}>
      <Breadcrumbs>
        {data?.folder ? (
          <Link href={`${baseRoute}` as Route}>Root</Link>
        ) : (
          <Typography sx={{ color: "secondary.main", fontWeight: 600 }}>
            Root
          </Typography>
        )}
        {(data?.folder?.parentFolders || []).map((folder) => (
          <Link key={folder._id} href={`${baseRoute}/${folder._id}` as Route}>
            {folder.name}
          </Link>
        ))}
        {data?.folder && (
          <Typography sx={{ color: "secondary.main", fontWeight: 600 }}>
            {data.folder.name}
          </Typography>
        )}
      </Breadcrumbs>
      <Stack direction="row-reverse" spacing={2}>
        <Stack direction="row" spacing={2} alignItems="center">
          <Button onClick={() => setFolderModalOpen(true)}>
            Create Folder
          </Button>
          <Button onClick={() => setUploadModalOpen(true)}>Upload</Button>
          <Button
            onClick={() => {
              fileBrowserRef.current?.requestFileAction(
                ChonkyActions.EnableGridView,
                undefined
              )
            }}
          >
            Change layout
          </Button>
        </Stack>
      </Stack>
      <FileBrowser
        ref={fileBrowserRef}
        files={files}
        fileActions={[
          deleteFilesAction,
          renameAction,
          createFolderAction,
          uploadFilesAction,
        ]}
        clearSelectionOnOutsideClick
        onFileAction={onFileAction}
        disableDefaultFileActions
        iconComponent={CustomIcon}
      >
        <FileList />
        <FileContextMenu />
      </FileBrowser>

      <FolderModal
        open={folderModalOpen}
        setOpen={setFolderModalOpen}
        refetch={refetch}
        isRefetching={isFetching}
        orgId={orgId}
        contactId={contactId}
        folderId={folderId}
        isShared={isShared}
        forAgentOnly={forAgentOnly}
        folder={activeFolder}
      />
      <UploadFilesModal
        open={uploadModalOpen}
        setOpen={setUploadModalOpen}
        refetch={refetch}
        isRefetching={isFetching}
        orgId={orgId}
        contactId={contactId}
        folderId={folderId}
        isShared={isShared}
        forAgentOnly={forAgentOnly}
      />
      <FileModal
        open={!!activeFile}
        setOpen={setActiveFile}
        refetch={refetch}
        isRefetching={isFetching}
        orgId={orgId}
        contactId={contactId}
        folderId={folderId}
        file={activeFile}
      />
      <DeleteFilesModal
        open={deleteFiles.length > 0}
        setOpen={setDeleteFiles}
        refetch={refetch}
        isRefetching={isFetching}
        orgId={orgId}
        contactId={contactId}
        files={deleteFiles}
      />
    </Stack>
  )
}

export default FolderPage
