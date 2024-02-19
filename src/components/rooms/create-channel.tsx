import { useState, type MouseEvent } from "react"
import { useRouter } from "next/navigation"
import { useCreateChannelMutation } from "@/redux/apis/room"
import { parseError } from "@/utils/error"
import formatErrorZodMessage from "@/utils/format-error-zod"
import { LoadingButton } from "@mui/lab"
import {
  FormControlLabel,
  Stack,
  Switch,
  TextField,
  Typography,
} from "@mui/material"
import { Plus } from "lucide-react"
import { useSnackbar } from "notistack"
import { z } from "zod"

import { IAgentProfile } from "@/types/agentProfile.types"

import Dropdown from "../drop-down"

const schema = z.object({
  name: z.string().min(1, "Enter the name"),
  isPublic: z.boolean().default(false),
})

const initialForm = {
  name: "",
  isPublic: false,
}

type FormSchema = z.infer<typeof schema>

type FormError = Omit<FormSchema, "isPublic"> & {
  request?: string
  isPublic?: string
}

type CreateChannelProps = {
  agentProfile: IAgentProfile
}

export default function CreateChannel({ agentProfile }: CreateChannelProps) {
  const { push } = useRouter()

  const [open, setOpen] = useState(false)
  const [form, setForm] = useState<FormSchema>(initialForm)
  const [errors, setErrors] = useState<FormError | null>(null)

  const { enqueueSnackbar } = useSnackbar()

  const [create, { isLoading }] = useCreateChannelMutation()

  async function submit(e: MouseEvent<HTMLButtonElement>) {
    e.preventDefault()

    setErrors(null)

    const response = schema.safeParse(form)

    if (!response.success) {
      const error = formatErrorZodMessage<FormSchema>(response.error)

      setErrors(error)

      return
    }

    try {
      const channel = await create({
        ...form,
        orgId: agentProfile.orgId,
      }).unwrap()

      setOpen(false)

      push(`/app/agent-orgs/${agentProfile._id}/rooms/${channel._id}`)

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
          Create group
        </Typography>
      }
      onClose={() => setOpen(false)}
    >
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

        <FormControlLabel
          sx={{ mt: 0.5 }}
          control={
            <Switch
              checked={form.isPublic}
              onClick={() =>
                setForm((prev) => ({ ...prev, isPublic: !prev.isPublic }))
              }
            />
          }
          label="Is Public?"
        />

        <LoadingButton
          sx={{ mt: 2, ml: "auto" }}
          loading={isLoading}
          fullWidth
          onClick={submit}
        >
          Create group
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
