import { useParams, useRouter } from "next/navigation"
import { useSearchContactsQuery } from "@/redux/apis/org"
import { nameInitials } from "@/utils/format-name"
import {
  Autocomplete,
  Avatar,
  CircularProgress,
  ListItemAvatar,
  ListItemButton,
  ListItemText,
  TextField,
} from "@mui/material"

interface SearchProps {
  orgId: string
}

export default function Search({ orgId }: SearchProps) {
  const { push } = useRouter()

  const { agentId } = useParams()

  const { data, isLoading, isFetching } = useSearchContactsQuery({ orgId })

  const loading = isLoading || isFetching

  const options = data
    ? data.map(({ _id, name }) => ({ value: _id, label: name }))
    : []

  return (
    <Autocomplete
      id="searchbox"
      sx={{ maxWidth: "18.5rem" }}
      onChange={(_, { value }: any) =>
        push(`/app/agent-orgs/${agentId}/contacts/${value}`)
      }
      loading={loading}
      options={options}
      freeSolo
      fullWidth
      renderOption={({ key, ...params }: any) => (
        <ListItemButton key={key} {...params}>
          <ListItemAvatar>
            <Avatar alt={key}>{nameInitials(key)}</Avatar>
          </ListItemAvatar>
          <ListItemText>{key}</ListItemText>
        </ListItemButton>
      )}
      renderInput={(params) => (
        <TextField
          {...params}
          label="Quick Contact Access"
          size="small"
          InputProps={{
            ...params.InputProps,
            type: "search",
            ...params.InputProps,
            endAdornment: (
              <>
                {loading ? <CircularProgress size="1.25rem" /> : null}
                {params.InputProps.endAdornment}
              </>
            ),
          }}
        />
      )}
      disableClearable
    />
  )
}
