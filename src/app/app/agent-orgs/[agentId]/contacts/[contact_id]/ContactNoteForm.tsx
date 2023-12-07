"use client"

import { useState } from "react"
import {
  useCreateNoteMutation,
  useGetNotesQuery,
  useUpdateNoteMutation,
} from "@/redux/apis/org"
import { parseError } from "@/utils/error"
import { LoadingButton } from "@mui/lab"
import { Stack, TextField, Typography } from "@mui/material"
import { useSnackbar } from "notistack"

import { IContactNote } from "@/types/contact.types"

interface IError {
  note?: string
  request?: string
}
interface IProps {
  orgId: string
  contactId: string
  setNoteView: Function
  refetch: Function
  isFetching: boolean
  contactNote?: IContactNote
}

const ContactNoteForm = ({
  orgId,
  contactId,
  contactNote,
  refetch,
  isFetching,
  setNoteView,
}: IProps) => {
  const [note, setNote] = useState(contactNote?.note || "")
  const [errors, setErrors] = useState<IError>({})

  const { enqueueSnackbar } = useSnackbar()

  const [createNote, { isLoading: isCreating }] = useCreateNoteMutation()
  const [updateNote, { isLoading: isUpdating }] = useUpdateNoteMutation()

  const isLoading = isCreating || isUpdating || isFetching

  const onSubmit = async () => {
    setErrors({})

    if (!note) {
      setErrors((prev) => ({ ...prev, note: "This Field is required" }))
      return
    }

    try {
      if (contactNote) {
        await updateNote({
          _id: contactNote._id,
          orgId,
          contactId: contactId,
          note,
        }).unwrap()
      } else {
        await createNote({
          orgId,
          contactId,
          note,
        }).unwrap()
      }
      enqueueSnackbar(contactNote ? "Note updated" : "Note created", {
        variant: "success",
      })

      await refetch()

      setNoteView(false)
    } catch (error) {
      setErrors((prev) => ({ ...prev, request: parseError(error) }))
    }
  }

  return (
    <Stack>
      <Typography sx={{ fontWeight: 500 }} variant="h5">
        {contactNote ? "Update Note" : "Create a Note"}
      </Typography>

      <Stack sx={{ mt: 2, width: "100%" }}>
        <TextField
          label="Note"
          rows={6}
          value={note}
          error={!!errors?.note}
          onChange={({ target }) => setNote(target.value)}
          multiline
          helperText={errors?.note}
        />

        <LoadingButton
          sx={{ mt: 4.5, ml: "auto" }}
          onClick={onSubmit}
          loading={isLoading}
        >
          {contactNote ? "Update note" : "Create note"}
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
    </Stack>
  )
}

export default ContactNoteForm
