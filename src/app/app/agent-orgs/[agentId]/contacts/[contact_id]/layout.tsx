"use client"

import { useEffect, useMemo, useState, type PropsWithChildren } from "react"
import { Route } from "next"
import Link from "next/link"
import { useParams, usePathname } from "next/navigation"
import {
  useGetContactQuery,
  useShareContactMutation,
  useUpdateContactMutation,
} from "@/redux/apis/org"
import { RootState } from "@/redux/store"
import toBase64 from "@/utils/toBase64"
import { LoadingButton } from "@mui/lab"
import { Box, Stack, Switch, TextField, Typography } from "@mui/material"
import { Mail, User2 } from "lucide-react"
import { MuiTelInput } from "mui-tel-input"
import { useSnackbar } from "notistack"
import { useSelector } from "react-redux"

import Avatar from "@/components/Avatar"
import Loading from "@/components/Loading"

import DeleteContact from "./delete-contact"

interface IForm {
  name: string
  email: string
  phone: string
  image: string
  imageFileType?: string
}

interface IError {
  name?: string
  request?: string
}

export default function ContactLayout({ children }: PropsWithChildren) {
  const { agentId, contact_id: contactId } = useParams()
  const [form, setForm] = useState<IForm>({
    name: "",
    email: "",
    phone: "",
    image: "",
    imageFileType: undefined,
  })
  const [errors, setErrors] = useState<IError>({})

  const pathname = usePathname()

  const agentOrgs = useSelector((state: RootState) => state.app.agentOrgs)

  const { enqueueSnackbar } = useSnackbar()

  const agentProfile = useMemo(
    () => agentOrgs.find((agent) => agent._id === agentId),
    [agentId, agentOrgs]
  )

  const basePath = `/app/agent-orgs/${agentId}/contacts/${contactId}` as Route

  const { data: contact, isLoading } = useGetContactQuery(
    {
      _id: contactId as string,
      orgId: agentProfile?.orgId,
    },
    {
      skip: !contactId || !agentProfile,
    }
  )

  const [updateContact, { isLoading: isContactUpdating }] =
    useUpdateContactMutation()

  useEffect(() => {
    if (contact) {
      setForm({
        name: contact.name,
        email: contact.email || "",
        phone: contact.phone || "",
        image: contact.image || "",
        imageFileType: undefined,
      })
    }
  }, [contact])

  const [shareContact, { isLoading: isLoadingShareContact }] =
    useShareContactMutation({})

  const onChange = (name: string, value: any) => {
    setErrors({})
    setForm((prev) => ({ ...prev, [name]: value }))
  }

  const onAvatarFileChange = async (file: File) => {
    const base64 = await toBase64(file)

    setForm((prev) => ({
      ...prev,
      image: String(base64),
      imageFileType: file.type,
    }))
  }

  const onAvatarDelete = () => {
    setForm((prev) => ({
      ...prev,
      image: contact?.image || "",
      imageFileType: undefined,
    }))
  }

  const isValidated = () => {
    const errs: IError = {}
    if (!form.name) errs.name = "This field is required"

    setErrors(errs)

    return Object.keys(errs).length === 0
  }

  const onUpdate = async () => {
    setErrors({})

    if (!isValidated()) return

    try {
      await updateContact({
        ...form,
        orgId: String(agentProfile?.orgId),
        _id: String(contact?._id),
        phone: form.phone.replace(" ", ""),
      })

      enqueueSnackbar("Successfully updated", { variant: "success" })
    } catch (error) {}
  }

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
          flexDirection: {
            xs: "column",
            lg: "row",
          },
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
            position: {
              xs: "inherit",
              lg: "sticky",
            },
            maxWidth: {
              xs: "100%",
              lg: "23.75rem",
            },
            alignItems: "center",
            borderColor: "gray.300",
            borderRadius: ".625rem",
          }}
        >
          {isLoading && <Loading />}

          {contact && !isLoading && (
            <>
              <Avatar
                name={contact.name}
                image={form.image}
                editable
                onChange={onAvatarFileChange}
                onCancel={onAvatarDelete}
              />

              <Typography
                sx={{ mt: 3, textAlign: "center", fontWeight: 700 }}
                variant="h5"
              >
                {contact.name}
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

              <Stack spacing={2} width="100%" mt={2}>
                <TextField
                  label="Contact Name"
                  value={form.name}
                  error={!!errors?.name}
                  onChange={({ target }) => onChange("name", target.value)}
                  helperText={errors?.name}
                  fullWidth
                />
                <TextField
                  label="Email"
                  value={form.email}
                  onChange={({ target }) => onChange("email", target.value)}
                  fullWidth
                />
                <MuiTelInput
                  sx={{ my: 3, bgcolor: "white" }}
                  label="Phone Number"
                  defaultCountry="CA"
                  value={form.phone}
                  onChange={(value) => onChange("phone", value)}
                />
              </Stack>

              <Stack direction="row" spacing={2} width="100%" mt={2}>
                <LoadingButton
                  fullWidth
                  onClick={onUpdate}
                  loading={isContactUpdating}
                >
                  Update
                </LoadingButton>
                <DeleteContact
                  orgId={String(agentProfile?.orgId)}
                  agentId={agentId as string}
                  contactId={contactId as string}
                />
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
                USER DETAILS
              </Typography>

              {!contact.username ? (
                <>
                  <Typography sx={{ color: "gray.800", mt: 2 }}>
                    No user assigned
                  </Typography>
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
              ) : (
                <>
                  <Stack
                    sx={{
                      mr: "auto",
                      mt: 2.5,
                      gap: 2,
                      alignItems: "center",
                      flexDirection: "row",
                    }}
                  >
                    <Box
                      sx={{ color: "purple.500" }}
                      size={20}
                      component={User2}
                    />

                    <Typography sx={{ color: "gray.800" }}>
                      {contact.username || "Username not provided"}
                    </Typography>
                  </Stack>

                  <Stack
                    sx={{
                      mr: "auto",
                      mt: 1.5,
                      gap: 2,
                      alignItems: "center",
                      flexDirection: "row",
                    }}
                  >
                    <Box
                      sx={{ color: "purple.500" }}
                      size={20}
                      component={Mail}
                    />

                    <Typography sx={{ color: "gray.800" }}>
                      {contact.userEmail || "Email not provided"}
                    </Typography>
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
                      App Access
                    </Typography>

                    <Switch />
                  </Stack>
                </>
              )}
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
                color: pathname === basePath ? "secondary.main" : "gray.500",
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
                  ? "secondary.main"
                  : "gray.500",
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
                    ? "secondary.main"
                    : "gray.500",
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
