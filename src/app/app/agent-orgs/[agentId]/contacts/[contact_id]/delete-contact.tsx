import { useState } from "react"
import { Route } from "next"
import { useRouter } from "next/navigation"
import { useDeleteContactMutation } from "@/redux/apis/org"
import { parseError } from "@/utils/error"
import { LoadingButton } from "@mui/lab"
import { Button, Card, Stack, Typography } from "@mui/material"
import { useSnackbar } from "notistack"

import Dropdown from "@/components/drop-down"

type IPage = {
  orgId: string
  agentId: string
  contactId: string
}

export default function DeleteContact({ orgId, agentId, contactId }: IPage) {
  const [open, setOpen] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const { push } = useRouter()

  const { enqueueSnackbar } = useSnackbar()

  const [remove, { isLoading }] = useDeleteContactMutation()

  async function submit() {
    setError(null)

    try {
      await remove({
        _id: contactId,
        orgId,
      }).unwrap()

      setOpen(false)

      enqueueSnackbar("Contact deleted successfully", { variant: "success" })

      push(`/app/agent-orgs/${agentId}/contacts` as Route)
    } catch (error) {
      setError(parseError(error))
    }
  }

  return (
    <Dropdown
      sx={{ width: "100%" }}
      open={open}
      ancher={
        <Button
          sx={{ bgcolor: "red.500", ":hover": { bgcolor: "red.300" } }}
          fullWidth
          onClick={() => setOpen(true)}
        >
          Delete
        </Button>
      }
      onClose={() => setOpen(false)}
      anchorOrigin={{
        vertical: "bottom",
        horizontal: "right",
      }}
      transformOrigin={{
        vertical: "top",
        horizontal: "right",
      }}
    >
      <Card sx={{ width: "20rem" }}>
        <Stack sx={{ p: 2, width: "100%" }}>
          <Typography sx={{ color: "gray.600" }}>
            Do you want to delete this contact? This action cannot be undone
          </Typography>

          <Stack
            sx={{
              mt: 2,
              ml: "auto",
              gap: 2,
              alignItems: "center",
              flexDirection: "row",
            }}
          >
            <Button variant="text" onClick={() => setOpen(false)}>
              Cancel
            </Button>

            <LoadingButton color="error" loading={isLoading} onClick={submit}>
              Delete
            </LoadingButton>
          </Stack>

          {error && error && (
            <Typography
              sx={{ mt: 1.5, color: "red.500", textAlign: "center" }}
              variant="body2"
            >
              {error}
            </Typography>
          )}
        </Stack>
      </Card>
    </Dropdown>
  )
}
