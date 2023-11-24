import { useState, type FormEvent } from "react"
import { useCreateContactMutation } from "@/redux/apis/org"
import { parseError } from "@/utils/error"
import formatErrorZodMessage from "@/utils/format-error-zod"
import { LoadingButton } from "@mui/lab"
import { Stack, TextField, Typography } from "@mui/material"
import { useSnackbar } from "notistack"
import { z } from "zod"

const schemaContact = z.object({
  name: z.string().min(1, "Enter the name"),
  note: z.string().optional(),
})

type FormContactSchema = z.infer<typeof schemaContact>

type FormError = FormContactSchema & {
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
  const [form, setForm] = useState<FormContactSchema>({
    name: contactName || "",
    note: "",
  })
  const [errors, setErrors] = useState<FormError | null>(null)

  const { enqueueSnackbar } = useSnackbar()

  const [create, { isLoading: isLoadingContact }] = useCreateContactMutation()

  function close() {
    setForm({
      name: "",
      note: "",
    })
    if (contactCreated) contactCreated()
  }

  async function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()

    setErrors(null)

    const response = schemaContact.safeParse(form)

    if (!response.success) {
      const error = formatErrorZodMessage<FormContactSchema>(response.error)

      setErrors(error)

      return
    }

    try {
      await create({
        name: form.name,
        note: form.note,
        orgId,
      }).unwrap()

      enqueueSnackbar("Successfully created", { variant: "success" })

      close()
    } catch (error) {
      setErrors(
        (prev) => ({ ...prev, request: parseError(error) }) as FormError
      )
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

      <Stack sx={{ p: 4, width: "100%" }} onSubmit={submit} component="form">
        <TextField
          sx={{ mb: 2 }}
          label="Name"
          error={!!errors?.name}
          value={form.name}
          onChange={({ target }) =>
            setForm((prev) => ({ ...prev, name: target.value }))
          }
          helperText={errors?.name}
        />

        <TextField
          label="Notes"
          rows={5}
          error={!!errors?.note}
          value={form.note}
          onChange={({ target }) =>
            setForm((prev) => ({ ...prev, note: target.value }))
          }
          multiline
          helperText={errors?.note}
        />

        <LoadingButton
          sx={{ mt: 4.5 }}
          type="submit"
          loading={isLoadingContact}
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
