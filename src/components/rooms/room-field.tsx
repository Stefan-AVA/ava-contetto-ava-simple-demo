import { MouseEventHandler } from "react"
import { Route } from "next"
import Image from "next/image"
import { useParams } from "next/navigation"
import { Box, Stack, Typography } from "@mui/material"
import { format } from "date-fns"
import { User, type LucideIcon } from "lucide-react"

interface IRoomFieldProps {
  id: string
  icon?: LucideIcon
  title: string
  avatar?: string
  sendedAt?: string
  lastMessage?: string
  unreadMessages?: number
  numberOfMembers?: number
  onClick?: MouseEventHandler<HTMLDivElement>
}

export default function RoomField({
  id,
  icon: Icon = User,
  title,
  avatar,
  sendedAt,
  lastMessage,
  unreadMessages,
  numberOfMembers,
  onClick,
}: IRoomFieldProps) {
  const { agentId } = useParams()

  return (
    <Stack
      sx={{
        gap: 1,
        cursor: "pointer",
        alignItems: "center",
        flexDirection: "row",
      }}
      onClick={onClick}
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
        {avatar && (
          <Image
            src={avatar}
            alt=""
            fill
            style={{ objectFit: "cover", borderRadius: "50%" }}
          />
        )}

        {!avatar && (
          <Box
            sx={{ color: "gray.500" }}
            size={16}
            component={Icon}
            strokeWidth={3}
          />
        )}
      </Stack>

      <Stack sx={{ gap: 0.25, overflow: "hidden" }}>
        <Typography
          sx={{ color: "gray.700", fontWeight: 600 }}
          className="truncate"
        >
          {title}
        </Typography>

        <Typography
          sx={{ color: "gray.500", fontWeight: 500, lineHeight: ".875rem" }}
          variant="body2"
          className="truncate"
        >
          {lastMessage}

          {numberOfMembers
            ? `${String(numberOfMembers).padStart(2, "0")} member${
                numberOfMembers !== 1 ? "s" : ""
              }`
            : ""}
        </Typography>
      </Stack>

      {(sendedAt || unreadMessages) && (
        <Stack sx={{ ml: "auto", gap: 0.25, alignItems: "flex-end" }}>
          {sendedAt && (
            <Typography
              sx={{
                color: "gray.500",
                textAlign: "right",
                whiteSpace: "nowrap",
              }}
              variant="caption"
            >
              {format(new Date(sendedAt), "HH:mm aa")}
            </Typography>
          )}

          {unreadMessages && (
            <Stack
              sx={{
                width: "1.25rem",
                height: "1.25rem",
                alignItems: "center",
                borderRadius: "50%",
                justifyContent: "center",
                backgroundColor: "red.700",
              }}
            >
              <Typography
                sx={{ color: "white", textAlign: "center", fontWeight: 500 }}
                variant="caption"
              >
                {unreadMessages}
              </Typography>
            </Stack>
          )}
        </Stack>
      )}
    </Stack>
  )
}
