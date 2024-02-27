import { useEffect, useState } from "react"
import { useLazySearchPropertiesByAddressQuery } from "@/redux/apis/search"
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Autocomplete,
  Button,
  CircularProgress,
  InputAdornment,
  ListItem,
  ListItemText,
  Stack,
  TextField,
  Typography,
} from "@mui/material"
import { ChevronDown, ChevronRight } from "lucide-react"

import type { IListing } from "@/types/listing.types"
import useDebounce from "@/hooks/use-debounce"

interface SearchFieldProps {
  orgId: string
  isResponsive?: boolean
}

export default function SearchField({ orgId, isResponsive }: SearchFieldProps) {
  const [show, setShow] = useState(false)
  const [search, setSearch] = useState("")
  const [property, setProperty] = useState<IListing | null>(null)
  const [searchedProperties, setSearchedProperties] = useState<IListing[]>([])

  const debounce = useDebounce(search)

  const [searchProperties, { isLoading: isLoadingSearchProperties }] =
    useLazySearchPropertiesByAddressQuery()

  useEffect(() => {
    if (debounce) {
      searchProperties({
        orgId,
        address: debounce,
      })
        .unwrap()
        .then((response) => {
          setSearchedProperties(response)

          setShow(true)
        })
    }
  }, [debounce, orgId, searchProperties])

  return (
    <>
      <Stack
        sx={{
          px: 4,
          py: isResponsive ? 2 : 4,
          bgcolor: "white",
          borderBottom: "1px solid",
          borderBottomColor: isResponsive ? "gray.300" : "gray.200",
        }}
      >
        <Accordion defaultExpanded={!isResponsive}>
          <AccordionSummary expandIcon={<ChevronDown />}>
            <Typography variant="h6">
              Populate template with listing data
            </Typography>
          </AccordionSummary>

          <AccordionDetails sx={{ px: 0 }}>
            <Autocomplete
              open={show}
              value={property}
              onOpen={() => setShow(true)}
              loading={isLoadingSearchProperties}
              onClose={() => setShow(false)}
              options={searchedProperties}
              onChange={(_, newValue) => setProperty(newValue)}
              fullWidth
              inputValue={search}
              clearOnBlur
              renderInput={(params) => (
                <TextField
                  {...params}
                  size="small"
                  label="Search Address or MLS"
                  InputProps={{
                    ...params.InputProps,
                    endAdornment: (
                      <InputAdornment position="end">
                        <Button
                          sx={{
                            p: 1,
                            top: ".35rem",
                            right: ".35rem",
                            width: "2rem",
                            height: "2rem",
                            minWidth: "2rem",
                            position: "absolute",
                          }}
                        >
                          {isLoadingSearchProperties ? (
                            <CircularProgress size="1.25rem" />
                          ) : (
                            <ChevronRight />
                          )}
                        </Button>
                      </InputAdornment>
                    ),
                  }}
                />
              )}
              renderOption={({ key, ...props }: any, option) => (
                <ListItem key={option._id} {...props}>
                  <ListItemText
                    primary={option.UnparsedAddress}
                    secondary={option.City}
                  />
                </ListItem>
              )}
              onInputChange={(_, newValue) => setSearch(newValue)}
              noOptionsText="No Messages"
              selectOnFocus
              getOptionLabel={(option) => option.UnparsedAddress}
              handleHomeEndKeys
              isOptionEqualToValue={(option) => !!option._id}
            />
          </AccordionDetails>
        </Accordion>
      </Stack>
    </>
  )
}
