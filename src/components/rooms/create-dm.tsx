import { useMemo, useState } from "react"
import { useParams } from "next/navigation"
import { useCreateDMMutation } from "@/redux/apis/room"
import { type RootState } from "@/redux/store"
import { parseError } from "@/utils/error"
import { LoadingButton } from "@mui/lab"
import { Stack, Typography } from "@mui/material"
import { Plus } from "lucide-react"
import { useSnackbar } from "notistack"
import { useSelector } from "react-redux"

import Dropdown from "../drop-down"
import SearchMembers, { type SearchMemberOption } from "./search-members"

export default function CreateDM() {
  const [open, setOpen] = useState(false)
  const [users, setUsers] = useState<SearchMemberOption[]>([])
  const [error, setError] = useState<string | null>(null)

  const { agentId } = useParams()

  const agentOrgs = useSelector((state: RootState) => state.app.agentOrgs)

  const agentProfile = useMemo(
    () => agentOrgs.find((agent) => agent._id === agentId),
    [agentId, agentOrgs]
  )

  const { enqueueSnackbar } = useSnackbar()

  const [create, { isLoading }] = useCreateDMMutation()

  async function submit() {
    setError(null)

    try {
      const agents = users
        .filter(({ type }) => type === "Agents")
        .map((agent) => ({
          _id: agent.value,
          username: agent.label,
        }))

      const contacts = users
        .filter(({ type }) => type === "Contacts")
        .map((contact) => ({
          _id: contact.value,
          agentId: contact.agentId as string,
          username: contact.label,
          agentName: contact.agentName as string,
        }))

      await create({
        orgId: agentProfile?.orgId as string,
        agents,
        contacts,
      }).unwrap()

      setOpen(false)

      enqueueSnackbar("DM created successfully", { variant: "success" })
    } catch (error) {
      setError(parseError(error))
    }
  }

  return (
    <Dropdown
      open={open}
      ancher={
        <Typography
          sx={{
            mt: 2,
            gap: 0.5,
            width: "100%",
            color: "secondary.main",
            display: "flex",
            alignItems: "center",
            fontWeight: 600,
          }}
          onClick={() => setOpen(true)}
          disabled={isLoading}
          component="button"
        >
          <Plus size={20} />
          Create DM
        </Typography>
      }
      onClose={() => setOpen(false)}
    >
      <Stack sx={{ p: 2, width: "23rem" }}>
        <SearchMembers
          value={users}
          orgId={String(agentProfile?.orgId)}
          onChange={setUsers}
        />

        <LoadingButton
          sx={{ mt: 2, ml: "auto" }}
          onClick={submit}
          loading={isLoading}
          fullWidth
        >
          Create DM
        </LoadingButton>

        {error && (
          <Typography
            sx={{ mt: 1.5, color: "red.500", textAlign: "center" }}
            variant="body2"
          >
            {error}
          </Typography>
        )}
      </Stack>
    </Dropdown>
  )
}
