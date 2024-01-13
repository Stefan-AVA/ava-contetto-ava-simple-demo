import {
  MouseEventHandler,
  type Dispatch,
  type PropsWithChildren,
  type SetStateAction,
} from "react"
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

import { ICity } from "@/types/city.types"

import { initialForm } from "."
import TextFieldWithOperators from "../text-field-with-operators"

interface BoxFieldProps extends PropsWithChildren {
  label: string
}

interface AdvancedSearchProps {
  open: boolean
  form: typeof initialForm
  cities: ICity[]
  onClose: () => void
  setForm: Dispatch<SetStateAction<typeof initialForm>>
  onSearch: MouseEventHandler<HTMLButtonElement> | undefined
  isSearching: boolean
  nearestCities: ICity[]
  setSearchCityInput: Dispatch<SetStateAction<string>>
  debouncedSearchCity: string
  isLoadingSearchCities: boolean
  isLoadingGetNearestCities: boolean
}

function BoxField({ label, children }: BoxFieldProps) {
  return (
    <Stack sx={{ gap: 1, flex: 1 }}>
      <Typography sx={{ fontWeight: 700 }}>{label}</Typography>

      {children}
    </Stack>
  )
}

export default function AdvancedSearch({
  open,
  onClose,
  form,
  setForm,
  isLoadingGetNearestCities,
  nearestCities,
  setSearchCityInput,
  debouncedSearchCity,
  cities,
  isLoadingSearchCities,
  onSearch,
  isSearching,
}: AdvancedSearchProps) {
  return (
    <Modal open={open} onClose={onClose}>
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
            onClick={() => onClose()}
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
              value={form.range ?? ""}
              onChange={({ target }) =>
                setForm((prev) => ({
                  ...prev,
                  range: target.value,
                }))
              }
              fullWidth
              InputProps={{ type: "number" }}
            />
          </BoxField>

          <BoxField label="MLS">
            <TextField
              size="small"
              label="MLS"
              value={form.mls ?? ""}
              onChange={({ target }) =>
                setForm((prev) => ({ ...prev, mls: target.value }))
              }
              fullWidth
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
              marks={[
                { label: "100k", value: 100000 },
                { label: "300k", value: 300000 },
                { label: "1.25M", value: 1250000 },
                { label: "2M+", value: 2000000 },
              ]}
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
            <TextFieldWithOperators
              value={form.rooms}
              onChange={(props) =>
                setForm((prev) => ({
                  ...prev,
                  rooms: props,
                }))
              }
            />
          </BoxField>

          <BoxField label="Bathrooms">
            <TextFieldWithOperators
              value={form.bathrooms}
              onChange={(props) =>
                setForm((prev) => ({
                  ...prev,
                  bathrooms: props,
                }))
              }
            />
          </BoxField>

          <BoxField label="Storeys">
            <TextFieldWithOperators
              value={form.storeys}
              onChange={(props) =>
                setForm((prev) => ({
                  ...prev,
                  storeys: props,
                }))
              }
            />
          </BoxField>

          <BoxField label="Parking Spaces">
            <TextFieldWithOperators
              value={form.parkingSpaces}
              onChange={(props) =>
                setForm((prev) => ({
                  ...prev,
                  parkingSpaces: props,
                }))
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
                value={form.minYearBuilt}
                views={["year"]}
                maxDate={new Date()}
                onChange={(value) =>
                  setForm((prev) => ({
                    ...prev,
                    minYearBuilt: value,
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
                value={form.maxYearBuilt}
                views={["year"]}
                maxDate={new Date()}
                onChange={(value) =>
                  setForm((prev) => ({
                    ...prev,
                    maxYearBuilt: value,
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
            <TextFieldWithOperators
              value={form.firePlaces}
              onChange={(props) =>
                setForm((prev) => ({
                  ...prev,
                  firePlaces: props,
                }))
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
          <BoxField label="SqFt">
            <Slider
              min={initialForm.sqFt[0]}
              max={initialForm.sqFt[1]}
              value={form.sqFt}
              marks={[
                { label: "0", value: 0 },
                { label: "2000", value: 2000 },
                { label: "6000", value: 6000 },
                { label: "10000+", value: 10000 },
              ]}
              onChange={(_, value) =>
                setForm((prev) => ({ ...prev, sqFt: value as number[] }))
              }
              getAriaValueText={(value) => formatMoney(value)}
              valueLabelFormat={(value) => formatMoney(value)}
              valueLabelDisplay="auto"
            />
          </BoxField>

          <BoxField label="Lot Acres">
            <Slider
              min={initialForm.lotAcres[0]}
              max={initialForm.lotAcres[1]}
              value={form.lotAcres}
              marks={[
                { label: "0", value: 0 },
                { label: "15", value: 15 },
                { label: "30", value: 30 },
                { label: "50+", value: 50 },
              ]}
              onChange={(_, value) =>
                setForm((prev) => ({ ...prev, lotAcres: value as number[] }))
              }
              getAriaValueText={(value) => `${value} acres`}
              valueLabelFormat={(value) => `${value} acres`}
              valueLabelDisplay="auto"
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
                setForm((prev) => ({
                  ...prev,
                  propertyType:
                    typeof target.value === "string"
                      ? target.value.split(",")
                      : target.value,
                }))
              }
              fullWidth
              SelectProps={{ multiple: true }}
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
                setForm((prev) => ({
                  ...prev,
                  walkingDistance:
                    typeof target.value === "string"
                      ? target.value.split(",")
                      : target.value,
                }))
              }
              fullWidth
              SelectProps={{ multiple: true }}
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

        <LoadingButton
          sx={{ mt: 4, float: "right" }}
          onClick={onSearch}
          loading={isSearching}
        >
          Search
        </LoadingButton>
      </Paper>
    </Modal>
  )
}
