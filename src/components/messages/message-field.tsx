import { Box, Stack, Typography } from "@mui/material"
import { format } from "date-fns"
import type { LucideIcon } from "lucide-react"

interface MessageFieldProps {
  icon?: LucideIcon
  title: string
  avatar?: string
  sendedAt?: string
  onNavigate: () => void
  lastMessage?: string
  unreadMessages?: number
  numberOfMembers?: number
}

export default function MessageField({
  icon: Icon,
  title,
  avatar,
  sendedAt,
  onNavigate,
  lastMessage,
  unreadMessages,
  numberOfMembers,
}: MessageFieldProps) {
  return (
    <Stack
      sx={{
        gap: 1,
        cursor: "pointer",
        alignItems: "center",
        flexDirection: "row",
      }}
      onClick={onNavigate}
    >
      <Stack
        sx={{
          width: "2.25rem",
          height: "2.25rem",
          alignItems: "center",
          aspectRatio: 1 / 1,
          borderRadius: "50%",
          justifyContent: "center",
          backgroundColor: "gray.200",
        }}
      >
        {Icon && (
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
        <Stack sx={{ ml: "auto", alignItems: "flex-end" }}>
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
