import Image from "next/image"
import { Box, Stack, Typography } from "@mui/material"
import { format } from "date-fns"
import { User } from "lucide-react"

const messages = [
  {
    userId: "1",
    avatar: null,
    message: "What is the update regarding new client?",
    username: "Yuri Martins",
    sendedAt: new Date().toISOString(),
  },
  {
    userId: "2",
    avatar: null,
    message: "Yes, I am also waiting.",
    username: "Jane Doe",
    sendedAt: new Date().toISOString(),
  },
  {
    userId: "3",
    avatar: null,
    message: "Let me send reminder to the client.",
    username: "John Doe",
    sendedAt: new Date().toISOString(),
  },
  {
    userId: "2",
    avatar: null,
    message: "Share the file with me @Mark",
    username: "Jane Doe",
    sendedAt: new Date().toISOString(),
  },
  {
    userId: "2",
    avatar: null,
    message: "Jane we have a meeting at 3PM today.",
    username: "Jane Doe",
    sendedAt: new Date().toISOString(),
  },
]

export default function ListMessages() {
  const type = "CHANNEL"
  const currentUserId = "1"

  const roomChannel = type === "CHANNEL"

  return (
    <Stack
      sx={{
        pt: 5,
        px: 5,
        gap: 1.5,
        height: "calc(100vh - 25.5rem)",
        overflowY: "auto",
      }}
    >
      {messages.map(
        ({ userId, avatar, message, username, sendedAt }, index) => {
          const currentUser = userId === currentUserId

          return (
            <Stack
              sx={{
                ml: currentUser ? "auto" : 0,
                gap: 1.5,
                width: "fit-content",
                flexDirection: "row",
              }}
              key={index}
            >
              {!currentUser && roomChannel && (
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
                      component={User}
                      strokeWidth={3}
                    />
                  )}
                </Stack>
              )}

              <Stack sx={{ gap: 0.5 }}>
                <Stack
                  sx={{
                    py: 1.5,
                    px: 2,
                    gap: 0.25,
                    borderRadius: ".75rem",
                    backgroundColor: currentUser
                      ? "secondary.main"
                      : "gray.200",
                    borderTopLeftRadius: !currentUser ? 0 : ".75rem",
                    borderBottomRightRadius: currentUser ? 0 : ".75rem",
                  }}
                >
                  {!currentUser && (
                    <Typography sx={{ fontWeight: 600 }} variant="caption">
                      {username}
                    </Typography>
                  )}

                  <Typography
                    sx={{
                      color: currentUser ? "white" : "gray.700",
                      lineHeight: "1.25rem",
                    }}
                    variant="body2"
                  >
                    {message}
                  </Typography>
                </Stack>

                <Typography
                  sx={{
                    color: "gray.600",
                    textAlign: currentUser ? "right" : "left",
                  }}
                  variant="caption"
                >
                  {format(new Date(sendedAt), "HH:mm aa")}
                </Typography>
              </Stack>
            </Stack>
          )
        }
      )}
    </Stack>
  )
}
