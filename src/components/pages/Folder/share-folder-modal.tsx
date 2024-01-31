import { useState } from "react"
import { useShareFolderMutation } from "@/redux/apis/media"
import { useGetContactsQuery } from "@/redux/apis/org"
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
import { FilePermission, IFolder } from "@/types/folder.types"

interface ShareFoldereModalProps {
  orgId: string
  agentId?: string
  contactId?: string
  isShared: boolean
  forAgentOnly: boolean
  folder: IFolder

  open: boolean
  setOpen: Function
  refetch: Function
}

interface IOption extends Partial<IContact> {
  _id: string
  name: string
  inputValue?: string
}

const permissions = [FilePermission.editor, FilePermission.viewer]

const initialForm = {
  orgShare: false,
  notify: false,
  message: "",
  contacts: [] as IOption[],
  permission: FilePermission.editor,
}

export default function ShareFolderModal({
  orgId,
  agentId,
  contactId,
  isShared,
  forAgentOnly,
  folder,

  open,
  setOpen,
  refetch,
}: ShareFoldereModalProps) {
  const { enqueueSnackbar } = useSnackbar()

  const [form, setForm] = useState(initialForm)

  const {
    data: contacts = [],
    isLoading,
    isFetching,
  } = useGetContactsQuery({
    orgId,
  })

  const [shareFolder, { isLoading: isSharing }] = useShareFolderMutation()

  const loading = isLoading || isFetching

  const onClose = () => {
    setForm(initialForm)
    setOpen(undefined)
  }

  const onShare = async () => {
    if (!form.orgShare && form.contacts.length === 0) {
      enqueueSnackbar("No contact is selected!", { variant: "error" })
      return
    }
    try {
      await shareFolder({
        orgId,
        agentId,
        contactId,
        isShared,
        forAgentOnly,
        folderId: folder._id,
        contactIds: form.orgShare ? [] : form.contacts.map((c) => c._id),
        permission: form.permission,
        notify: form.notify,
        orgShare: form.orgShare,
      })
      await refetch()
      enqueueSnackbar("Folder is shared", { variant: "success" })
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
            Share {folder?.name} With
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
          sx={{
            my: 2,
            gap: 2,
            alignItems: "center",
            flexDirection: "row",
          }}
        >
          <Typography sx={{ fontWeight: 700 }}>
            Share with organization
          </Typography>

          <Switch
            checked={form.orgShare}
            onChange={({ target }) =>
              setForm((prev) => ({ ...prev, orgShare: target.checked }))
            }
          />
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
            disabled={form.orgShare}
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
            disabled={form.orgShare}
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
            disabled={form.orgShare}
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
          disabled={form.orgShare}
        />

        <Typography variant="h4" sx={{ mt: 2 }}>
          People with access
        </Typography>
        <Stack spacing={1} mt={1}>
          {folder?.connections.map((con) => (
            <Stack
              key={`${con.id}-${con.type}`}
              spacing={2}
              direction="row"
              alignItems="center"
            >
              <Typography variant="h5" sx={{ textTransform: "capitalize" }}>
                {con.id ? con.username : "Shared all"}
              </Typography>
              <Typography variant="body2">
                ({folder?.creator === con.username ? "owner" : con.permission})
              </Typography>
            </Stack>
          ))}
        </Stack>

        <Stack
          sx={{
            mt: 3,
            gap: 2,
            alignItems: "center",
            flexDirection: "row",
            justifyContent: "flex-end",
          }}
        >
          <LoadingButton onClick={onShare} loading={isSharing}>
            Share
          </LoadingButton>
        </Stack>
      </Paper>
    </Modal>
  )
}
