import type { MouseEventHandler } from "react"
import Image from "next/image"
import { Badge, Box, Stack, Typography } from "@mui/material"
import { format } from "date-fns"
import { User, type LucideIcon } from "lucide-react"

interface IRoomFieldProps {
  icon?: LucideIcon
  title: string
  avatar?: string
  onClick?: MouseEventHandler<HTMLDivElement>
  sendedAt?: string
  lastMessage?: string
  unreadMessages?: number
  numberOfMembers?: number
}

export default function RoomField({
  icon: Icon = User,
  title,
  avatar,
  onClick,
  sendedAt,
  lastMessage,
  unreadMessages,
  numberOfMembers,
}: IRoomFieldProps) {
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
      <Badge color="secondary" badgeContent={unreadMessages}>
        <Stack
          sx={{
            width: "2.25rem",
            height: "2.25rem",
            border: "2px solid",
            position: "relative",
            alignItems: "center",
            borderColor: unreadMessages ? "secondary.main" : "gray.200",
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
      </Badge>

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

      {sendedAt && (
        <Typography
          sx={{
            ml: "auto",
            color: "gray.500",
            textAlign: "right",
            whiteSpace: "nowrap",
          }}
          variant="caption"
        >
          {format(new Date(sendedAt), "HH:mm aa")}
        </Typography>
      )}
    </Stack>
  )
}
