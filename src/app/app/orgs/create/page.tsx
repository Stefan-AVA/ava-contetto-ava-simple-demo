import Link from "next/link"
import { Box, Stack, Typography } from "@mui/material"
import { ChevronLeft } from "lucide-react"

import OrgInfo from "../[id]/org-info"

const CreateOrgPage = () => {
  return (
    <Stack
      sx={{
        p: 2.5,
        mx: "auto",
        maxWidth: "32rem",
      }}
    >
      <Stack
        sx={{
          gap: 1,
          alignItems: "center",
          flexDirection: "row",
        }}
      >
        <Box
          sx={{
            color: "gray.400",
            transition: "all .3s ease-in-out",

            ":hover": {
              color: "cyan.500",
            },
          }}
          href="/app/orgs"
          component={Link}
        >
          <ChevronLeft size={20} />
        </Box>

        <Typography
          sx={{ color: "blue.800", fontWeight: 500 }}
          variant="h4"
          component="h1"
        >
          Organization Create
        </Typography>
      </Stack>

      <OrgInfo isCreate />
    </Stack>
  )
}

export default CreateOrgPage
