"use client"

import { useMemo, useState } from "react"
import { Route } from "next"
import Link from "next/link"
import {
  useDeleteContactMutation,
  useGetContactsQuery,
  useShareContactMutation,
} from "@/redux/apis/org"
import { type RootState } from "@/redux/store"
import { getDatefromUnix } from "@/utils/format-date"
import {
  Button,
  CircularProgress,
  Dialog,
  Stack,
  Typography,
} from "@mui/material"
import {
  DataGrid,
  type GridColDef,
  type GridRowParams,
  type GridRowsProp,
} from "@mui/x-data-grid"
import { format } from "date-fns"
import { Eye, Plus, Share2, Trash2 } from "lucide-react"
import { useSnackbar } from "notistack"
import { useSelector } from "react-redux"

import type { IContact } from "@/types/contact.types"
import Avatar from "@/components/Avatar"
import CreateContactForm from "@/components/create-contact-form"

interface IPage {
  params: {
    agentId: string
  }
}

export default function Page({ params }: IPage) {
  const [modalOpen, setModalOpen] = useState(false)

  const state = useSelector((state: RootState) => state.app.agentOrgs)

  const agentProfile = useMemo(
    () => state.find((agent) => agent._id === params.agentId),
    [state, params]
  )

  const { enqueueSnackbar } = useSnackbar()

  const { data, isLoading, refetch } = useGetContactsQuery(
    {
      orgId: agentProfile?.orgId,
    },
    {
      skip: !agentProfile?.orgId,
    }
  )

  const [shareContact, { isLoading: isLoadingShareContact }] =
    useShareContactMutation({})

  const [deleteContact, { isLoading: isLoadingDeleteContact }] =
    useDeleteContactMutation({})

  async function share(props: Partial<IContact>) {
    const response = await shareContact(props).unwrap()

    navigator.clipboard.writeText(response.link)

    enqueueSnackbar("Link copied successfully", { variant: "success" })
  }

  const rows: GridRowsProp = data
    ? data.map((contact) => ({
        ...contact,
        id: contact._id,
        createdAt: format(
          new Date(getDatefromUnix(contact.createdAt)),
          "MMM dd, yyyy"
        ),
      }))
    : []

  const columns: GridColDef[] = [
    {
      flex: 1,
      field: "name",
      sortable: false,
      filterable: false,
      headerName: "Name",
      renderCell: (item) => (
        <Link
          href={
            `/app/agent-orgs/${params.agentId}/contacts/${item.row.id}` as Route
          }
        >
          <Stack sx={{ gap: 2, alignItems: "center", flexDirection: "row" }}>
            <Avatar
              name={item.row.name}
              image={item.row.image}
              width={40}
              height={40}
              fontSize={20}
            />

            <Typography sx={{ fontWeight: 500 }}>{item.row.name}</Typography>
          </Stack>
        </Link>
      ),
    },
    {
      flex: 1,
      field: "email",
      sortable: false,
      filterable: false,
      headerName: "Email",
    },
    {
      flex: 1,
      field: "username",
      sortable: false,
      filterable: false,
      headerName: "User",
    },
    {
      flex: 1,
      field: "createdAt",
      sortable: false,
      filterable: false,
      headerName: "Contact Added",
    },
    {
      flex: 1,
      type: "actions",
      field: "share",
      sortable: false,
      filterable: false,
      headerName: "Invite Link",
      getActions: (item: GridRowParams) => [
        <>
          <button
            type="button"
            onClick={() => share({ _id: item.row.id, orgId: item.row.orgId })}
          >
            {isLoadingShareContact && <CircularProgress size="1.25rem" />}
            {!isLoadingShareContact && <Share2 size={20} />}
          </button>
        </>,
      ],
    },
    {
      type: "actions",
      field: "actions",
      width: 120,
      sortable: false,
      headerName: "",
      filterable: false,
      getActions: (item: GridRowParams) => [
        <>
          <Link
            href={
              `/app/agent-orgs/${params.agentId}/contacts/${item.row.id}` as Route
            }
          >
            <Eye size={20} />
          </Link>

          <button
            type="button"
            onClick={() =>
              deleteContact({ _id: item.row.id, orgId: item.row.orgId })
            }
          >
            {isLoadingDeleteContact && <CircularProgress size="1.25rem" />}
            {!isLoadingDeleteContact && <Trash2 size={20} />}
          </button>
        </>,
      ],
    },
  ]

  return (
    <Stack>
      <Stack
        sx={{
          mb: 4,
          gap: 3,
          alignItems: {
            sm: "center",
          },
          flexDirection: {
            xs: "column",
            sm: "row",
          },
          justifyContent: "space-between",
        }}
      >
        <Typography sx={{ fontWeight: 700 }} variant="h3">
          Contacts List
        </Typography>

        <Button
          sx={{ width: "fit-content" }}
          size="small"
          onClick={() => setModalOpen(true)}
          startIcon={<Plus size={16} />}
        >
          Create New
        </Button>
      </Stack>

      <DataGrid
        rows={rows}
        columns={columns}
        loading={isLoading}
        autoHeight
        hideFooter
        disableColumnMenu
        disableRowSelectionOnClick
      />

      <Dialog
        sx={{
          "& .MuiPaper-root": {
            width: { xs: "calc(100vw - 16px)", md: 400 },
          },
        }}
        open={modalOpen}
        onClose={() => setModalOpen(false)}
      >
        <CreateContactForm
          orgId={String(agentProfile?.orgId)}
          contactCreated={() => {
            setModalOpen(false)
            refetch()
          }}
        />
      </Dialog>
    </Stack>
  )
}
