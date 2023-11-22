"use client"

import { useState } from "react"
import { LoadingButton } from "@mui/lab"
import {
  Box,
  Button,
  Card,
  FormControl,
  FormControlLabel,
  FormLabel,
  Radio,
  RadioGroup,
  Stack,
  TextField,
  Typography,
} from "@mui/material"
import { Save } from "lucide-react"

import DropDown from "@/components/DropDown"

interface IError {
  searchName?: string
  request?: string
}

const SearchFrom = () => {
  const [open, setOpen] = useState(false)
  const [form, setFrom] = useState({
    searchName: "",
    contactId: undefined,
    savedForAgent: true,
  })
  const [errors, setErrors] = useState<IError>({})

  const onClose = () => {
    setFrom({
      searchName: "",
      contactId: undefined,
      savedForAgent: false,
    })
    setErrors({})
    setOpen(false)
  }

  const onChange = (name: string, value: any) => {
    setFrom((prev) => ({ ...prev, [name]: value }))
  }

  return (
    <DropDown
      open={open}
      onClose={onClose}
      ancher={
        <button>
          <Box
            sx={{
              color: "cyan.500",
              transition: "all .3s ease-in-out",

              ":hover": {
                color: "cyan.600",
              },
            }}
            size={20}
            component={Save}
            onClick={() => setOpen(true)}
          />
        </button>
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
          <RadioGroup
            row
            defaultValue={form.savedForAgent}
            sx={{
              mt: 1,
							justifyContent: 'space-between'
            }}
						onChange={(e) => console.log(e.target)}
          >
            <FormControlLabel
              value={form.savedForAgent}
              control={<Radio />}
              label="For me"
            />
            <FormControlLabel
              value={!form.savedForAgent}
              control={<Radio />}
              label="For contact"
            />
          </RadioGroup>
          <Stack direction="row" spacing={1} width="100%" marginTop={3}>
            <Button
              variant="outlined"
              sx={{ width: "100%", height: 44 }}
              onClick={onClose}
            >
              Cancel
            </Button>
            <LoadingButton sx={{ width: "100%", height: 44 }}>
              Save
            </LoadingButton>
          </Stack>
        </Stack>
      </Card>
    </DropDown>
  )
}

export default SearchFrom
