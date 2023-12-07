import { useEffect, useState } from "react"
import { useGetContactQuery, useUpdateContactMutation } from "@/redux/apis/org"
import { parseError } from "@/utils/error"
import formatErrorZodMessage from "@/utils/format-error-zod"
import { LoadingButton } from "@mui/lab"
import { Card, Stack, TextField, Typography } from "@mui/material"
import { ChevronRight } from "lucide-react"
import { useSnackbar } from "notistack"
import { z } from "zod"

import Dropdown from "@/components/drop-down"

const schema = z.object({
  name: z.string().min(1, "Enter the name"),
  note: z.string().optional(),
})

const initialForm = {
  name: "",
  note: "",
}

type FormSchema = z.infer<typeof schema>

type FormError = FormSchema & {
  request?: string
}

type IPage = {
  orgId: string
  contactId: string
}

export default function EditContact({ orgId, contactId }: IPage) {
  const [open, setOpen] = useState(false)
  const [form, setForm] = useState<FormSchema>(initialForm)
  const [errors, setErrors] = useState<FormError | null>(null)

  const { enqueueSnackbar } = useSnackbar()

  const [update, { isLoading }] = useUpdateContactMutation()

  const { data } = useGetContactQuery(
    {
      _id: contactId,
      orgId,
    },
    {
      skip: !contactId || !orgId,
    }
  )

  useEffect(() => {
    if (data)
      setForm((prev) => ({ ...prev, name: data.name, note: data.notes }))
  }, [data])

  async function submit() {
    setErrors(null)

    const response = schema.safeParse(form)

    if (!response.success) {
      const error = formatErrorZodMessage<FormSchema>(response.error)

      setErrors(error)

      return
    }

    try {
      await update({
        _id: contactId,
        ...form,
        orgId,
      }).unwrap()

      setOpen(false)

      enqueueSnackbar("Name updated successfully", { variant: "success" })
    } catch (error) {
      setErrors(
        (prev) => ({ ...prev, request: parseError(error) }) as FormError
      )
    }
  }

  return (
    <Dropdown
      sx={{ width: "100%" }}
      open={open}
      ancher={
        <Stack
          sx={{
            mt: 2.5,
            gap: 2,
            width: "100%",
            cursor: "pointer",
            alignItems: "center",
            flexDirection: "row",
            justifyContent: "space-between",
          }}
          onClick={() => setOpen(true)}
        >
          <Typography sx={{ color: "gray.700" }}>Edit Contact</Typography>

          <ChevronRight size={20} />
        </Stack>
      }
      onClose={() => setOpen(false)}
      anchorOrigin={{
        vertical: "bottom",
        horizontal: "left",
      }}
      transformOrigin={{
        vertical: "top",
        horizontal: "left",
      }}
    >
      <Card sx={{ width: "20rem" }}>
        <Stack sx={{ p: 2, width: "100%" }}>
          <TextField
            label="Name"
            error={!!errors?.name}
            value={form.name}
            onChange={({ target }) =>
              setForm((prev) => ({ ...prev, name: target.value }))
            }
            helperText={errors?.name}
          />

          <LoadingButton
            sx={{ mt: 2, ml: "auto" }}
            onClick={submit}
            loading={isLoading}
          >
            Update name
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
      </Card>
    </Dropdown>
  )
}
