import { useState, type FormEvent } from "react"
import { useCreateDMMutation } from "@/redux/apis/room"
import { parseError } from "@/utils/error"
import formatErrorZodMessage from "@/utils/format-error-zod"
import { LoadingButton } from "@mui/lab"
import { Stack, TextField, Typography } from "@mui/material"
import { Plus } from "lucide-react"
import { useSnackbar } from "notistack"
import { z } from "zod"

import Dropdown from "../drop-down"

const schema = z.object({
  name: z.string().min(1, "Enter the name"),
})

const initialForm = {
  name: "",
}

type FormSchema = z.infer<typeof schema>

type FormError = FormSchema & {
  request?: string
}

type CreateChannelProps = {
  orgId: string
}

export default function CreateDM({ orgId }: CreateChannelProps) {
  const [open, setOpen] = useState(false)
  const [form, setForm] = useState<FormSchema>(initialForm)
  const [errors, setErrors] = useState<FormError | null>(null)

  const { enqueueSnackbar } = useSnackbar()

  const [create, { isLoading }] = useCreateDMMutation()

  async function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()

    setErrors(null)

    const response = schema.safeParse(form)

    if (!response.success) {
      const error = formatErrorZodMessage<FormSchema>(response.error)

      setErrors(error)

      return
    }

    try {
      await create({
        ...form,
        orgId,
      }).unwrap()

      setOpen(false)

      enqueueSnackbar("Channel created successfully", { variant: "success" })
    } catch (error) {
      setErrors(
        (prev) => ({ ...prev, request: parseError(error) }) as FormError
      )
    }
  }

  return (
    <Dropdown
      open={open}
      ancher={
        <Typography
          sx={{
            mt: 2,
            gap: 0.5,
            width: "100%",
            color: "secondary.main",
            display: "flex",
            alignItems: "center",
            fontWeight: 600,
          }}
          onClick={() => setOpen(true)}
          disabled={isLoading}
          component="button"
        >
          <Plus size={20} />
          Create Channel
        </Typography>
      }
      onClose={() => setOpen(false)}
    >
      <Stack sx={{ p: 2, width: "100%" }} onSubmit={submit} component="form">
        <TextField
          label="Name"
          error={!!errors?.name}
          value={form.name}
          onChange={({ target }) =>
            setForm((prev) => ({ ...prev, name: target.value }))
          }
          helperText={errors?.name}
        />

        <LoadingButton sx={{ mt: 2, ml: "auto" }} loading={isLoading} fullWidth>
          Create DM
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
    </Dropdown>
  )
}
