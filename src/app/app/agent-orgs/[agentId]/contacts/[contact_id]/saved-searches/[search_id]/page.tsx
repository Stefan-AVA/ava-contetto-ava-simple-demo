"use client"

import { useMemo, useState } from "react"
import { useGetSearchResultQuery } from "@/redux/apis/search"
import { RootState } from "@/redux/store"
import {
  Button,
  ButtonGroup,
  CircularProgress,
  Unstable_Grid2 as Grid,
  Pagination,
  PaginationItem,
  Stack,
  Typography,
} from "@mui/material"
import { useSelector } from "react-redux"

import Loading from "@/components/Loading"
import Property from "@/components/SearchPage/Property"

interface IPage {
  params: {
    agentId: string
    search_id: string
    contact_id: string
  }
}

export default function SavedSearches({ params }: IPage) {
  const [selected, setSelected] = useState("All")
  const [page, setPage] = useState(1)

  const agentOrgs = useSelector((state: RootState) => state.app.agentOrgs)

  const agentProfile = useMemo(
    () => agentOrgs.find((agent) => agent._id === params.agentId),
    [params, agentOrgs]
  )

  const { data, isLoading, refetch, isFetching } = useGetSearchResultQuery(
    {
      orgId: agentProfile?.orgId as string,
      searchId: params.search_id,
      page: page - 1,
    },
    { skip: !agentProfile?.orgId }
  )

  const filterByType = useMemo(() => {
    if (data) {
      if (selected === "All") return data.properties

      if (selected === "Shortlisted") return data.shortlists

      if (selected === "Rejected") return data.rejects
    }

    return []
  }, [data, selected])

  const pageCount = useMemo(() => {
    if (data) return Math.ceil(data.total / 12)
    return 0
  }, [data])

  return (
    <Stack>
      {data && !isLoading && (
        <Stack direction="row" alignItems="center" spacing={3} marginBottom={2}>
          <Stack direction="row" spacing={2} alignItems="center">
            <Typography>City:</Typography>
            <Typography
              sx={{
                maxWidth: { xs: 130, md: "unset" },
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
              }}
            >
              {`${data?.searchResult.userQueryJson.city.city}, ${data?.searchResult.userQueryJson.city.admin_name}, ${data?.searchResult.userQueryJson.city.country}`}
            </Typography>
          </Stack>

          <Stack direction="row" spacing={2} alignItems="center">
            <Typography>Range:</Typography>
            <Typography>{data?.searchResult.userQueryJson.range} km</Typography>
          </Stack>
        </Stack>
      )}
      <ButtonGroup size="small" disableElevation>
        {["All", "Shortlisted", "Rejected"].map((field) => (
          <Button
            key={field}
            onClick={() => setSelected(field)}
            variant={field === selected ? "contained" : "outlined"}
          >
            {field}
          </Button>
        ))}
      </ButtonGroup>

      {isLoading && <Loading />}

      {data && !isLoading && (
        <Grid sx={{ mt: 3, width: "100%" }} container spacing={3}>
          {filterByType.map((property) => (
            <Grid xs={12} sm={12} md={6} xl={6} key={property._id}>
              <Property
                {...property}
                orgId={agentProfile?.orgId as string}
                agentId={params.agentId}
                contactId={params.contact_id}
                searchResult={data.searchResult}
                refetch={refetch}
              />
            </Grid>
          ))}
        </Grid>
      )}

      {selected === "All" && pageCount ? (
        <Stack alignItems="center" width="100%" mt={3} mb={3}>
          <Pagination
            count={pageCount}
            page={page}
            onChange={(e, value) => setPage(value)}
            renderItem={(item) =>
              item.selected && isFetching ? (
                <CircularProgress size="0.8rem" sx={{ mx: 2 }} />
              ) : (
                <PaginationItem {...item} />
              )
            }
          />
        </Stack>
      ) : null}
    </Stack>
  )
}
