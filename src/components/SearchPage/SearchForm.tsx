"use client"

import { useState } from "react"
import { useSaveSearchMutation } from "@/redux/apis/search"
import { parseError } from "@/utils/error"
import { LoadingButton } from "@mui/lab"
import {
  Box,
  Button,
  Card,
  FormControlLabel,
  FormHelperText,
  Radio,
  RadioGroup,
  Stack,
  TextField,
  Typography,
} from "@mui/material"
import { Save } from "lucide-react"
import { useSnackbar } from "notistack"

import { ISearchResult } from "@/types/searchResult.types"
import DropDown from "@/components/drop-down"

interface IError {
  searchName?: string
  request?: string
}

interface ISearchForm {
  searchResult?: ISearchResult
  orgId: string
  isAgent: boolean
}

const SearchForm = ({ searchResult, orgId, isAgent }: ISearchForm) => {
  const { enqueueSnackbar } = useSnackbar()

  const [open, setOpen] = useState(false)
  const [form, setFrom] = useState({
    contactId: undefined,
    searchName: "",
    savedForAgent: true,
  })
  const [errors, setErrors] = useState<IError>({})

  const [saveSearch, { isLoading }] = useSaveSearchMutation()

  const onClose = () => {
    setFrom({
      searchName: "",
      contactId: undefined,
      savedForAgent: true,
    })
    setErrors({})
    setOpen(false)
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
        contactId: form.contactId,
      }).unwrap()
      enqueueSnackbar("Successfully saved", { variant: "success" })
      onClose()
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
            color: "cyan.500",
            transition: "all .3s ease-in-out",

            ":hover": {
              color: "cyan.600",
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

          {isAgent && (
            <>
              <RadioGroup
                row
                value={form.savedForAgent}
                sx={{
                  mt: 1,
                  justifyContent: "space-between",
                }}
                onChange={({ target }) =>
                  setFrom((prev) => ({
                    ...prev,
                    savedForAgent: target.value === "true",
                  }))
                }
              >
                <FormControlLabel
                  value={true}
                  control={<Radio />}
                  label="For me"
                />
                <FormControlLabel
                  value={false}
                  control={<Radio />}
                  label="For contact"
                />
              </RadioGroup>
            </>
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
