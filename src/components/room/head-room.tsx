import { useEffect, useState } from "react"
import {
  useLazyLoadSearchedMessagesQuery,
  useLazySearchMessagesQuery,
} from "@/redux/apis/message"
import type { RootState } from "@/redux/store"
import delay from "@/utils/delay"
import { nameInitials, nameToColor } from "@/utils/format-name"
import {
  Autocomplete,
  Avatar,
  AvatarGroup,
  Box,
  CircularProgress,
  InputAdornment,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Stack,
  TextField,
  Typography,
} from "@mui/material"
import { Lock, Pencil, User } from "lucide-react"
import { useSelector } from "react-redux"

import type { IMessage } from "@/types/message.types"
import { RoomType, type IRoom } from "@/types/room.types"
import useDebounce from "@/hooks/use-debounce"

import AddMembersToRoom from "./add-members-to-room"

interface HeadRoomProps {
  room: IRoom
}

export default function HeadRoom({ room }: HeadRoomProps) {
  const [search, setSearch] = useState("")
  const [showAutocomplete, setShowAutocomplete] = useState(false)
  const [selectedMessages, setSelectedMessages] = useState<IMessage | null>(
    null
  )
  const [searchedMessages, setSearchedMessages] = useState<IMessage[]>([])
  const [showDialogMembers, setShowDialogMembers] = useState(false)

  const debounce = useDebounce(search)

  const user = useSelector((state: RootState) => state.app.user)

  const [searchMessages, { isLoading: isLoadingSearchMessages }] =
    useLazySearchMessagesQuery()
  const [loadSearchedMessages] = useLazyLoadSearchedMessagesQuery()

  const isChannel = room.type === RoomType.channel

  useEffect(() => {
    if (debounce) {
      searchMessages({
        orgId: room.orgId as string,
        roomId: room._id as string,
        search: debounce,
      })
        .unwrap()
        .then((message) => {
          setSearchedMessages(message)

          setShowAutocomplete(true)
        })
    }
  }, [debounce, room._id, room.orgId, searchMessages])

  async function onLoadSearchedMessages(message: IMessage | null) {
    setSelectedMessages(message)

    if (!message) return

    await loadSearchedMessages({
      orgId: room.orgId as string,
      roomId: room._id as string,
      messageId: message._id,
    }).unwrap()

    await delay()

    const currMessage = document.getElementById(`message-${message._id}`)
    const listMessages = document.getElementById("messages-list")

    if (listMessages && currMessage) {
      const { top, height } = currMessage.getBoundingClientRect()

      listMessages.scrollTo({
        top: top - height - 124,
        behavior: "smooth",
      })
    }
  }

  return (
    <Stack
      sx={{
        px: { xs: 2, md: 5 },
        py: 2.5,
        gap: 2,
        height: "5rem",
        alignItems: "center",
        borderBottom: "1px solid",
        flexDirection: "row",
        borderBottomColor: "gray.300",
      }}
    >
      <Stack
        sx={{
          width: "2.25rem",
          height: "2.25rem",
          position: "relative",
          alignItems: "center",
          aspectRatio: 1 / 1,
          borderRadius: "50%",
          justifyContent: "center",
          backgroundColor: "gray.200",
        }}
      >
        <Box
          sx={{ color: "gray.500" }}
          size={16}
          component={isChannel ? Lock : User}
          strokeWidth={3}
        />
      </Stack>

      <Typography sx={{ color: "gray.700", fontWeight: 600 }} variant="h5">
        {isChannel ? "Group: " : ""}
        {room
          ? room.type === RoomType.channel
            ? room.name
            : [
                ...room.agents.map((a) => a.username),
                ...room.contacts.map((c) => c.username || c.name),
              ]
                .filter((u) => u !== user?.username)
                .join(", ")
          : ""}
      </Typography>

      {room && isChannel && (
        <Stack sx={{ ml: "auto", alignItems: "center", flexDirection: "row" }}>
          <Typography
            sx={{
              mr: 1,
              color: "gray.500",
              display: { xs: "none", md: "flex" },
              fontWeight: 600,
            }}
          >
            {room.usernames.length.toString().padStart(2, "0")} member
            {room.usernames.length !== 1 ? "s" : ""}
          </Typography>

          <AvatarGroup sx={{ display: { xs: "none", md: "flex" } }} max={4}>
            {room.usernames.map((username) => (
              <Avatar sx={{ bgcolor: nameToColor(username) }} key={username}>
                {nameInitials(username)}
              </Avatar>
            ))}

            <Avatar
              sx={{ cursor: "pointer" }}
              onClick={() => setShowDialogMembers(true)}
            >
              <Pencil size={20} />
            </Avatar>
          </AvatarGroup>
        </Stack>
      )}

      <Autocomplete
        sx={{
          ml: "auto",
          maxWidth: "240px",
        }}
        open={showAutocomplete}
        value={selectedMessages}
        onOpen={() => setShowAutocomplete(true)}
        loading={isLoadingSearchMessages}
        onClose={() => setShowAutocomplete(false)}
        options={searchedMessages}
        onChange={(_, newValue) => onLoadSearchedMessages(newValue)}
        fullWidth
        inputValue={search}
        clearOnBlur
        renderInput={(params) => (
          <TextField
            {...params}
            size="small"
            label="Search message"
            InputProps={{
              ...params.InputProps,
              endAdornment: (
                <InputAdornment position="end">
                  {isLoadingSearchMessages ? (
                    <CircularProgress size="1.25rem" />
                  ) : null}
                  {params.InputProps.endAdornment}
                </InputAdornment>
              ),
            }}
          />
        )}
        renderOption={({ key, ...props }: any, option) => (
          <ListItem key={option._id} {...props}>
            <ListItemAvatar>
              <Avatar alt={option.senderName}>
                {nameInitials(option.senderName)}
              </Avatar>
            </ListItemAvatar>

            <ListItemText
              primary={option.msg ?? "-"}
              secondary={option.senderName}
            />
          </ListItem>
        )}
        onInputChange={(_, newValue) => setSearch(newValue)}
        noOptionsText="No Messages"
        selectOnFocus
        getOptionLabel={(option) => option.msg ?? option.senderName}
        handleHomeEndKeys
        isOptionEqualToValue={(option) => !!option._id}
      />

      <AddMembersToRoom
        show={showDialogMembers}
        room={room as IRoom}
        onClose={() => setShowDialogMembers(false)}
      />
    </Stack>
  )
}
