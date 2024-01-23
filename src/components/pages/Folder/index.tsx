"use client"

import { memo, useMemo, useRef, useState } from "react"
import { useRouter } from "next/navigation"
import { useGetFolderQuery } from "@/redux/apis/media"
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
import { Button, Stack } from "@mui/material"
import { Edit, File, FileUp, Folder, FolderPlus, Trash } from "lucide-react"

import { IFile, IFolder } from "@/types/folder.types"

import FolderModal from "./FolderModal"
import UploadFilesModal from "./UploadFilesModal"

const CustomIcon: React.FC<ChonkyIconProps> = memo((props) => {
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
})

interface IProps {
  orgId: string
  agentId?: string
  contactId?: string
  folderId?: string
  isShared: boolean
  forAgentOnly?: boolean
}

type ChonkyFile = (IFolder | IFile) & {
  id: string
  isDir?: boolean
}

const FolderPage = ({
  orgId,
  agentId,
  contactId,
  folderId,
  isShared = true,
  forAgentOnly = false,
}: IProps) => {
  const fileBrowserRef = useRef<FileBrowserHandle>(null)
  const { push } = useRouter()

  const [selectedFiles, setSelectedFiles] = useState<ChonkyFile[]>([])
  const [activeFolder, setActiveFolder] = useState<IFolder | undefined>(
    undefined
  )
  const [folderModalOpen, setFolderModalOpen] = useState(false)
  const [uploadModalOpen, setUploadModalOpen] = useState(false)

  const { data, isLoading, isFetching, refetch } = useGetFolderQuery(
    { orgId, contactId, isShared, forAgentOnly, folderId },
    { skip: !orgId }
  )

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

  // const deleteFiles = defineFileAction({
  //   id: "delete_files",
  //   requiresSelection: true,
  //   button: {
  //     name: "Delete files",
  //     toolbar: true,
  //     contextMenu: true,
  //     icon: ChonkyIconName.trash,
  //   },
  // })
  // const deleteFolder = defineFileAction({
  //   id: "delete_folder",
  //   requiresSelection: true,
  //   button: {
  //     name: "Delete files",
  //     toolbar: true,
  //     contextMenu: true,
  //     icon: ChonkyIconName.trash,
  //   },
  // })
  const rename = defineFileAction({
    id: "rename",
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
  const createFolder = defineFileAction({
    id: "create_folder",
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
  const uploadFiles = defineFileAction({
    id: "upload_files",
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

  const onFileAction = (data: MapFileActionsToData<any>) => {
    const { id, payload, state } = data
    // console.log(id)
    const files = state.selectedFiles
    console.log(data)
    switch (id) {
      case "create_folder":
        setFolderModalOpen(true)
        setActiveFolder(undefined)
        break
      case "rename":
        const file = selectedFiles[0]
        if (file) {
          if (file.isDir) {
            // rename folder
            setFolderModalOpen(true)
            setActiveFolder(file)
          } else {
            // rename file
          }
        }
        break
      case "upload_files":
        setUploadModalOpen(true)
        break
      case "end_drag_n_drop":
        const target = payload.destination as IFolder
        console.log("drop ===>", target, files)
        break
      case "open_files":
        const targetFile = payload.targetFile
        if (targetFile.isDir) {
          // open folder
          if (agentId) {
            if (contactId) {
            } else {
              push(
                `/app/agent-orgs/${agentId}/folders/${isShared ? "shared" : "me"}/${targetFile.id}`
              )
            }
          }
        } else {
          // download file
          console.log("download file")
        }
        break
      case "delete_files":
        console.log("delete ==>", files)
        break
      case "change_selection":
        setSelectedFiles(files)
        break
      default:
        break
    }
  }

  return (
    <Stack spacing={2}>
      <Stack direction="row-reverse" spacing={2}>
        <Stack direction="row" spacing={2} alignItems="center">
          <Button onClick={() => setFolderModalOpen(true)}>
            Create Folder
          </Button>
          <Button onClick={() => setUploadModalOpen(true)}>Upload</Button>
        </Stack>
      </Stack>
      <FileBrowser
        ref={fileBrowserRef}
        files={files}
        fileActions={[
          // deleteFiles,
          // deleteFolder,
          rename,
          createFolder,
          uploadFiles,
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
    </Stack>
  )
}

export default FolderPage
