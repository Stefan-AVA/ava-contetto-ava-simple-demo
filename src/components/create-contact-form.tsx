import { useState, type FormEvent } from "react"
import { useCreateContactMutation } from "@/redux/apis/org"
import { parseError } from "@/utils/error"
import toBase64 from "@/utils/toBase64"
import { LoadingButton } from "@mui/lab"
import { Stack, TextField, Typography } from "@mui/material"
import { MuiTelInput } from "mui-tel-input"
import { useSnackbar } from "notistack"

import Avatar from "./Avatar"

interface IForm {
  name: string
  email: string
  phone: string
  note: string
  image: string
  imageFileType?: string
}

interface IError {
  name?: string
  request?: string
}

interface CreateContactFormProps {
  orgId: string
  contactName?: string
  contactCreated?: Function
}

export default function CreateContactForm({
  orgId,
  contactName,
  contactCreated,
}: CreateContactFormProps) {
  const [form, setForm] = useState<IForm>({
    name: contactName || "",
    email: "",
    phone: "",
    note: "",
    image: "",
    imageFileType: undefined,
  })
  const [errors, setErrors] = useState<IError>({})

  const { enqueueSnackbar } = useSnackbar()

  const [create, { isLoading: isLoadingContact }] = useCreateContactMutation()

  function close() {
    setForm({
      name: "",
      email: "",
      phone: "",
      note: "",
      image: "",
      imageFileType: undefined,
    })
    if (contactCreated) contactCreated()
  }

  const onChange = (name: string, value: any) => {
    setErrors({})
    setForm((prev) => ({ ...prev, [name]: value }))
  }

  const isValidated = () => {
    const errs: IError = {}
    if (!form.name) errs.name = "This field is required"

    setErrors(errs)

    return Object.keys(errs).length === 0
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
      image: "",
      imageFileType: undefined,
    }))
  }

  const submit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    setErrors({})

    if (!isValidated()) return

    try {
      await create({
        ...form,
        orgId,
      }).unwrap()

      enqueueSnackbar("Successfully created", { variant: "success" })

      close()
    } catch (error) {
      setErrors((prev) => ({ ...prev, request: parseError(error) }))
    }
  }

  return (
    <>
      <Typography
        sx={{
          py: 3,
          px: 4,
          fontWeight: 700,
          borderBottom: "1px solid",
          borderBottomColor: "gray.300",
        }}
        variant="h5"
      >
        {"Create Client's Contact"}
      </Typography>

      <Stack
        sx={{ p: 4, width: "100%" }}
        onSubmit={submit}
        component="form"
        alignItems="center"
      >
        <Avatar
          image={form.image}
          editable
          onChange={onAvatarFileChange}
          onCancel={onAvatarDelete}
          width={200}
          height={200}
        />

        <TextField
          sx={{ mb: 2, mt: 2 }}
          label="Name"
          error={!!errors?.name}
          value={form.name}
          onChange={({ target }) =>
            setForm((prev) => ({ ...prev, name: target.value }))
          }
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
          fullWidth
        />

        <TextField
          label="Notes"
          rows={5}
          value={form.note}
          onChange={({ target }) =>
            setForm((prev) => ({ ...prev, note: target.value }))
          }
          multiline
          fullWidth
        />

        <LoadingButton
          sx={{ mt: 4.5 }}
          type="submit"
          loading={isLoadingContact}
          fullWidth
        >
          Create Contact
        </LoadingButton>

        {errors && errors.request && (
          <Typography
            sx={{ mt: 1.5, color: "red.500", textAlign: "center" }}
            variant="body2"
          >
            {errors.request}
          </Typography>
        )}
      </Stack>
    </>
  )
}
