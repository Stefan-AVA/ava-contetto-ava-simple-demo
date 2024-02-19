import { Stack, Typography } from "@mui/material"

export default function RootRoomsPage() {
  return (
    <Stack
      sx={{
        width: "100%",
        height: "100%",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Typography sx={{ color: "gray.500" }} variant="body2">
        Create a group or start a conversation with someone
      </Typography>
    </Stack>
  )
}
