"use client"

import { useMemo, type PropsWithChildren } from "react"
import { useParams } from "next/navigation"
import { useGetContactQuery } from "@/redux/apis/org"
import { RootState } from "@/redux/store"
import { Avatar, Box, Button, Stack, Switch, Typography } from "@mui/material"
import { ChevronRight, Mail } from "lucide-react"
import { useSelector } from "react-redux"

import Loading from "@/components/Loading"

export default function ContactLayout({ children }: PropsWithChildren) {
  const { agentId, contact_id: contactId } = useParams()

  const agentOrgs = useSelector((state: RootState) => state.app.agentOrgs)

  const agentProfile = useMemo(
    () => agentOrgs.find((agent) => agent._id === agentId),
    [agentId, agentOrgs]
  )

  const { data, isLoading } = useGetContactQuery(
    {
      _id: contactId as string,
      orgId: agentProfile?.orgId,
    },
    {
      skip: !contactId || !agentProfile,
    }
  )

  return (
    <Stack>
      <Typography
        sx={{
          pb: 3,
          mb: 4,
          fontWeight: 700,
          borderBottom: "1px solid",
          borderBottomColor: "gray.300",
        }}
        variant="h4"
      >
        Contact
      </Typography>

      <Stack
        sx={{
          gap: 2.5,
          flexDirection: "row",
        }}
      >
        <Stack
          sx={{
            pt: 6,
            px: 3,
            pb: 3,
            width: "100%",
            border: "1px solid",
            maxWidth: "23.75rem",
            alignItems: "center",
            borderColor: "gray.300",
            borderRadius: ".625rem",
          }}
        >
          {isLoading && <Loading />}

          {!isLoading && (
            <>
              <Avatar sx={{ width: "6.25rem", height: "6.25rem" }}>YU</Avatar>

              <Typography
                sx={{ mt: 3, textAlign: "center", fontWeight: 700 }}
                variant="h5"
              >
                Yuri Martins
              </Typography>

              <Typography
                sx={{
                  pt: 3,
                  mt: 3,
                  width: "100%",
                  color: "gray.500",
                  borderTop: "1px solid",
                  borderTopColor: "gray.300",
                }}
                variant="body2"
              >
                CONTACT DETAILS
              </Typography>

              <Stack
                sx={{
                  mr: "auto",
                  mt: 2.5,
                  gap: 2,
                  alignItems: "center",
                  flexDirection: "row",
                }}
              >
                <Box sx={{ color: "purple.500" }} size={20} component={Mail} />

                <Typography sx={{ color: "gray.800" }}>
                  develop@yumartins.com.br
                </Typography>
              </Stack>

              <Typography
                sx={{
                  pt: 3,
                  mt: 3,
                  width: "100%",
                  color: "gray.500",
                  borderTop: "1px solid",
                  borderTopColor: "gray.300",
                }}
                variant="body2"
              >
                CONTACT SETTINGS
              </Typography>

              <Stack
                sx={{
                  mt: 2.5,
                  gap: 2,
                  width: "100%",
                  alignItems: "center",
                  flexDirection: "row",
                  justifyContent: "space-between",
                }}
              >
                <Typography sx={{ color: "gray.800" }}>App Access</Typography>

                <Switch />
              </Stack>

              <Stack
                sx={{
                  mt: 2.5,
                  gap: 2,
                  width: "100%",
                  alignItems: "center",
                  flexDirection: "row",
                  justifyContent: "space-between",
                }}
              >
                <Typography sx={{ color: "gray.800" }}>Edit Contact</Typography>

                <ChevronRight size={20} />
              </Stack>

              <Stack
                sx={{
                  mt: 2.5,
                  gap: 2,
                  width: "100%",
                  alignItems: "center",
                  flexDirection: "row",
                  justifyContent: "space-between",
                }}
              >
                <Typography sx={{ color: "gray.800" }}>
                  Delete Contact
                </Typography>

                <ChevronRight size={20} />
              </Stack>

              <Button sx={{ mt: 4 }} variant="outlined" fullWidth>
                Copy Link Invite
              </Button>
            </>
          )}
        </Stack>

        <Stack
          sx={{
            width: "100%",
            border: "1px solid",
            borderColor: "gray.300",
            borderRadius: ".625rem",
          }}
        >
          {children}
        </Stack>
      </Stack>
    </Stack>
  )
}
