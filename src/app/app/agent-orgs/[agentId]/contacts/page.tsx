"use client"

import { useMemo } from "react"
import { Route } from "next"
import Link from "next/link"
import { useDeleteContactMutation, useGetContactsQuery } from "@/redux/apis/org"
import { type RootState } from "@/redux/store"
import { getDatefromUnix } from "@/utils/format-date"
import { nameInitials } from "@/utils/format-name"
import { Avatar, CircularProgress, Stack, Typography } from "@mui/material"
import {
  DataGrid,
  type GridColDef,
  type GridRowParams,
  type GridRowsProp,
} from "@mui/x-data-grid"
import { format } from "date-fns"
import { Eye, Trash2 } from "lucide-react"
import { useSelector } from "react-redux"

interface IPage {
  params: {
    agentId: string
  }
}

export default function Page({ params }: IPage) {
  const state = useSelector((state: RootState) => state.app.agentOrgs)

  const agentProfile = useMemo(
    () => state.find((agent) => agent._id === params.agentId),
    [state, params]
  )

  const { data, isLoading } = useGetContactsQuery(
    {
      orgId: agentProfile?.orgId,
    },
    {
      skip: !agentProfile?.orgId,
    }
  )

  const [deleteContact, { isLoading: isLoadingDeleteContact }] =
    useDeleteContactMutation({})

  const rows: GridRowsProp = data
    ? data.map((contact) => ({
        id: contact._id,
        name: contact.name,
        orgId: contact.orgId,
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
      renderCell: (params) => (
        <Stack sx={{ gap: 2, alignItems: "center", flexDirection: "row" }}>
          <Avatar>{nameInitials(params.row.name)}</Avatar>

          <Typography sx={{ fontWeight: 500 }}>{params.row.name}</Typography>
        </Stack>
      ),
    },
    {
      flex: 1,
      field: "createdAt",
      sortable: false,
      filterable: false,
      headerName: "Contact Added",
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
      <Typography
        sx={{
          pb: 3,
          mb: 4,
          fontWeight: 700,
          borderBottom: "1px solid",
          borderBottomColor: "gray.300",
        }}
        variant="h3"
      >
        Contacts List
      </Typography>

      <DataGrid
        rows={rows}
        columns={columns}
        loading={isLoading}
        autoHeight
        hideFooter
        disableColumnMenu
        disableRowSelectionOnClick
      />
    </Stack>
  )
}
