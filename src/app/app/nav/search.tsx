import { Autocomplete, TextField } from "@mui/material"

export default function Search() {
  return (
    <Autocomplete
      id="searchbox"
      sx={{ maxWidth: "18.5rem" }}
      options={[]}
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
