"use client"

import { useMemo, useRef, useState } from "react"
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
import {
  Breadcrumbs,
  Button,
  Card,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Stack,
  Typography,
} from "@mui/material"
import {
  AlignJustify,
  Edit,
  File,
  FileUp,
  Folder,
  FolderPlus,
  Grid2X2,
  LayoutGrid,
  Plus,
  Share,
  Trash,
} from "lucide-react"
import { useSnackbar } from "notistack"

import { IFile, IFolder } from "@/types/folder.types"
import Dropdown from "@/components/drop-down"
import Loading from "@/components/Loading"

import DeleteFilesModal from "./DeleteFilesModal"
import FileModal from "./FileModal"
import FolderModal from "./FolderModal"
import ShareFileModal from "./share-file-modal"
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
    case ChonkyIconName.share:
      return <Share />
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
  const [activeShareFile, setActiveShareFile] = useState<IFile | undefined>(
    undefined
  )
  const [deleteFiles, setDeleteFiles] = useState<ChonkyFile[]>([])
  const [openAddDropdown, setOpenAddDropdown] = useState(false)
  const [folderModalOpen, setFolderModalOpen] = useState(false)
  const [uploadModalOpen, setUploadModalOpen] = useState(false)
  const [openGridDropdown, setOpenGridDropdown] = useState(false)

  const { data, isLoading, isFetching, refetch } = useGetFolderQuery(
    { orgId, agentId, contactId, isShared, forAgentOnly, folderId },
    { skip: !orgId }
  )
  const [getDwonloadFileUrl] = useGetDownloadFileUrlMutation()
  const [moveFiles] = useMoveFilesMutation()

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

  const shareFilesAction = defineFileAction({
    id: "action_share_files",
    requiresSelection: true,
    customVisibility: () => {
      return isShared || contactId || selectedFiles.length === 0
        ? CustomVisibilityState.Hidden
        : selectedFiles.length > 1 || selectedFiles.find((f) => f.isDir)
          ? CustomVisibilityState.Disabled
          : CustomVisibilityState.Default
    },
    button: {
      name: "Share file",
      toolbar: true,
      contextMenu: true,
      icon: ChonkyIconName.share,
    },
  })

  const onDownloadFile = async (file: ChonkyFile) => {
    try {
      const { url } = await getDwonloadFileUrl({
        orgId,
        agentId,
        contactId,
        fileId: file._id,
        isShared,
        forAgentOnly,
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
        agentId,
        contactId,
        folderId: targetFolder._id,
        folderIds: files.filter((file) => file.isDir).map((file) => file._id),
        fileIds: files.filter((file) => !file.isDir).map((file) => file._id),
        isShared,
        forAgentOnly,
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
      case "action_share_files":
        if (selectedFiles[0] && !selectedFiles[0].isDir) {
          setActiveShareFile(selectedFiles[0] as IFile)
        }
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
  }, [agentId, contactId, isShared])

  if (isLoading) return <Loading />

  return (
    <Stack>
      <Stack
        sx={{
          gap: 3,
          flexWrap: "wrap",
          alignItems: "center",
          flexDirection: "row",
          justifyContent: "space-between",
        }}
      >
        <Breadcrumbs>
          {data?.folder && <Link href={`${baseRoute}` as Route}>Root</Link>}

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

        <Stack direction="row" gap={2} alignItems="center">
          <Dropdown
            open={openGridDropdown}
            ancher={
              <button type="button" onClick={() => setOpenGridDropdown(true)}>
                <Grid2X2 />
              </button>
            }
            onClose={() => setOpenGridDropdown(false)}
            anchorOrigin={{
              vertical: "bottom",
              horizontal: "right",
            }}
            transformOrigin={{
              vertical: "top",
              horizontal: "right",
            }}
          >
            <Card>
              <List>
                <ListItem
                  onClick={() =>
                    fileBrowserRef.current?.requestFileAction(
                      ChonkyActions.EnableGridView,
                      undefined
                    )
                  }
                  disablePadding
                >
                  <ListItemButton>
                    <ListItemIcon>
                      <LayoutGrid />
                    </ListItemIcon>

                    <ListItemText>Large grid</ListItemText>
                  </ListItemButton>
                </ListItem>

                <ListItem
                  onClick={() =>
                    fileBrowserRef.current?.requestFileAction(
                      ChonkyActions.EnableListView,
                      undefined
                    )
                  }
                  disablePadding
                >
                  <ListItemButton>
                    <ListItemIcon>
                      <AlignJustify />
                    </ListItemIcon>

                    <ListItemText>List</ListItemText>
                  </ListItemButton>
                </ListItem>
              </List>
            </Card>
          </Dropdown>

          <Dropdown
            open={openAddDropdown}
            ancher={
              <Button
                size="small"
                onClick={() => setOpenAddDropdown(true)}
                startIcon={<Plus size={16} strokeWidth={2} />}
              >
                Add
              </Button>
            }
            onClose={() => setOpenAddDropdown(false)}
            anchorOrigin={{
              vertical: "bottom",
              horizontal: "right",
            }}
            transformOrigin={{
              vertical: "top",
              horizontal: "right",
            }}
          >
            <Card>
              <List>
                <ListItem
                  onClick={() => setUploadModalOpen(true)}
                  disablePadding
                >
                  <ListItemButton>
                    <ListItemText>Upload file</ListItemText>
                  </ListItemButton>
                </ListItem>

                <ListItem
                  onClick={() => setFolderModalOpen(true)}
                  disablePadding
                >
                  <ListItemButton>
                    <ListItemText>New folder</ListItemText>
                  </ListItemButton>
                </ListItem>
              </List>
            </Card>
          </Dropdown>
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
          shareFilesAction,
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
        agentId={agentId}
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
        agentId={agentId}
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
        agentId={agentId}
        contactId={contactId}
        isShared={isShared}
        forAgentOnly={forAgentOnly}
        file={activeFile}
      />

      <DeleteFilesModal
        open={deleteFiles.length > 0}
        setOpen={setDeleteFiles}
        refetch={refetch}
        isRefetching={isFetching}
        orgId={orgId}
        agentId={agentId}
        contactId={contactId}
        isShared={isShared}
        forAgentOnly={forAgentOnly}
        files={deleteFiles}
      />

      {agentId && (
        <ShareFileModal
          open={!!activeShareFile}
          setOpen={setActiveShareFile}
          orgId={orgId}
          agentId={agentId}
          file={activeShareFile!}
        />
      )}
    </Stack>
  )
}

export default FolderPage
