import { ReactNode, useCallback, useState } from "react"
import { useGetContactsQuery } from "@/redux/apis/org"
import { nameInitials } from "@/utils/format-name"
import {
  Autocomplete,
  Avatar,
  Box,
  Card,
  CircularProgress,
  Dialog,
  IconButton,
  InputAdornment,
  ListItem,
  ListItemAvatar,
  ListItemText,
  TextField,
} from "@mui/material"
import { Search } from "lucide-react"

import { IContact } from "@/types/contact.types"
import Dropdown from "@/components/drop-down"

import CreateContactForm from "./create-contact-form"

interface CreateContactProps {
  orgId: string
  ancher?: ReactNode
  onContactChanged?: Function
}

interface IOption extends Partial<IContact> {
  _id: string
  name: string
  inputValue?: string
}

const ContactSearch = ({
  orgId,
  onContactChanged,
  ancher,
}: CreateContactProps) => {
  const [open, setOpen] = useState(false)
  const [contact, setContact] = useState<IOption | null>(null)

  const [modalOpen, setModalOpen] = useState(false)
  const [newContactName, setNewContactname] = useState("")

  const {
    data: contacts = [],
    isLoading,
    isFetching,
    refetch,
  } = useGetContactsQuery({
    orgId,
  })
  const loading = isLoading || isFetching

  const SearchContactsAutoComplete = useCallback(
    () => (
      <Autocomplete
        sx={{ width: "18.5rem" }}
        value={contact}
        loading={loading}
        options={contacts as IOption[]}
        onChange={(_, newValue) => {
          if (newValue?.inputValue) {
            setTimeout(() => {
              setNewContactname(String(newValue.inputValue))
              setOpen(false)
              setModalOpen(true)
              setContact(null)
            })
          } else {
            setTimeout(() => {
              setOpen(false)
              setNewContactname("")

              if (onContactChanged && newValue) {
                setContact(null)
                onContactChanged(newValue)
              }
            })
          }
        }}
        fullWidth
        clearOnBlur
        renderInput={(params) => (
          <TextField
            {...params}
            size="small"
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
                <Avatar alt={option.name}>{nameInitials(option.name)}</Avatar>
              </ListItemAvatar>
            )}

            <ListItemText>{option.name}</ListItemText>
          </ListItem>
        )}
        noOptionsText="No Contacts"
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
        selectOnFocus
        getOptionLabel={(option) => option.name}
        handleHomeEndKeys
      />
    ),
    [loading, contact, contacts, onContactChanged]
  )

  return (
    <>
      <Box sx={{ display: { xs: "none", md: "flex" } }}>
        <SearchContactsAutoComplete />
      </Box>

      <Dropdown
        sx={{ display: { xs: "flex", md: "none" } }}
        open={open}
        ancher={
          <Box
            onClick={(e) => {
              if (e.preventDefault) e.preventDefault()
              if (e.stopPropagation) e.stopPropagation()

              setOpen(true)
            }}
          >
            {ancher || (
              <IconButton
                sx={{
                  padding: 1,
                  background: "white",
                  color: "black",
                  ":hover": {
                    background: "white",
                  },
                }}
              >
                <Search />
              </IconButton>
            )}
          </Box>
        }
        onClose={() => setOpen(false)}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "right",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
      >
        <Card
          sx={{ p: 2, overflow: "hidden" }}
          onClick={(e) => {
            if (e.preventDefault) e.preventDefault()
            if (e.stopPropagation) e.stopPropagation()
          }}
        >
          <SearchContactsAutoComplete />
        </Card>
      </Dropdown>

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
          contactCreated={() => {
            setModalOpen(false)
            refetch()
          }}
        />
      </Dialog>
    </>
  )
}

export default ContactSearch
