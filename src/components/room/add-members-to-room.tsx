import { useMemo, useState } from "react"
import { useParams } from "next/navigation"
import {
  useAddMemberToChannelMutation,
  useRemoveMemberFromRoomMutation,
} from "@/redux/apis/room"
import { type RootState } from "@/redux/store"
import { parseError } from "@/utils/error"
import { nameInitials } from "@/utils/format-name"
import { LoadingButton } from "@mui/lab"
import {
  Avatar,
  CircularProgress,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Modal,
  Paper,
  Stack,
  Typography,
} from "@mui/material"
import { X } from "lucide-react"
import { useSnackbar } from "notistack"
import { useSelector } from "react-redux"

import type { IRoom, IRoomAgent, IRoomContact } from "@/types/room.types"
import SearchMembers, {
  type SearchMemberOption,
} from "@/components/rooms/search-members"

type RemoveMemberParams = {
  agent?: IRoomAgent
  contact?: IRoomContact
}

interface AddMembersToRoomProps {
  show: boolean
  room: IRoom
  onClose: () => void
}

export default function AddMembersToRoom({
  show,
  room,
  onClose,
}: AddMembersToRoomProps) {
  const [users, setUsers] = useState<SearchMemberOption[]>([])
  const [error, setError] = useState<string | null>(null)
  const [isLoadingRemoveMember, setIsLoadingRemoveMember] = useState<
    string | null
  >(null)

  const { roomId, agentId } = useParams()

  const user = useSelector((state: RootState) => state.app.user)
  const agentOrgs = useSelector((state: RootState) => state.app.agentOrgs)

  const agentProfile = useMemo(
    () => agentOrgs.find((agent) => agent._id === agentId),
    [agentId, agentOrgs]
  )

  const { enqueueSnackbar } = useSnackbar()

  const [create, { isLoading }] = useAddMemberToChannelMutation()
  const [removeMember] = useRemoveMemberFromRoomMutation()

  async function onSubmit() {
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
          name: contact.name as string,
          agentId: contact.agentId as string,
          username: contact.label,
          agentName: contact.agentName as string,
        }))

      await create({
        orgId: agentProfile?.orgId as string,
        agents,
        roomId: roomId as string,
        contacts,
      }).unwrap()

      onClose()

      setUsers([])

      enqueueSnackbar("Successfully invited users", { variant: "success" })
    } catch (error) {
      setError(parseError(error))
    }
  }

  async function onRemoveMember({ agent, contact }: RemoveMemberParams) {
    setIsLoadingRemoveMember(agent?._id ?? contact?._id ?? null)

    removeMember({
      agent,
      orgId: room.orgId,
      roomId: room._id,
      contact,
    })
      .unwrap()
      .then(() =>
        enqueueSnackbar("Member deleted successfully", { variant: "success" })
      )
      .catch(() =>
        enqueueSnackbar(
          "An error occurred while trying to remove the member. Try again!",
          { variant: "error" }
        )
      )
      .finally(() => setIsLoadingRemoveMember(null))
  }

  const members = useMemo(() => {
    const agents = room.agents
      ? room.agents.map((agent) => ({
          ...agent,
          type: "AGENT",
          name: agent.username,
        }))
      : []

    const contacts = room.contacts
      ? room.contacts.map((contact) => ({
          ...contact,
          type: "CONTACT",
          name: contact.username ?? contact.name,
        }))
      : []

    return [...agents, ...contacts]
  }, [room.agents, room.contacts])

  return (
    <Modal open={show} onClose={onClose}>
      <Paper
        sx={{
          p: 4,
          top: "50%",
          left: "50%",
          width: "100%",
          maxWidth: "42rem",
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
            Group: {room.name ?? ""}
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
            onClick={onClose}
            component="button"
          >
            <X strokeWidth={3} />
          </Stack>
        </Stack>

        <Stack
          sx={{
            mt: 3,
            gap: 3,
          }}
        >
          {!room.isPublic && (
            <SearchMembers
              value={users}
              orgId={String(agentProfile?.orgId)}
              onChange={setUsers}
            />
          )}

          <List>
            {members.map((member) => (
              <ListItem
                sx={{
                  transition: "all .3s ease-in-out",
                  borderRadius: ".5rem",

                  ".remove-button": {
                    display: "none",
                  },

                  ":hover": {
                    bgcolor: "gray.200",

                    ".remove-button": {
                      display: "flex",
                    },
                  },
                }}
                key={member._id}
              >
                <ListItemAvatar>
                  <Avatar alt={member.name}>{nameInitials(member.name)}</Avatar>
                </ListItemAvatar>

                <ListItemText
                  sx={{
                    textTransform: "capitalize",
                  }}
                  primary={member.name}
                  secondary={member.type.toLowerCase()}
                />

                {!room.isPublic && user?.username !== member.username && (
                  <Typography
                    sx={{
                      gap: 1,
                      color: "gray.500",
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                    }}
                    variant="body2"
                    onClick={() =>
                      onRemoveMember({
                        agent:
                          member.type === "AGENT"
                            ? (member as IRoomAgent)
                            : undefined,
                        contact:
                          member.type === "CONTACT"
                            ? (member as IRoomContact)
                            : undefined,
                      })
                    }
                    className="remove-button"
                  >
                    Remove
                    {isLoadingRemoveMember === member._id && (
                      <CircularProgress size="1rem" />
                    )}
                  </Typography>
                )}
              </ListItem>
            ))}
          </List>

          {!room.isPublic && (
            <LoadingButton
              sx={{ ml: "auto" }}
              onClick={onSubmit}
              loading={isLoading}
            >
              Save
            </LoadingButton>
          )}
        </Stack>

        {error && (
          <Typography
            sx={{ mt: 1.5, color: "red.500", textAlign: "center" }}
            variant="body2"
          >
            {error}
          </Typography>
        )}
      </Paper>
    </Modal>
  )
}
