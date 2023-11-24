"use client"

import { useMemo, useState } from "react"
import { useGetSearchResultsByContactQuery } from "@/redux/apis/search"
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

  const { data, isLoading } = useGetSearchResultsByContactQuery(
    {
      orgId: agentProfile?.orgId as string,
      contactId: params.contact_id,
    },
    {
      skip: !agentProfile?.orgId || !params.contact_id,
    }
  )

  console.log({ data })

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

      {/* {data && !isLoading && (
        <Grid sx={{ mt: 3, width: "100%" }} container spacing={4}>
          {data.properties.map((property) => (
            <Property
              key={property._id}
              {...property}
              orgId={orgId}
              agentId={agentId}
              contactId={contactId}
              searchResult={searchResult}
              setSearchResult={setSearchResult}
            />
          ))}
        </Grid>
      )} */}
    </Stack>
  )
}
