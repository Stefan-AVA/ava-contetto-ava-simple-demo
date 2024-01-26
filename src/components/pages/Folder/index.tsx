"use client"

import { useMemo, useState } from "react"
import { Route } from "next"
import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/navigation"
import {
  useGetDownloadFileUrlMutation,
  useGetFolderQuery,
} from "@/redux/apis/media"
import {
  Box,
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
  type StackProps,
} from "@mui/material"
import IconFolder from "~/assets/icon-folder.svg"
import {
  AlignJustify,
  Eye,
  FileArchive,
  Grip,
  LayoutGrid,
  Link2,
  MoreHorizontal,
  Pen,
  Plus,
  SendHorizonal,
  Trash2,
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

type LayoutType = "GRID" | "LIST"

interface IProps {
  orgId: string
  agentId?: string
  contactId?: string
  folderId?: string
  isShared?: boolean
  forAgentOnly?: boolean
}

export type FileOrFolder = (IFolder | IFile) & {
  id: string
  isDir?: boolean
}

interface FileItemProps extends StackProps {
  name: string
  isDir: boolean
  onEdit?: () => void
  onShare?: () => void
  onDelete?: () => void
  navigateTo: string
  onPreview?: () => void
  onCopyLink?: () => void
  isLayoutGrid: boolean
}

function FileItem({
  name,
  isDir,
  onEdit,
  onShare,
  onDelete,
  onPreview,
  onCopyLink,
  navigateTo,
  isLayoutGrid,
}: FileItemProps) {
  const [showMoreActions, setShowMoreActions] = useState(false)

  return (
    <Stack
      sx={{
        px: !isLayoutGrid ? 3 : 0,
        py: !isLayoutGrid ? 1 : 0,
        gap: 3,
        width: isLayoutGrid ? "fit-content" : "100%",
        bgcolor: !isLayoutGrid ? "gray.200" : "transparent",
        alignItems: !isLayoutGrid
          ? {
              xs: "flex-start",
              sm: "center",
            }
          : "center",
        borderRadius: ".625rem",
        flexDirection: !isLayoutGrid
          ? {
              xs: "column",
              sm: "row",
            }
          : "row",
        justifyContent: "space-between",
      }}
      href={navigateTo as Route}
      component={isDir && isLayoutGrid ? Link : "div"}
    >
      <Stack
        sx={{
          gap: 1.5,
          alignItems: "center",
          flexDirection: !isLayoutGrid ? "row" : "column",
        }}
      >
        {isDir && (
          <Image src={IconFolder} alt="" width={isLayoutGrid ? 80 : 32} />
        )}

        {!isDir && (
          <Box
            sx={{
              color: "gray.700",
            }}
            size={isLayoutGrid ? 80 : 32}
            component={FileArchive}
            strokeWidth={1.5}
          />
        )}

        <Typography
          sx={{
            color: "gray.700",
            textAlign: "center",
            fontWeight: 600,
          }}
          variant="body2"
        >
          {name}
        </Typography>
      </Stack>

      {!isLayoutGrid && (
        <Stack
          sx={{
            gap: 2,
            alignItems: "center",
            flexDirection: "row",

            button: {
              px: 0,
            },
          }}
        >
          {onEdit && (
            <button type="button" onClick={onEdit}>
              <Pen size={20} />
            </button>
          )}

          {onPreview && (
            <button type="button" onClick={onPreview}>
              <Eye size={20} />
            </button>
          )}

          {onShare && (
            <button type="button" onClick={onShare}>
              <SendHorizonal size={20} />
            </button>
          )}

          <Dropdown
            open={showMoreActions}
            ancher={
              <button type="button" onClick={() => setShowMoreActions(true)}>
                <MoreHorizontal size={20} />
              </button>
            }
            onClose={() => setShowMoreActions(false)}
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
                {onPreview && (
                  <ListItem onClick={onPreview} disablePadding>
                    <ListItemButton>
                      <ListItemIcon>
                        <Eye size={20} />
                      </ListItemIcon>

                      <ListItemText>Preview</ListItemText>
                    </ListItemButton>
                  </ListItem>
                )}

                {onShare && (
                  <ListItem onClick={onShare} disablePadding>
                    <ListItemButton>
                      <ListItemIcon>
                        <SendHorizonal size={20} />
                      </ListItemIcon>

                      <ListItemText>Share</ListItemText>
                    </ListItemButton>
                  </ListItem>
                )}

                {onCopyLink && (
                  <ListItem onClick={onCopyLink} disablePadding>
                    <ListItemButton>
                      <ListItemIcon>
                        <Link2 size={20} />
                      </ListItemIcon>

                      <ListItemText>Preview</ListItemText>
                    </ListItemButton>
                  </ListItem>
                )}

                {onDelete && (
                  <ListItem onClick={onDelete} disablePadding>
                    <ListItemButton>
                      <ListItemIcon>
                        <Trash2 size={20} />
                      </ListItemIcon>

                      <ListItemText>Delete</ListItemText>
                    </ListItemButton>
                  </ListItem>
                )}
              </List>
            </Card>
          </Dropdown>
        </Stack>
      )}
    </Stack>
  )
}

const FolderPage = ({
  orgId,
  agentId,
  folderId,
  contactId,
  isShared = true,
  forAgentOnly = false, // we may need this param later, but based on figma, we may not need this for now
}: IProps) => {
  const { push } = useRouter()
  const { enqueueSnackbar } = useSnackbar()

  const [layoutType, setLayoutType] = useState<LayoutType>("GRID")
  const [activeFolder, setActiveFolder] = useState<IFolder | undefined>(
    undefined
  )
  const [activeFile, setActiveFile] = useState<IFile | undefined>(undefined)
  const [activeShareFile, setActiveShareFile] = useState<IFile | undefined>(
    undefined
  )
  const [deleteFiles, setDeleteFiles] = useState<FileOrFolder[]>([])
  const [openAddDropdown, setOpenAddDropdown] = useState(false)
  const [folderModalOpen, setFolderModalOpen] = useState(false)
  const [uploadModalOpen, setUploadModalOpen] = useState(false)
  const [openGridDropdown, setOpenGridDropdown] = useState(false)

  const { data, isLoading, isFetching, refetch } = useGetFolderQuery(
    { orgId, agentId, contactId, isShared, forAgentOnly, folderId },
    { skip: !orgId }
  )
  const [getDownloadFileUrl] = useGetDownloadFileUrlMutation()

  const isLayoutGrid = layoutType === "GRID"

  const files: FileOrFolder[] = useMemo(
    () =>
      data
        ? [
            ...data.subFolders.map((folder) => ({
              ...folder,
              id: folder._id,
              isDir: true,
            })),
            ...data.files.map((file) => ({
              ...file,
              id: file._id,
              isDir: false,
            })),
          ]
        : [],
    [data]
  )

  const onDownloadFile = async (file: FileOrFolder) => {
    try {
      const { url } = await getDownloadFileUrl({
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
    <Stack sx={{ gap: 5 }}>
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
                <Grip />
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
                <ListItem onClick={() => setLayoutType("GRID")} disablePadding>
                  <ListItemButton>
                    <ListItemIcon>
                      <LayoutGrid />
                    </ListItemIcon>

                    <ListItemText>Large grid</ListItemText>
                  </ListItemButton>
                </ListItem>

                <ListItem onClick={() => setLayoutType("LIST")} disablePadding>
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

      {files.length <= 0 && (
        <Stack
          sx={{
            px: 3,
            mt: 6,
            mb: 3,
            mx: "auto",
            gap: 2,
            maxWidth: "22rem",
            alignItems: "center",
          }}
        >
          <Typography
            sx={{
              color: "gray.600",
              textAlign: "center",
            }}
          >
            You do not have registered files.
          </Typography>
        </Stack>
      )}

      {files.length > 0 && (
        <Stack
          sx={{
            gap: isLayoutGrid ? 5 : 2,
            flexWrap: "wrap",
            flexDirection: isLayoutGrid ? "row" : "column",
          }}
        >
          {files.map((file) => (
            <FileItem
              key={file.id}
              name={file.name}
              isDir={file.isDir ?? false}
              onEdit={() => {
                setActiveFolder(file)
                setFolderModalOpen(true)
              }}
              onShare={() => setActiveShareFile(file as IFile)}
              onDelete={() => setDeleteFiles([file])}
              onPreview={() =>
                file.isDir
                  ? push(`${baseRoute}/${file.id}` as Route)
                  : onDownloadFile(file)
              }
              onCopyLink={() => {}}
              navigateTo={`${baseRoute}/${file.id}`}
              isLayoutGrid={isLayoutGrid}
            />
          ))}
        </Stack>
      )}

      {/* <FileBrowser
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
      </FileBrowser> */}

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
          file={activeShareFile!}
          open={!!activeShareFile}
          orgId={orgId}
          setOpen={setActiveShareFile}
          agentId={agentId}
        />
      )}
    </Stack>
  )
}

export default FolderPage
