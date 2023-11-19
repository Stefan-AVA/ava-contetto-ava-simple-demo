"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useGetContactsQuery } from "@/redux/apis/agent"
import { useGetMembersQuery, useGetOrgQuery } from "@/redux/apis/org"
import { TabContext, TabList, TabPanel } from "@mui/lab"
import { Box, CircularProgress, Stack, Tab, Typography } from "@mui/material"
import { ChevronLeft } from "lucide-react"

import MyContacts from "./Contacts"
import OrgMembers from "./Members"
import OrgInfo from "./OrgInfo"

type PageProps = {
  params: {
    id: string
  }
}

const Page = ({ params: { id } }: PageProps) => {
  const [tab, setTab] = useState("1")

  const { replace } = useRouter()

  const {
    data: orgData,
    isError,
    isLoading,
  } = useGetOrgQuery({ id }, { skip: !id })

  const { data: members = [] } = useGetMembersQuery({ id }, { skip: !id })
  const { data: contacts = [] } = useGetContactsQuery(
    { id: orgData?.agentProfile._id as string },
    { skip: !orgData?.agentProfile._id }
  )

  useEffect(() => {
    if (!id || isError) replace("/app/orgs")
  }, [id, replace, isError])

  return (
    <Stack sx={{ gap: 5 }}>
      {isLoading && (
        <Stack
          sx={{ width: "100%", alignItems: "center", justifyContent: "center" }}
        >
          <CircularProgress size="1.25rem" />
        </Stack>
      )}

      {orgData && (
        <>
          <Stack
            sx={{
              gap: 1,
              alignItems: "center",
              flexDirection: "row",
            }}
          >
            <Box
              sx={{
                color: "gray.400",
                transition: "all .3s ease-in-out",

                ":hover": {
                  color: "cyan.500",
                },
              }}
              href="/app/orgs"
              component={Link}
            >
              <ChevronLeft size={20} />
            </Box>

            <Typography
              sx={{ color: "blue.800", fontWeight: 500 }}
              variant="h4"
              component="h1"
            >
              {orgData.org.name}
            </Typography>
          </Stack>

          <TabContext value={tab}>
            <Box sx={{ borderBottom: 1, borderColor: "gray.300" }}>
              <TabList onChange={(_, value) => setTab(value)}>
                <Tab label="Info" value="1" />
                <Tab label="Members" value="2" />
                <Tab label="My contacts" value="3" />
              </TabList>
            </Box>

            <TabPanel value="1">
              <OrgInfo org={orgData.org} role={orgData.agentProfile.role} />
            </TabPanel>
            <TabPanel value="2">
              <OrgMembers me={orgData.agentProfile} members={members} />
            </TabPanel>
            <TabPanel value="3">
              <MyContacts me={orgData.agentProfile} contacts={contacts} />
            </TabPanel>
          </TabContext>
        </>
      )}
    </Stack>
  )
}

export default Page
