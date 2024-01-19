"use client"

import { useRef } from "react"
import { Box, Stack } from "@mui/material"
import {
  ChonkyActions,
  FileArray,
  FileBrowser,
  FileContextMenu,
  FileList,
} from "chonky"

interface IProps {
  orgId: string
  agentId?: string
  contactId?: string
  folderId?: string
  isShared: boolean
  forAgentOnly?: boolean
}

const FolderPage = ({
  orgId,
  agentId,
  contactId,
  folderId,
  isShared = true,
  forAgentOnly = false,
}: IProps) => {
  const fileBrowserRef = useRef(null)

  const files: FileArray = [
    { id: "lht", name: "Projects", isDir: true },
    {
      id: "mcd",
      name: "chonky-sphere-v2.png",
      thumbnailUrl: "https://chonky.io/chonky-sphere-v2.png",
    },
    {
      id: "mcd1",
      name: "chonky-sphere-v3.png",
      thumbnailUrl: "https://chonky.io/chonky-sphere-v2.png",
    },
    {
      id: "mcd2",
      name: "chonky-sphere-v4.png",
      thumbnailUrl: "https://chonky.io/chonky-sphere-v2.png",
    },
    {
      id: "mcd3",
      name: "chonky-sphere-v5.png",
      thumbnailUrl: "https://chonky.io/chonky-sphere-v2.png",
    },
  ]
  const folderChain = [{ id: "xcv", name: "Demo", isDir: true }]

  return (
    <Stack>
      <FileBrowser
        ref={fileBrowserRef}
        files={files}
        fileActions={[
          ChonkyActions.CreateFolder,
          ChonkyActions.DeleteFiles,
          ChonkyActions.UploadFiles,
          ChonkyActions.DownloadFiles,
        ]}
        onFileAction={(data) => console.log("file action ===>", data)}
        disableDefaultFileActions
      >
        <FileList />
        <FileContextMenu />
      </FileBrowser>
    </Stack>
  )
}

export default FolderPage
