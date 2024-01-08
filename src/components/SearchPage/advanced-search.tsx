import {
  useEffect,
  useState,
  type Dispatch,
  type PropsWithChildren,
  type SetStateAction,
} from "react"
import { useLazySearchCitiesQuery } from "@/redux/apis/city"
import formatMoney from "@/utils/format-money"
import {
  Autocomplete,
  CircularProgress,
  InputAdornment,
  ListItem,
  ListItemText,
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
  city: null as ICity | null,
  rooms: 0,
  price: [100000, 5000000] as number[],
  range: "10",
  storeys: "",
  bathrooms: 0,
  yearBuilt: [null, null] as Array<Date | null>,
  firePlaces: 0,
  listedSince: null as Date | null,
  parkingSpaces: 0,
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

  console.log({ form })

  return (
    <Modal open={open} onClose={() => onClose(false)}>
      <Paper
        sx={{
          p: 4,
          top: "50%",
          left: "50%",
          width: "100%",
          maxWidth: "54rem",
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
          <Stack
            sx={{
              mt: 4,
              gap: 2,
              alignItems: "center",
              flexDirection: "row",
            }}
          >
            <TextField
              size="small"
              label="Min Price"
              value={form.price[0]}
              onChange={({ target }) =>
                setForm((prev) => ({
                  ...prev,
                  price: [Number(target.value), form.price[1]],
                }))
              }
              fullWidth
              InputProps={{ type: "number" }}
            />

            <TextField
              size="small"
              label="Max Price"
              value={form.price[1]}
              onChange={({ target }) =>
                setForm((prev) => ({
                  ...prev,
                  price: [form.price[0], Number(target.value)],
                }))
              }
              fullWidth
              InputProps={{ type: "number" }}
            />
          </Stack>

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
                gap: 2,
                alignItems: "center",
                flexDirection: "row",
              }}
            >
              <DatePicker
                label="Any year"
                value={form.yearBuilt[0]}
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

              <DatePicker
                label="Any year"
                value={form.yearBuilt[1]}
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
      </Paper>
    </Modal>
  )
}
