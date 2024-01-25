import { useMemo, useState } from "react"
import { useParams } from "next/navigation"
import { useShareFileMutation } from "@/redux/apis/media"
import { useGetContactsQuery } from "@/redux/apis/org"
import { RootState } from "@/redux/store"
import { parseError } from "@/utils/error"
import { nameInitials } from "@/utils/format-name"
import { LoadingButton } from "@mui/lab"
import {
  Autocomplete,
  Avatar,
  CircularProgress,
  InputAdornment,
  ListItem,
  ListItemAvatar,
  ListItemText,
  MenuItem,
  Modal,
  Paper,
  Stack,
  Switch,
  TextField,
  Typography,
} from "@mui/material"
import { X } from "lucide-react"
import { useSnackbar } from "notistack"

import type { IContact } from "@/types/contact.types"
import { FilePermission, IFile } from "@/types/folder.types"

interface ShareFileModalProps {
  open: boolean
  setOpen: Function
  orgId: string
  agentId: string
  file: IFile
}

interface IOption extends Partial<IContact> {
  _id: string
  name: string
  inputValue?: string
}

const permissions = [
  FilePermission.editor,
  FilePermission.viewer,
  FilePermission.commentor,
]

const initialForm = {
  notify: false,
  message: "",
  contacts: [] as IOption[],
  permission: FilePermission.editor,
}

export default function ShareFileModal({
  open,
  setOpen,
  file,
  orgId,
}: ShareFileModalProps) {
  const { enqueueSnackbar } = useSnackbar()

  const [form, setForm] = useState(initialForm)

  const {
    data: contacts = [],
    isLoading,
    isFetching,
  } = useGetContactsQuery({
    orgId,
  })

  const [shareFile, { isLoading: isSharing }] = useShareFileMutation()

  const loading = isLoading || isFetching

  const onClose = () => {
    setForm(initialForm)
    setOpen(undefined)
  }

  const onShare = async () => {
    if (form.contacts.length === 0) {
      enqueueSnackbar("No contact is selected!", { variant: "error" })
      return
    }
    try {
      await shareFile({
        orgId,
        fileId: file._id,
        contactIds: form.contacts.map((c) => c._id),
        permission: form.permission,
      })
      enqueueSnackbar("File is shared", { variant: "success" })
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
            Share {file?.name} With
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

        <Stack
          sx={{ mt: 3, gap: 2, alignItems: "center", flexDirection: "row" }}
        >
          <Autocomplete
            value={form.contacts}
            loading={loading}
            options={contacts as IOption[]}
            onChange={(_, newValue) =>
              setForm((prev) => ({ ...prev, contacts: newValue }))
            }
            multiple
            fullWidth
            clearOnBlur
            renderInput={(params) => (
              <TextField
                {...params}
                label="Search Contacts"
                InputProps={{
                  ...params.InputProps,
                  endAdornment: (
                    <InputAdornment position="end">
                      {loading ? <CircularProgress size="1.25rem" /> : null}
                      {params.InputProps.endAdornment}
                    </InputAdornment>
                  ),
                }}
              />
            )}
            renderOption={({ key, ...props }: any, option) => (
              <ListItem key={option._id} {...props}>
                {!option.inputValue && (
                  <ListItemAvatar>
                    <Avatar alt={option.name}>
                      {nameInitials(option.name)}
                    </Avatar>
                  </ListItemAvatar>
                )}

                <ListItemText>{option.name}</ListItemText>
              </ListItem>
            )}
            noOptionsText="No Contacts"
            selectOnFocus
            getOptionLabel={(option) => option.name}
            handleHomeEndKeys
          />

          <TextField
            sx={{ minWidth: "8rem" }}
            label="Permission"
            value={form.permission}
            select
            onChange={({ target }) =>
              setForm((prev) => ({
                ...prev,
                permission: target.value as FilePermission,
              }))
            }
          >
            {permissions.map((value) => (
              <MenuItem
                sx={{ textTransform: "capitalize" }}
                key={value}
                value={value}
              >
                {value}
              </MenuItem>
            ))}
          </TextField>
        </Stack>

        <Stack
          sx={{
            my: 2,
            gap: 2,
            alignItems: "center",
            flexDirection: "row",
          }}
        >
          <Typography sx={{ fontWeight: 700 }}>Notify Contact</Typography>

          <Switch
            checked={form.notify}
            onChange={({ target }) =>
              setForm((prev) => ({ ...prev, notify: target.checked }))
            }
          />
        </Stack>

        <TextField
          rows={6}
          label="Message"
          value={form.message}
          onChange={({ target }) =>
            setForm((prev) => ({ ...prev, message: target.value }))
          }
          fullWidth
          multiline
        />

        <Stack
          sx={{
            mt: 3,
            gap: 2,
            alignItems: "center",
            flexDirection: "row",
            justifyContent: "space-between",
          }}
        >
          <LoadingButton variant="outlined">Copy Link</LoadingButton>

          <LoadingButton onClick={onShare} loading={isSharing}>
            Share
          </LoadingButton>
        </Stack>
      </Paper>
    </Modal>
  )
}
