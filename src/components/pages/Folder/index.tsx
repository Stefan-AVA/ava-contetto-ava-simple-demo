"use client"

import { useMemo, useState } from "react"
import { Route } from "next"
import Image from "next/image"
import Link from "next/link"
import {
  useGetDownloadFileUrlMutation,
  useGetFolderQuery,
  useLazyShareFileLinkQuery,
} from "@/redux/apis/media"
import { parseError } from "@/utils/error"
import { getDatefromUnix } from "@/utils/format-date"
import reduce from "@/utils/reduce"
import {
  Box,
  Breadcrumbs,
  Button,
  Card,
  Unstable_Grid2 as Grid,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Stack,
  Tooltip,
  Typography,
  type StackProps,
} from "@mui/material"
import IconFolder from "~/assets/icon-folder.svg"
import { format } from "date-fns"
import {
  Download,
  Eye,
  FileArchive,
  Link2,
  MoreHorizontal,
  Move,
  Pen,
  Plus,
  SendHorizonal,
  Trash2,
  X,
} from "lucide-react"
import { useSnackbar } from "notistack"

import { IFile, IFolder } from "@/types/folder.types"
import Dropdown from "@/components/drop-down"
import Loading from "@/components/Loading"

import DeleteFilesModal from "./DeleteFilesModal"
import FileModal from "./FileModal"
import FolderModal from "./FolderModal"
import MoveFileModal from "./MoveFileModal"
import ShareFileModal from "./share-file-modal"
import ShareFolderModal from "./share-folder-modal"
import ShareView from "./share-view"
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
  mimetype?: string
}

interface FileItemProps extends StackProps {
  name: string
  isDir: boolean
  isShared: boolean
  onMove?: () => void
  onEdit?: () => void
  addedAt: number
  agentId?: string
  onShare?: () => void
  mimetype?: string
  onDelete?: () => void
  contactId?: string
  navigateTo: string
  onPreview?: () => void
  onDownload?: () => void
  onCopyLink?: () => void
  forAgentOnly: boolean
  isLayoutGrid: boolean
}

interface PreviewModal {
  title: string
  fileUrl: string
  type: string
}

function FileItem({
  name,
  isDir,
  onMove,
  onEdit,
  addedAt,
  agentId,
  onShare,
  mimetype,
  onDelete,
  onPreview,
  onCopyLink,
  onDownload,
  navigateTo,
  isLayoutGrid,
}: FileItemProps) {
  const [showMoreActions, setShowMoreActions] = useState(false)

  return (
    <Grid
      sx={{
        px: !isLayoutGrid ? 1 : 0,
        mb: 2,
        width: isLayoutGrid ? "fit-content" : "100%",
        bgcolor: !isLayoutGrid ? "gray.200" : "transparent",
        alignItems: !isLayoutGrid
          ? {
              xs: "flex-start",
              lg: "center",
            }
          : "center",
        borderRadius: ".625rem",
      }}
      spacing={2}
      container
    >
      <Grid xs={12} lg={5}>
        <Stack
          sx={{
            gap: 1.5,
            alignItems: "center",
            flexDirection: !isLayoutGrid ? "row" : "column",
          }}
          href={navigateTo as Route}
          component={isDir ? Link : "div"}
        >
          {isDir && (
            <Image src={IconFolder} alt="" width={isLayoutGrid ? 80 : 32} />
          )}

          {!isDir && (
            <Box
              sx={{
                color: "gray.700",
              }}
              size={isLayoutGrid ? 80 : 28}
              component={FileArchive}
              strokeWidth={1.5}
            />
          )}

          <Typography
            sx={{
              color: "gray.700",
              fontWeight: 600,
            }}
            variant="body2"
          >
            {reduce(name, 32)}
          </Typography>
        </Stack>
      </Grid>

      <Grid xs={6} lg={3}>
        <Typography
          sx={{ color: "gray.700", textTransform: "capitalize" }}
          variant="body2"
        >
          {isDir ? "Folder" : mimetype ? mimetype.split("/")[1] : "-"}
        </Typography>
      </Grid>

      <Grid xs={6} lg={2}>
        <Typography sx={{ color: "gray.700" }} variant="body2">
          {format(new Date(getDatefromUnix(addedAt)), "MMM dd, yyyy")}
        </Typography>
      </Grid>

      {!isLayoutGrid && (
        <Grid xs={12} lg={2}>
          <Stack
            sx={{
              gap: 2,
              float: "right",
              alignItems: "center",
              flexDirection: "row",

              button: {
                px: 0,
              },
            }}
          >
            {onPreview && !isDir && (
              <Tooltip title="Preview" placement="top">
                <button type="button" onClick={onPreview}>
                  <Eye size={20} />
                </button>
              </Tooltip>
            )}

            {onShare && agentId && (
              <Tooltip title="Share" placement="top">
                <button type="button" onClick={onShare}>
                  <SendHorizonal size={20} />
                </button>
              </Tooltip>
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
                  {onPreview && !isDir && (
                    <ListItem
                      onClick={() => {
                        setShowMoreActions(false)
                        onPreview()
                      }}
                      disablePadding
                    >
                      <ListItemButton>
                        <ListItemIcon>
                          <Eye size={20} />
                        </ListItemIcon>

                        <ListItemText>Preview</ListItemText>
                      </ListItemButton>
                    </ListItem>
                  )}

                  {onShare && agentId && (
                    <ListItem
                      onClick={() => {
                        setShowMoreActions(false)
                        onShare()
                      }}
                      disablePadding
                    >
                      <ListItemButton>
                        <ListItemIcon>
                          <SendHorizonal size={20} />
                        </ListItemIcon>

                        <ListItemText>Share</ListItemText>
                      </ListItemButton>
                    </ListItem>
                  )}

                  {onCopyLink && !isDir && agentId && (
                    <ListItem
                      onClick={() => {
                        setShowMoreActions(false)
                        onCopyLink()
                      }}
                      disablePadding
                    >
                      <ListItemButton>
                        <ListItemIcon>
                          <Link2 size={20} />
                        </ListItemIcon>

                        <ListItemText>Copy Link</ListItemText>
                      </ListItemButton>
                    </ListItem>
                  )}

                  {onEdit && (
                    <ListItem
                      onClick={() => {
                        setShowMoreActions(false)
                        onEdit()
                      }}
                      disablePadding
                    >
                      <ListItemButton>
                        <ListItemIcon>
                          <Pen size={20} />
                        </ListItemIcon>

                        <ListItemText>Rename</ListItemText>
                      </ListItemButton>
                    </ListItem>
                  )}

                  {onDownload && !isDir && (
                    <ListItem
                      onClick={() => {
                        setShowMoreActions(false)
                        onDownload()
                      }}
                      disablePadding
                    >
                      <ListItemButton>
                        <ListItemIcon>
                          <Download size={20} />
                        </ListItemIcon>

                        <ListItemText>Download</ListItemText>
                      </ListItemButton>
                    </ListItem>
                  )}

                  {onMove && (
                    <ListItem
                      onClick={() => {
                        setShowMoreActions(false)
                        onMove()
                      }}
                      disablePadding
                    >
                      <ListItemButton>
                        <ListItemIcon>
                          <Move size={20} />
                        </ListItemIcon>

                        <ListItemText>Move</ListItemText>
                      </ListItemButton>
                    </ListItem>
                  )}

                  {onDelete && (
                    <ListItem
                      onClick={() => {
                        setShowMoreActions(false)
                        onDelete()
                      }}
                      disablePadding
                    >
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
        </Grid>
      )}
    </Grid>
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
  const { enqueueSnackbar } = useSnackbar()

  const [layoutType, setLayoutType] = useState<LayoutType>("LIST")
  const [activeFolder, setActiveFolder] = useState<IFolder | undefined>(
    undefined
  )
  const [activeFile, setActiveFile] = useState<IFile | undefined>(undefined)
  const [activeShareFile, setActiveShareFile] = useState<IFile | undefined>(
    undefined
  )
  const [activeShareFolder, setActiveShareFolder] = useState<
    IFolder | undefined
  >(undefined)
  const [activeMoveFile, setActiveMoveFile] = useState<
    FileOrFolder | undefined
  >(undefined)
  const [deleteFiles, setDeleteFiles] = useState<FileOrFolder[]>([])
  const [previewModal, setPreviewModal] = useState<PreviewModal | null>(null)
  const [openAddDropdown, setOpenAddDropdown] = useState(false)
  const [folderModalOpen, setFolderModalOpen] = useState(false)
  const [uploadModalOpen, setUploadModalOpen] = useState(false)
  // const [openGridDropdown, setOpenGridDropdown] = useState(false)

  const { data, isLoading, isFetching, refetch } = useGetFolderQuery(
    { orgId, agentId, contactId, isShared, forAgentOnly, folderId },
    { skip: !orgId }
  )
  const [getDownloadFileUrl] = useGetDownloadFileUrlMutation()
  const [getSharefileLink] = useLazyShareFileLinkQuery()
  // const [shareAgentOnlyFile] = useShareAgentOnlyFileMutation()

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

  async function generateFileUrl(fileId: string) {
    try {
      const { url } = await getDownloadFileUrl({
        orgId,
        agentId,
        contactId,
        fileId,
        isShared,
        forAgentOnly,
      }).unwrap()

      return url
    } catch (error) {
      enqueueSnackbar("Something is wrong can't donwload file", {
        variant: "error",
      })

      return null
    }
  }

  async function onPreview(file: FileOrFolder) {
    if (!file.isDir) {
      const fileUrl = await generateFileUrl(file._id)

      if (!fileUrl) return

      setPreviewModal({
        title: file.name,
        fileUrl,
        type: file.mimetype!,
      })
    }
  }

  async function onDownloadFile(file: FileOrFolder) {
    const fileUrl = await generateFileUrl(file._id)

    if (!fileUrl) return

    const response = await fetch(fileUrl)
    const blob = await response.blob()

    const url = window.URL.createObjectURL(new Blob([blob]))
    const link = document.createElement("a")
    link.href = url
    link.setAttribute("download", file.name)

    document.body.appendChild(link)

    link.click()

    link.parentNode?.removeChild(link)
  }

  async function onShare(file: FileOrFolder) {
    if (agentId) {
      if (file.isDir) {
        setActiveShareFolder(file as IFolder)
      } else {
        setActiveShareFile(file as IFile)
        // if (contactId && forAgentOnly) {
        //   try {
        //     await shareAgentOnlyFile({
        //       orgId,
        //       contactId,
        //       fileId: file._id,
        //     }).unwrap()

        //     enqueueSnackbar("Shared", {
        //       variant: "success",
        //     })

        //     await refetch()
        //   } catch (error) {
        //     enqueueSnackbar("Something is wrong can't share file", {
        //       variant: "error",
        //     })
        //   }
        // } else {
        //   setActiveShareFile(file as IFile)
        // }
      }
    }
  }

  async function onCopyLink(file: FileOrFolder) {
    try {
      if (agentId) {
        if (!file.isDir) {
          const { link } = await getSharefileLink({
            orgId,
            fileId: file._id,
          }).unwrap()

          navigator.clipboard.writeText(link)

          enqueueSnackbar("Copied", { variant: "success" })
        }
      }
    } catch (error) {
      enqueueSnackbar(parseError(error), { variant: "error" })
    }
  }

  const baseRoute = useMemo(() => {
    if (agentId) {
      if (contactId) {
        if (forAgentOnly) {
          return `/app/agent-orgs/${agentId}/contacts/${contactId}/folders/foragent`
        } else {
          return `/app/agent-orgs/${agentId}/contacts/${contactId}/folders/forcontact`
        }
      } else {
        if (isShared) {
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
          {/* <Dropdown
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
          </Dropdown> */}

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
                  onClick={() => {
                    setOpenAddDropdown(false)
                    setUploadModalOpen(true)
                  }}
                  disablePadding
                >
                  <ListItemButton>
                    <ListItemText>Upload file</ListItemText>
                  </ListItemButton>
                </ListItem>

                <ListItem
                  onClick={() => {
                    setOpenAddDropdown(false)
                    setFolderModalOpen(true)
                  }}
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
            gap: isLayoutGrid ? 5 : 1,
            flexWrap: "wrap",
            flexDirection: isLayoutGrid ? "row" : "column",
          }}
        >
          <Grid
            sx={{
              height: "2rem",
              display: {
                xs: "none",
                lg: "flex",
              },
            }}
            container
          >
            <Grid xs={5}>
              <Typography
                sx={{ color: "gray.700", fontWeight: "700" }}
                variant="body2"
              >
                Name
              </Typography>
            </Grid>

            <Grid xs={3}>
              <Typography
                sx={{ color: "gray.700", fontWeight: "700" }}
                variant="body2"
              >
                File Type
              </Typography>
            </Grid>

            <Grid xs={2}>
              <Typography
                sx={{ color: "gray.700", fontWeight: "700" }}
                variant="body2"
              >
                Added
              </Typography>
            </Grid>

            <Grid xs={2} />
          </Grid>

          {files.map((file) => (
            <FileItem
              key={file.id}
              name={file.name}
              isDir={file.isDir ?? false}
              onEdit={() => {
                if (file.isDir) {
                  setActiveFolder(file as IFolder)
                  setFolderModalOpen(true)
                } else {
                  setActiveFile(file as IFile)
                }
              }}
              onMove={() => setActiveMoveFile(file)}
              agentId={agentId}
              addedAt={file.timestamp}
              onShare={() => onShare(file)}
              isShared={isShared}
              mimetype={file.mimetype}
              onDelete={() => setDeleteFiles([file])}
              onPreview={() => onPreview(file)}
              contactId={contactId}
              onDownload={() => onDownloadFile(file)}
              onCopyLink={() => onCopyLink(file)}
              navigateTo={`${baseRoute}/${file.id}`}
              forAgentOnly={forAgentOnly}
              isLayoutGrid={isLayoutGrid}
            />
          ))}
        </Stack>
      )}

      <FolderModal
        open={folderModalOpen}
        onClose={() => {
          setActiveFolder(undefined)
          setFolderModalOpen(false)
        }}
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
          refetch={refetch}
        />
      )}

      {agentId && (
        <ShareFolderModal
          orgId={orgId}
          agentId={agentId}
          contactId={contactId}
          isShared={isShared}
          forAgentOnly={forAgentOnly}
          folder={activeShareFolder!}
          open={!!activeShareFolder}
          setOpen={setActiveShareFolder}
          refetch={refetch}
        />
      )}

      <MoveFileModal
        orgId={orgId}
        agentId={agentId}
        contactId={contactId}
        isShared={isShared}
        forAgentOnly={forAgentOnly}
        file={activeMoveFile}
        open={!!activeMoveFile}
        setOpen={setActiveMoveFile}
        isRefetching={isFetching}
      />

      {previewModal && (
        <ShareView {...previewModal}>
          <Button
            sx={{
              color: "white",
              width: "2.5rem",
              height: "2.5rem",
            }}
            onClick={() => setPreviewModal(null)}
            variant="text"
          >
            <X strokeWidth={3} />
          </Button>
        </ShareView>
      )}
    </Stack>
  )
}

export default FolderPage
