"use client"

import { useEffect, useState, type FormEvent } from "react"
import { useRouter } from "next/navigation"
import { useDeleteAccountMutation, usePostMeMutation } from "@/redux/apis/auth"
import { logout, setUser } from "@/redux/slices/app"
import { RootState, useAppDispatch } from "@/redux/store"
import { parseError } from "@/utils/error"
import formatErrorZodMessage from "@/utils/format-error-zod"
import { LoadingButton } from "@mui/lab"
import {
  Button,
  Modal,
  Paper,
  Stack,
  TextField,
  Typography,
} from "@mui/material"
import { X } from "lucide-react"
import { useSelector } from "react-redux"
import { z } from "zod"

import { IUser } from "@/types/user.types"

const schema = z.object({
  name: z.string().min(1, "Enter your full name"),
})

const initialForm = {
  name: "",
}

export type ProfileFormSchema = z.infer<typeof schema>

type FormError = ProfileFormSchema & {
  request?: string
}

interface IDeleteError {
  password?: string
  reason?: string
  request?: string
}

export default function Page() {
  const [form, setForm] = useState<ProfileFormSchema>(initialForm)
  const [errors, setErrors] = useState<FormError | null>(null)
  const [deleteAccountDialog, setDeleteAccountDialog] = useState(false)

  const [deleteForm, setDeleteForm] = useState({
    password: "",
    reason: "",
  })
  const [deleteError, setDeleteError] = useState<IDeleteError>({})

  const { replace } = useRouter()
  const dispatch = useAppDispatch()

  const user = useSelector((state: RootState) => state.app.user)

  const [updateProfile, { isLoading }] = usePostMeMutation()
  const [deleteAccount, { isLoading: isDeleting }] = useDeleteAccountMutation()

  useEffect(() => {
    if (user) {
      setForm((prev) => ({
        ...prev,
        name: user.name || "",
      }))
    }
  }, [user])

  async function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()

    setErrors(null)

    const response = schema.safeParse(form)

    if (!response.success) {
      const error = formatErrorZodMessage<ProfileFormSchema>(response.error)

      setErrors(error)

      return
    }

    try {
      const updatedUser = await updateProfile({
        ...(user as IUser),
        name: form.name,
      }).unwrap()

      dispatch(setUser(updatedUser))
    } catch (error) {
      setErrors(
        (prev) => ({ ...prev, request: parseError(error) }) as FormError
      )
    }
  }

  const onDeleteAccount = async () => {
    setDeleteError({})

    if (!deleteForm.password) {
      return setDeleteError((prev) => ({
        ...prev,
        password: "This field is required",
      }))
    }
    if (!deleteForm.reason) {
      return setDeleteError((prev) => ({
        ...prev,
        reason: "This field is requried",
      }))
    }

    try {
      await deleteAccount(deleteForm).unwrap()

      dispatch(logout())

      replace("/")
    } catch (error) {
      setDeleteError(
        (prev) => ({ ...prev, request: parseError(error) }) as FormError
      )
    }
  }

  return (
    <Stack sx={{ mt: 10, width: "100%", alignItems: "center" }}>
      <Stack
        sx={{ width: "100%", maxWidth: "32rem" }}
        onSubmit={submit}
        component="form"
      >
        <TextField label="Username" value={user?.username || ""} disabled />

        <TextField
          sx={{ mt: 2 }}
          label="Display Name"
          value={form.name}
          error={!!errors?.name}
          onChange={({ target }) =>
            setForm((prev) => ({ ...prev, name: target.value }))
          }
          helperText={errors?.name}
        />

        <LoadingButton
          sx={{ mt: 6 }}
          type="submit"
          loading={isLoading}
          fullWidth
        >
          Submit
        </LoadingButton>

        <Button
          sx={{ mt: 2 }}
          color="error"
          variant="outlined"
          onClick={() => setDeleteAccountDialog(true)}
        >
          Delete account
        </Button>
      </Stack>

      <Modal
        open={deleteAccountDialog}
        onClose={() => setDeleteAccountDialog(false)}
      >
        <Paper
          sx={{
            p: 4,
            top: "50%",
            left: "50%",
            width: "100%",
            maxWidth: "39rem",
            position: "absolute",
            overflowY: "auto",
            maxHeight: "90vh",
            transform: "translate(-50%, -50%)",
          }}
          variant="outlined"
        >
          <Stack
            sx={{
              alignItems: "center",
              flexDirection: "row",
              justifyContent: "space-between",
            }}
          >
            <Typography sx={{ fontWeight: 600 }} variant="h4">
              Delete Account
            </Typography>

            <Stack
              sx={{
                color: "white",
                width: "2.5rem",
                height: "2.5rem",
                bgcolor: "gray.300",
                alignItems: "center",
                borderRadius: "50%",
                justifyContent: "center",
              }}
              onClick={() => setDeleteAccountDialog(false)}
              component="button"
            >
              <X strokeWidth={3} />
            </Stack>
          </Stack>

          <Stack
            sx={{
              mt: 2,
              gap: 4,
              alignItems: "center",
              flexDirection: "row",
            }}
          >
            <TextField
              label="Enter Password again"
              type="password"
              fullWidth
              value={deleteForm.password}
              onChange={({ target }) => {
                setDeleteError({})
                setDeleteForm((prev) => ({ ...prev, password: target.value }))
              }}
              error={!!deleteError.password}
              helperText={deleteError.password}
            />
          </Stack>

          <Stack
            sx={{
              mt: 2,
              gap: 4,
              alignItems: "center",
              flexDirection: "row",
            }}
          >
            <TextField
              rows={4}
              label="Enter the reason why you want to delete the account"
              fullWidth
              multiline
              value={deleteForm.reason}
              onChange={({ target }) => {
                setDeleteError({})
                setDeleteForm((prev) => ({ ...prev, reason: target.value }))
              }}
              error={!!deleteError.reason}
              helperText={deleteError.reason}
            />
          </Stack>

          <Stack
            sx={{
              mt: 4,
              gap: 2,
              alignItems: "center",
              flexDirection: "row",
              justifyContent: "flex-end",
            }}
          >
            <Button
              size="small"
              color="primary"
              variant="outlined"
              onClick={() => setDeleteAccountDialog(false)}
            >
              Cancel
            </Button>

            <LoadingButton
              size="small"
              color="error"
              onClick={onDeleteAccount}
              loading={isDeleting}
            >
              Delete
            </LoadingButton>
          </Stack>
          {deleteError.request && (
            <Typography
              sx={{ mt: 1.5, color: "red.500", textAlign: "center" }}
              variant="body2"
            >
              {deleteError.request}
            </Typography>
          )}
        </Paper>
      </Modal>
    </Stack>
  )
}
