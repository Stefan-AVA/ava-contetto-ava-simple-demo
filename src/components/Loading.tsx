import { CircularProgress, Stack } from "@mui/material"

const Loading = () => {
  return (
    <Stack sx={{ p: 5, alignItems: "center", justifyContent: "center" }}>
      <CircularProgress size="1.25rem" />
    </Stack>
  )
}

export default Loading
