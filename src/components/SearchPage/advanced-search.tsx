import {
  useEffect,
  useState,
  type Dispatch,
  type PropsWithChildren,
  type SetStateAction,
} from "react"
import { useLazySearchCitiesQuery } from "@/redux/apis/city"
import formatMoney from "@/utils/format-money"
import { LoadingButton } from "@mui/lab"
import {
  Autocomplete,
  CircularProgress,
  InputAdornment,
  ListItem,
  ListItemText,
  MenuItem,
  Modal,
  Paper,
  Slider,
  Stack,
  TextField,
  Typography,
} from "@mui/material"
import { DatePicker } from "@mui/x-date-pickers/DatePicker"
import { X } from "lucide-react"

import type { ICity } from "@/types/city.types"
import useDebounce from "@/hooks/use-debounce"
import useListCitiesByLocation from "@/hooks/use-list-cities-by-location"

import NumberInput from "../number-input"

interface BoxFieldProps extends PropsWithChildren {
  label: string
}

interface AdvancedSearchProps {
  open: boolean
  onClose: Dispatch<SetStateAction<boolean>>
}

const initialForm = {
  mls: "",
  sqFt: 0,
  city: null as ICity | null,
  rooms: 0,
  price: [100000, 2000000] as number[],
  range: "10",
  title: "",
  storeys: 0,
  lotAcres: 0,
  keywords: "",
  bathrooms: 0,
  yearBuilt: [null, null] as Array<Date | null>,
  firePlaces: 0,
  listedSince: null as Date | null,
  propertyType: "",
  parkingSpaces: 0,
  walkingDistance: "",
}

function BoxField({ label, children }: BoxFieldProps) {
  return (
    <Stack sx={{ gap: 1, flex: 1 }}>
      <Typography sx={{ fontWeight: 700 }}>{label}</Typography>

      {children}
    </Stack>
  )
}

export default function AdvancedSearch({ open, onClose }: AdvancedSearchProps) {
  const [form, setForm] = useState(initialForm)
  const [cities, setCities] = useState<ICity[]>([])
  const [searchCityInput, setSearchCityInput] = useState("")

  const [searchCities, { isFetching: isLoadingSearchCities }] =
    useLazySearchCitiesQuery()

  const { cities: nearestCities, isLoading: isLoadingGetNearestCities } =
    useListCitiesByLocation()

  const debouncedSearchCity = useDebounce(searchCityInput)

  useEffect(() => {
    if (debouncedSearchCity) {
      const fetchSearchCities = async () => {
        const cities = await searchCities({
          search: debouncedSearchCity,
        }).unwrap()

        setCities(cities)
      }

      fetchSearchCities()
    }
  }, [searchCities, debouncedSearchCity])

  useEffect(() => {
    if (nearestCities.length > 0)
      setForm((prev) => ({ ...prev, city: nearestCities[0] }))
  }, [nearestCities])

  async function submit() {
    const data = {
      ...form,
      keywords: form.keywords.split(", "),
    }

    console.log({ data })

    onClose(true)
  }

  return (
    <Modal open={open} onClose={() => onClose(false)}>
      <Paper
        sx={{
          p: 4,
          top: "50%",
          left: "50%",
          width: "100%",
          maxWidth: "59rem",
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
            Advanced search
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
            onClick={() => onClose(true)}
            component="button"
          >
            <X strokeWidth={3} />
          </Stack>
        </Stack>

        <Stack
          sx={{
            mt: 4,
            gap: 4,
            alignItems: "center",
            flexDirection: "row",
          }}
        >
          <BoxField label="City">
            <Autocomplete
              value={form.city}
              loading={isLoadingGetNearestCities}
              options={debouncedSearchCity ? cities : nearestCities}
              onChange={(_, newValue) =>
                setForm((prev) => ({ ...prev, city: newValue }))
              }
              fullWidth
              clearOnBlur
              renderInput={(params) => (
                <TextField
                  {...params}
                  size="small"
                  label="City"
                  onChange={({ target }) => setSearchCityInput(target.value)}
                  InputProps={{
                    ...params.InputProps,
                    endAdornment: (
                      <InputAdornment position="end">
                        {isLoadingSearchCities || isLoadingGetNearestCities ? (
                          <CircularProgress size="1.25rem" />
                        ) : null}

                        {params.InputProps.endAdornment}
                      </InputAdornment>
                    ),
                  }}
                />
              )}
              noOptionsText={
                isLoadingSearchCities || isLoadingGetNearestCities ? (
                  <CircularProgress size="1.25rem" />
                ) : (
                  "No Cities"
                )
              }
              selectOnFocus
              getOptionLabel={(option) =>
                `${option.city}, ${option.admin_name}`
              }
              renderOption={({ key, ...props }: any, option) => (
                <ListItem key={option._id} {...props}>
                  <ListItemText>{`${option.city}, ${option.admin_name}`}</ListItemText>
                </ListItem>
              )}
              isOptionEqualToValue={(option, value) => option._id === value._id}
              filterOptions={(options) => options}
            />
          </BoxField>

          <BoxField label="KM Radius">
            <TextField
              size="small"
              label="KM Radius"
              value={form.range}
              onChange={({ target }) =>
                setForm((prev) => ({ ...prev, range: target.value }))
              }
              fullWidth
              InputProps={{ type: "number" }}
            />
          </BoxField>

          <BoxField label="MLS">
            <TextField
              size="small"
              label="MLS"
              value={form.range}
              onChange={({ target }) =>
                setForm((prev) => ({ ...prev, mls: target.value }))
              }
              fullWidth
              InputProps={{ type: "number" }}
            />
          </BoxField>
        </Stack>

        <Stack
          sx={{
            mt: 2,
            gap: 4,
            alignItems: "center",
            flexDirection: "row",
          }}
        >
          <BoxField label="List Price">
            <Slider
              min={initialForm.price[0]}
              max={initialForm.price[1]}
              value={form.price}
              onChange={(_, value) =>
                setForm((prev) => ({ ...prev, price: value as number[] }))
              }
              getAriaValueText={(value) => formatMoney(value)}
              valueLabelFormat={(value) => formatMoney(value)}
              valueLabelDisplay="auto"
            />
          </BoxField>

          <BoxField label="Listed Since">
            <DatePicker
              label="Listed since"
              value={form.listedSince}
              onChange={(value) =>
                setForm((prev) => ({ ...prev, listedSince: value }))
              }
              slotProps={{
                textField: { size: "small", fullWidth: true },
              }}
              defaultValue={new Date()}
            />
          </BoxField>
        </Stack>

        <Stack
          sx={{
            mt: 2,
            gap: 4,
            alignItems: "center",
            flexDirection: "row",
          }}
        >
          <BoxField label="Rooms">
            <NumberInput
              value={form.rooms}
              min={0}
              onChange={(_, value) =>
                setForm((prev) => ({ ...prev, rooms: value ?? 0 }))
              }
            />
          </BoxField>

          <BoxField label="Bathrooms">
            <NumberInput
              value={form.bathrooms}
              min={0}
              onChange={(_, value) =>
                setForm((prev) => ({ ...prev, bathrooms: value ?? 0 }))
              }
            />
          </BoxField>

          <BoxField label="Parking Spaces">
            <NumberInput
              value={form.parkingSpaces}
              min={0}
              onChange={(_, value) =>
                setForm((prev) => ({ ...prev, parkingSpaces: value ?? 0 }))
              }
            />
          </BoxField>
        </Stack>

        <Stack
          sx={{
            mt: 2,
            gap: 4,
            alignItems: "center",
            flexDirection: "row",
          }}
        >
          <BoxField label="Year Built">
            <Stack
              sx={{
                gap: 1,
                alignItems: "center",
                flexDirection: "row",
              }}
            >
              <DatePicker
                label="Any year"
                value={form.yearBuilt[0]}
                views={["year"]}
                onChange={(value) =>
                  setForm((prev) => ({
                    ...prev,
                    yearBuilt: [value, form.yearBuilt[1]],
                  }))
                }
                slotProps={{
                  textField: { size: "small", fullWidth: true },
                }}
                defaultValue={new Date()}
              />

              <Typography sx={{ fontWeight: 700 }} variant="caption">
                to
              </Typography>

              <DatePicker
                label="Any year"
                value={form.yearBuilt[1]}
                views={["year"]}
                maxDate={new Date()}
                onChange={(value) =>
                  setForm((prev) => ({
                    ...prev,
                    yearBuilt: [form.yearBuilt[0], value],
                  }))
                }
                slotProps={{
                  textField: { size: "small", fullWidth: true },
                }}
                defaultValue={new Date()}
              />
            </Stack>
          </BoxField>

          <BoxField label="Fire Places">
            <NumberInput
              value={form.firePlaces}
              min={0}
              onChange={(_, value) =>
                setForm((prev) => ({ ...prev, firePlaces: value ?? 0 }))
              }
            />
          </BoxField>
        </Stack>

        <Stack
          sx={{
            mt: 2,
            gap: 4,
            alignItems: "center",
            flexDirection: "row",
          }}
        >
          <BoxField label="Storeys">
            <NumberInput
              value={form.storeys}
              min={0}
              onChange={(_, value) =>
                setForm((prev) => ({ ...prev, storeys: value ?? 0 }))
              }
            />
          </BoxField>

          <BoxField label="SqFt">
            <NumberInput
              value={form.sqFt}
              min={0}
              onChange={(_, value) =>
                setForm((prev) => ({ ...prev, sqFt: value ?? 0 }))
              }
            />
          </BoxField>

          <BoxField label="Lot Acres">
            <NumberInput
              value={form.lotAcres}
              min={0}
              onChange={(_, value) =>
                setForm((prev) => ({ ...prev, lotAcres: value ?? 0 }))
              }
            />
          </BoxField>
        </Stack>

        <Typography
          sx={{
            mt: 4,
            pt: 3,
            borderTop: "1px solid",
            borderTopColor: "gray.300",
          }}
        >
          <b>Additional Criteria:</b> choose from the drop down items or type in
          your own criteria
        </Typography>

        <Stack
          sx={{
            mt: 2,
            gap: 4,
            alignItems: "center",
            flexDirection: "row",
          }}
        >
          <BoxField label="Property Type">
            <TextField
              size="small"
              label="Property Type"
              select
              value={form.propertyType}
              onChange={({ target }) =>
                setForm((prev) => ({ ...prev, propertyType: target.value }))
              }
              fullWidth
            >
              {["Condo", "House", "Other"].map((field) => (
                <MenuItem key={field} value={field}>
                  {field}
                </MenuItem>
              ))}
            </TextField>
          </BoxField>

          <BoxField label="Walking Distance">
            <TextField
              size="small"
              label="Walking Distance"
              select
              value={form.walkingDistance}
              onChange={({ target }) =>
                setForm((prev) => ({ ...prev, walkingDistance: target.value }))
              }
            >
              {["School", "Park", "Medical Facility"].map((field) => (
                <MenuItem key={field} value={field}>
                  {field}
                </MenuItem>
              ))}
            </TextField>
          </BoxField>

          {/* <BoxField label="Title">
            <TextField
              size="small"
              label="Title"
              select
              value={form.title}
              onChange={({ target }) =>
                setForm((prev) => ({ ...prev, title: target.value }))
              }
              fullWidth
            >
              <MenuItem value="Co-Op">Co-Op</MenuItem>
            </TextField>
          </BoxField>

          <BoxField label="Lot Features">
            <TextField
              size="small"
              label="Lot Features"
              select
              value={form.lotFeatures}
              onChange={({ target }) =>
                setForm((prev) => ({ ...prev, lotFeatures: target.value }))
              }
              fullWidth
            >
              <MenuItem value="Cul-de-sac">Cul-de-sac</MenuItem>
            </TextField>
          </BoxField> */}
        </Stack>

        {/* <Stack
          sx={{
            mt: 2,
            gap: 4,
            alignItems: "center",
            flexDirection: "row",
          }}
        >
          <BoxField label="Waterfront">
            <TextField
              size="small"
              label="Waterfront"
              select
              value={form.waterfront}
              onChange={({ target }) =>
                setForm((prev) => ({ ...prev, waterfront: target.value }))
              }
              fullWidth
            >
              <MenuItem value="Lake">Lake</MenuItem>
            </TextField>
          </BoxField>

          <BoxField label="View">
            <TextField
              size="small"
              label="View"
              select
              value={form.view}
              onChange={({ target }) =>
                setForm((prev) => ({ ...prev, view: target.value }))
              }
              fullWidth
            >
              {["Mountain(s)", "Valley", "Lake", "Ocean"].map((field) => (
                <MenuItem key={field} value={field}>
                  {field}
                </MenuItem>
              ))}
            </TextField>
          </BoxField>

          <BoxField label="Condition">
            <TextField
              size="small"
              label="Condition"
              select
              value={form.condition}
              onChange={({ target }) =>
                setForm((prev) => ({ ...prev, condition: target.value }))
              }
              fullWidth
            >
              <MenuItem value="Great">Great</MenuItem>
            </TextField>
          </BoxField>
        </Stack> */}

        <Stack
          sx={{
            mt: 2,
            gap: 4,
            alignItems: "center",
            flexDirection: "row",
          }}
        >
          <BoxField label="Keywords">
            <TextField
              size="small"
              label="Comma separated keywords for Pet criteria, Flooring, Roofing, Gargage, Pool, etc."
              value={form.keywords}
              onChange={({ target }) =>
                setForm((prev) => ({ ...prev, keywords: target.value }))
              }
            />
          </BoxField>
        </Stack>

        <LoadingButton sx={{ mt: 4, float: "right" }} onClick={submit}>
          Search
        </LoadingButton>
      </Paper>
    </Modal>
  )
}
