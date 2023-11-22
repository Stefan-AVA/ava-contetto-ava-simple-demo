import { Autocomplete, TextField } from "@mui/material"

export default function Search() {
  return (
    <Autocomplete
      id="searchbox"
      sx={{ maxWidth: "18.5rem" }}
      options={[
        { label: "Client 1", value: "client-1" },
        { label: "Client 2", value: "client-2" },
      ]}
      freeSolo
      fullWidth
      renderInput={(params) => (
        <TextField
          {...params}
          label="Quick Contact Access"
          size="small"
          InputProps={{
            ...params.InputProps,
            type: "search",
          }}
        />
      )}
      disableClearable
    />
  )
}
