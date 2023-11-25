"use client"

import { useMemo, useState } from "react"
import { useGetSearchResultQuery } from "@/redux/apis/search"
import { RootState } from "@/redux/store"
import {
  Button,
  ButtonGroup,
  Unstable_Grid2 as Grid,
  Stack,
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

  const agentOrgs = useSelector((state: RootState) => state.app.agentOrgs)

  const agentProfile = useMemo(
    () => agentOrgs.find((agent) => agent._id === params.agentId),
    [params, agentOrgs]
  )

  const { data, isLoading } = useGetSearchResultQuery(
    { orgId: agentProfile?.orgId as string, searchId: params.search_id },
    { skip: !agentProfile?.orgId }
  )

  const filterByType = useMemo(() => {
    if (data) {
      if (selected === "All") return data.properties

      if (selected === "Shortlisted")
        return data.properties.filter(({ _id }) =>
          data.searchResult.shortlists.includes(_id)
        )

      if (selected === "Rejected")
        return data.properties.filter(({ _id }) =>
          data.searchResult.rejects.includes(_id)
        )
    }

    return []
  }, [data, selected])

  return (
    <Stack>
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
            <Property
              {...property}
              xs={12}
              sm={6}
              md={6}
              xl={6}
              key={property._id}
              orgId={agentProfile?.orgId as string}
              agentId={params.agentId}
              contactId={params.contact_id}
              searchResult={data.searchResult}
            />
          ))}
        </Grid>
      )}
    </Stack>
  )
}
