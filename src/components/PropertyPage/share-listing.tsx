import { useMemo, useState } from "react"
import { useParams } from "next/navigation"
import { useGetContactsQuery } from "@/redux/apis/org"
import { useSharePropertyMutation } from "@/redux/apis/search"
import { type RootState } from "@/redux/store"
import { parseError } from "@/utils/error"
import { nameInitials } from "@/utils/format-name"
import { LoadingButton } from "@mui/lab"
import {
  Autocomplete,
  Avatar,
  CircularProgress,
  Dialog,
  InputAdornment,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Modal,
  Paper,
  Stack,
  TextField,
  Typography,
} from "@mui/material"
import { Search, X } from "lucide-react"
import { useSnackbar } from "notistack"
import { useSelector } from "react-redux"

import type { IContact } from "@/types/contact.types"
import type { IListing } from "@/types/listing.types"

import CreateContactForm from "../create-contact-form"
import Property from "../SearchPage/Property"

interface IOption extends Partial<IContact> {
  _id: string
  name: string
  inputValue?: string
}

interface ShareListingProps {
  show: boolean
  data: IListing | null
  onClose: () => void
}

const initialForm = {
  contact: null as IOption | null,
  message: "",
}

export default function ShareListing({
  data,
  show,
  onClose,
}: ShareListingProps) {
  const [newContactName, setNewContactname] = useState("")
  const [modalOpen, setModalOpen] = useState(false)

  const [form, setForm] = useState(initialForm)

  const { agentId, searchId, propertyId } = useParams()

  const { enqueueSnackbar } = useSnackbar()

  const agentOrgs = useSelector((state: RootState) => state.app.agentOrgs)

  const agentProfile = useMemo(
    () => agentOrgs.find((agent) => agent._id === agentId),
    [agentId, agentOrgs]
  )

  const orgId = agentProfile ? agentProfile.orgId : ""

  const {
    data: contacts = [],
    isLoading,
    isFetching,
    refetch,
  } = useGetContactsQuery(
    {
      orgId,
    },
    {
      skip: !orgId,
    }
  )
  const [shareProperty, { isLoading: isSharing }] = useSharePropertyMutation()

  const loading = isLoading || isFetching

  async function submit() {
    if (!form.contact) {
      enqueueSnackbar("Select a contact", { variant: "error" })

      return
    }

    if (!form.contact.email) {
      enqueueSnackbar("This contact don't have an email", { variant: "error" })

      return
    }

    try {
      await shareProperty({
        orgId,
        searchId: String(searchId),
        propertyId: String(propertyId),
        contactId: form.contact._id,
        message: form.message,
      })

      enqueueSnackbar(`Share link is sent to ${form.contact.email}`, {
        variant: "success",
      })

      onClose()
    } catch (error) {
      enqueueSnackbar(parseError(error), { variant: "error" })
    }
  }

  return (
    <>
      <Modal open={!!show} onClose={onClose}>
        <Paper
          sx={{
            p: {
              xs: 2,
              md: 4,
            },
            top: "50%",
            left: "50%",
            width: "100%",
            outline: "none",
            position: "absolute",
            maxWidth: "59rem",
            maxHeight: "90vh",
            overflowY: "auto",
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
              Share Listing in AVA Chat
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
              mt: 4,
              gap: {
                xs: 4,
                md: 10,
              },
              flexDirection: {
                xs: "column",
                md: "row",
              },
            }}
          >
            <Stack sx={{ gap: 3, flex: 1 }}>
              <Autocomplete
                value={form.contact}
                loading={loading}
                options={contacts as IOption[]}
                onChange={(_, newValue) => {
                  if (newValue?.inputValue) {
                    setTimeout(() => {
                      setNewContactname(String(newValue.inputValue))
                      setModalOpen(true)
                    })
                  } else {
                    setTimeout(() => {
                      setNewContactname("")
                      setForm((prev) => ({ ...prev, contact: newValue }))
                    })
                  }
                }}
                fullWidth
                clearOnBlur
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Select Contact"
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
                filterOptions={(options, params) => {
                  const filtered = options.filter((option) =>
                    option.name.includes(params.inputValue)
                  )

                  if (params.inputValue && filtered.length === 0) {
                    filtered.push({
                      _id: `Add "${params.inputValue}"`,
                      name: `Add "${params.inputValue}"`,
                      inputValue: params.inputValue,
                    })
                  }

                  return filtered
                }}
                noOptionsText="No Contacts"
                selectOnFocus
                getOptionLabel={(option) => option.name}
                handleHomeEndKeys
              />

              <TextField
                rows={11}
                label="Add Message"
                value={form.message}
                onChange={({ target }) =>
                  setForm((prev) => ({ ...prev, message: target.value }))
                }
                multiline
              />
            </Stack>

            {data && (
              <Property
                {...data}
                sx={{ maxWidth: { md: "26rem" }, pointerEvents: "none" }}
                orgId={orgId}
                agentId={agentId as string}
              />
            )}
          </Stack>

          <LoadingButton
            sx={{
              mt: 5,
              px: 8,
              float: "right",
            }}
            onClick={submit}
            loading={isSharing}
          >
            Send
          </LoadingButton>
        </Paper>
      </Modal>
      <Dialog
        sx={{
          "& .MuiPaper-root": {
            width: { xs: "calc(100vw - 16px)", md: 400 },
          },
        }}
        open={modalOpen}
        onClose={() => setModalOpen(false)}
      >
        <CreateContactForm
          orgId={orgId}
          contactName={newContactName}
          contactCreated={async (c: IContact) => {
            setModalOpen(false)
            await refetch()
            setForm({ ...form, contact: c })
          }}
        />
      </Dialog>
    </>
  )
}
