import { CircularProgress, Stack, type StackProps } from "@mui/material"

const Loading = ({ sx }: StackProps) => {
  return (
    <Stack sx={{ p: 5, alignItems: "center", justifyContent: "center", ...sx }}>
      <CircularProgress size="1.25rem" />
    </Stack>
  )
}

export default Loading
