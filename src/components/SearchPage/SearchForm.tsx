"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useSaveSearchMutation } from "@/redux/apis/search"
import { parseError } from "@/utils/error"
import { LoadingButton } from "@mui/lab"
import {
  Box,
  Button,
  Card,
  FormHelperText,
  Stack,
  TextField,
  Typography,
} from "@mui/material"
import { Save, User } from "lucide-react"
import { useSnackbar } from "notistack"

import { IContact } from "@/types/contact.types"
import { ISearchResult } from "@/types/searchResult.types"
import DropDown from "@/components/drop-down"

import ContactSearch from "../ContactSearch"

interface IError {
  searchName?: string
  request?: string
}

interface ISearchForm {
  searchResult?: ISearchResult
  orgId: string
  agentId?: string
  contactId?: string
}

const SearchForm = ({
  searchResult,
  orgId,
  agentId,
  contactId,
}: ISearchForm) => {
  const { push } = useRouter()
  const { enqueueSnackbar } = useSnackbar()

  const [open, setOpen] = useState(false)
  const [form, setFrom] = useState({
    searchName: "",
  })
  const [errors, setErrors] = useState<IError>({})
  const [contact, setContact] = useState<IContact | null>(null)

  const [saveSearch, { isLoading }] = useSaveSearchMutation()

  const onClose = () => {
    setFrom({
      searchName: "",
    })
    setErrors({})
    setOpen(false)
    setContact(null)
  }

  const onChange = (name: string, value: any) => {
    setErrors({})
    setFrom((prev) => ({ ...prev, [name]: value }))
  }

  const isValidated = () => {
    const errs: IError = {}
    if (!form.searchName) errs.searchName = "This field required"
    if (!searchResult?._id) errs.request = "No search result"

    setErrors(errs)
    return Object.keys(errs).length === 0
  }

  const onSubmit = async () => {
    setErrors({})
    if (!isValidated()) return

    try {
      await saveSearch({
        searchId: String(searchResult?._id),
        orgId,
        searchName: form.searchName,
        contactId: contact?._id,
      }).unwrap()
      enqueueSnackbar("Successfully saved", { variant: "success" })
      onClose()

      // navigate to the result page
      if (agentId) {
        push(`/app/agent-orgs/${agentId}/search-results/${searchResult?._id}`)
      } else if (contactId) {
        push(
          `/app/contact-orgs/${contactId}/search-results/${searchResult?._id}`
        )
      }
    } catch (error) {
      console.log("save search error ===>", error)
      setErrors((prev) => ({ ...prev, request: parseError(error) }))
      enqueueSnackbar("Failed!", { variant: "error" })
    }
  }

  return (
    <DropDown
      open={open}
      onClose={onClose}
      ancher={
        <Box
          sx={{
            color: "primary.main",
            transition: "all .3s ease-in-out",

            ":hover": {
              color: "primary.dark",
              cursor: "pointer",
            },
          }}
          size={20}
          component={Save}
          onClick={() => setOpen(true)}
        />
      }
      anchorOrigin={{
        vertical: "bottom",
        horizontal: "right",
      }}
      transformOrigin={{
        vertical: "top",
        horizontal: "right",
      }}
    >
      <Card sx={{ padding: 2 }}>
        <Stack width={250}>
          <Typography variant="body1">Save search results</Typography>
          <TextField
            sx={{ marginTop: 2 }}
            type="text"
            label="Name"
            error={!!errors?.searchName}
            onChange={({ target }) => onChange("searchName", target.value)}
            helperText={errors?.searchName}
          />
          {!!agentId && (
            <Stack sx={{ mt: 2 }} spacing={2} direction="row">
              <Typography>Save For:</Typography>

              <ContactSearch
                orgId={orgId}
                ancher={
                  <Stack
                    sx={{
                      padding: 0,
                      height: "unset",
                      ":hover": { cursor: "pointer" },
                    }}
                    direction="row"
                    spacing={1}
                    alignItems="center"
                    variant="text"
                    component={LoadingButton}
                  >
                    <User size={20} />
                    <Typography
                      variant="body2"
                      sx={{
                        width: 90,
                        overflow: "hidden",
                        whiteSpace: "nowrap",
                        textOverflow: "ellipsis",
                        textAlign: "start",
                      }}
                    >
                      {contact ? contact.name : "For me"}
                    </Typography>
                  </Stack>
                }
                onContactChanged={(contact: IContact) => setContact(contact)}
              />
            </Stack>
          )}
          <Stack direction="row" spacing={1} width="100%" marginTop={3}>
            <Button
              variant="outlined"
              sx={{ width: "100%", height: 44 }}
              onClick={onClose}
            >
              Cancel
            </Button>
            <LoadingButton
              sx={{ width: "100%", height: 44 }}
              onClick={onSubmit}
              loading={isLoading}
            >
              Save
            </LoadingButton>
          </Stack>
          {errors.request && (
            <FormHelperText sx={{ mt: 1, ml: 2 }} error>
              {errors.request}
            </FormHelperText>
          )}
        </Stack>
      </Card>
    </DropDown>
  )
}

export default SearchForm
