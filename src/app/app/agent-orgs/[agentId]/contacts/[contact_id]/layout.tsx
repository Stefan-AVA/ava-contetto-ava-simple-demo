"use client"

import { useMemo, type PropsWithChildren } from "react"
import { Route } from "next"
import Link from "next/link"
import { useParams, usePathname } from "next/navigation"
import { useGetContactQuery, useShareContactMutation } from "@/redux/apis/org"
import { RootState } from "@/redux/store"
import { nameInitials } from "@/utils/format-name"
import { LoadingButton } from "@mui/lab"
import { Avatar, Box, Stack, Switch, Typography } from "@mui/material"
import { Mail } from "lucide-react"
import { useSnackbar } from "notistack"
import { useSelector } from "react-redux"

import Loading from "@/components/Loading"

import DeleteContact from "./delete-contact"
import EditContact from "./edit-contact"

export default function ContactLayout({ children }: PropsWithChildren) {
  const { agentId, contact_id: contactId } = useParams()

  const pathname = usePathname()

  const agentOrgs = useSelector((state: RootState) => state.app.agentOrgs)

  const { enqueueSnackbar } = useSnackbar()

  const agentProfile = useMemo(
    () => agentOrgs.find((agent) => agent._id === agentId),
    [agentId, agentOrgs]
  )

  const basePath = `/app/agent-orgs/${agentId}/contacts/${contactId}` as Route

  const { data, isLoading } = useGetContactQuery(
    {
      _id: contactId as string,
      orgId: agentProfile?.orgId,
    },
    {
      skip: !contactId || !agentProfile,
    }
  )

  const [shareContact, { isLoading: isLoadingShareContact }] =
    useShareContactMutation({})

  async function share() {
    const response = await shareContact({
      _id: contactId as string,
      orgId: agentProfile?.orgId,
    }).unwrap()

    navigator.clipboard.writeText(response.link)

    enqueueSnackbar("Link copied successfully", { variant: "success" })
  }

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
            top: 0,
            width: "100%",
            height: "fit-content",
            border: "1px solid",
            position: "sticky",
            maxWidth: "23.75rem",
            alignItems: "center",
            borderColor: "gray.300",
            borderRadius: ".625rem",
          }}
        >
          {isLoading && <Loading />}

          {data && !isLoading && (
            <>
              <Avatar sx={{ width: "6.25rem", height: "6.25rem" }}>
                {nameInitials(data.name)}
              </Avatar>

              <Typography
                sx={{ mt: 3, textAlign: "center", fontWeight: 700 }}
                variant="h5"
              >
                {data.name}
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
                  Email not provided
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

              <EditContact
                orgId={String(agentProfile?.orgId)}
                contactId={contactId as string}
              />

              <DeleteContact
                orgId={String(agentProfile?.orgId)}
                agentId={agentId as string}
                contactId={contactId as string}
              />

              <LoadingButton
                sx={{ mt: 4 }}
                variant="outlined"
                onClick={share}
                loading={isLoadingShareContact}
                fullWidth
              >
                Copy Link Share
              </LoadingButton>
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
          <Stack
            sx={{
              p: 3,
              color: "gray.600",
              fontWeight: 700,
              alignItems: "center",
              borderBottom: "1px solid",
              flexDirection: "row",
              justifyContent: "space-between",
              borderBottomColor: "gray.300",
            }}
          >
            <Typography
              sx={{
                color: pathname === basePath ? "purple.500" : "gray.600",
                fontWeight: 700,
              }}
              href={basePath}
              component={Link}
            >
              Notes
            </Typography>

            <Typography
              sx={{
                color: pathname.includes(`${basePath}/saved-searches`)
                  ? "purple.500"
                  : "gray.600",
                fontWeight: 700,
              }}
              href={`${basePath}/saved-searches` as Route}
              component={Link}
            >
              Saved Searches
            </Typography>

            <Typography
              sx={{
                color:
                  pathname === `${basePath}/all-activities`
                    ? "purple.500"
                    : "gray.600",
                fontWeight: 700,
              }}
              href={`${basePath}/all-activities` as Route}
              component={Link}
            >
              All Activities
            </Typography>
          </Stack>

          <Stack sx={{ p: 3 }}>{children}</Stack>
        </Stack>
      </Stack>
    </Stack>
  )
}
