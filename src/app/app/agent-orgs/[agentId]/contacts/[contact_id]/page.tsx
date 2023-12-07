"use client"

import { useMemo, useState } from "react"
import { useDeleteNoteMutation, useGetNotesQuery } from "@/redux/apis/org"
import type { RootState } from "@/redux/store"
import { LoadingButton } from "@mui/lab"
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  IconButton,
  Stack,
  Typography,
} from "@mui/material"
import { format } from "date-fns"
import { Edit, Trash2 } from "lucide-react"
import { useSnackbar } from "notistack"
import { useSelector } from "react-redux"

import { IContactNote } from "@/types/contact.types"
import Loading from "@/components/Loading"

import ContactNoteForm from "./ContactNoteForm"

type IPage = {
  params: {
    agentId: string
    contact_id: string
  }
}

export default function Page({ params }: IPage) {
  const { enqueueSnackbar } = useSnackbar()

  const [noteView, setNoteView] = useState(false)
  const [note, setNote] = useState<IContactNote | undefined>(undefined)
  const [remove, setRemove] = useState<string | null>(null)

  const agentOrgs = useSelector((state: RootState) => state.app.agentOrgs)

  const agentProfile = useMemo(
    () => agentOrgs.find((agent) => agent._id === params.agentId),
    [params, agentOrgs]
  )

  const {
    data: notes = [],
    isLoading,
    refetch,
    isFetching,
  } = useGetNotesQuery(
    {
      orgId: String(agentProfile?.orgId),
      contactId: params.contact_id,
    },
    {
      skip: !params.contact_id || !agentProfile,
    }
  )

  const [deleteNote, { isLoading: isDeleting }] = useDeleteNoteMutation()

  const onDeleteNote = async () => {
    try {
      await deleteNote({
        _id: String(remove),
        orgId: String(agentProfile?.orgId),
        contactId: params.contact_id,
      }).unwrap()
      await refetch()
      enqueueSnackbar("Successfully deleted", { variant: "success" })
      setRemove(null)
    } catch (error) {
      console.log(error)
      enqueueSnackbar("Deleted error!", { variant: "error" })
    }
  }

  return isLoading ? (
    <Loading />
  ) : noteView ? (
    <ContactNoteForm
      orgId={String(agentProfile?.orgId)}
      contactId={params.contact_id}
      contactNote={note}
      setNoteView={setNoteView}
      refetch={refetch}
      isFetching={isFetching}
    />
  ) : (
    <Stack>
      <Stack direction="row" justifyContent="flex-end">
        <Button
          variant="text"
          sx={{ p: 0, height: "fit-content" }}
          onClick={() => {
            setNote(undefined)
            setNoteView(true)
          }}
        >
          Create a Note
        </Button>
      </Stack>
      <Stack spacing={2} mt={2} minHeight={400}>
        {notes.map((note) => (
          <Stack
            key={note._id}
            spacing={1}
            sx={{
              width: "100%",
              p: 1,
              borderRadius: "10px",
              bgcolor: "gray.200",
              borderLeft: "4px solid",
              borderLeftColor: "blue.900",
            }}
          >
            <Stack
              direction="row"
              justifyContent="space-between"
              alignItems="center"
              width="100%"
            >
              <Typography variant="caption">
                {format(
                  new Date(note.timestamp * 1000),
                  "MM/dd/yyyy hh:mm:ss p"
                )}
              </Typography>
              <Stack direction="row" spacing={1}>
                <IconButton
                  onClick={() => {
                    setNote(note)
                    setNoteView(true)
                  }}
                  sx={{
                    p: 0,
                  }}
                >
                  <Edit size={15} />
                </IconButton>

                <IconButton
                  onClick={() => setRemove(note._id)}
                  sx={{
                    p: 0,
                  }}
                >
                  <Trash2 size={15} />
                </IconButton>
              </Stack>
            </Stack>

            <Typography variant="caption">{note.note}</Typography>
          </Stack>
        ))}
      </Stack>

      <Dialog
        open={!!remove}
        onClose={() => setRemove(null)}
        maxWidth="xs"
        fullWidth
        keepMounted
      >
        <DialogTitle>Delete Note</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-slide-description">
            Do you really want to delete this Note?
            <br />
            This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button color="inherit" onClick={() => setRemove(null)}>
            Cancel
          </Button>

          <LoadingButton
            color="error"
            onClick={onDeleteNote}
            loading={isDeleting || isFetching}
          >
            Delete
          </LoadingButton>
        </DialogActions>
      </Dialog>
    </Stack>
  )
}
