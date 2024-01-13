"use client"

import { useMemo, useState } from "react"
import { RootState } from "@/redux/store"
import { TabContext, TabList, TabPanel } from "@mui/lab"
import { Box, Stack, Tab, Typography } from "@mui/material"
import { useSelector } from "react-redux"

// import { AgentRole } from "@/types/agentProfile.types"
import OrgInfo from "@/components/org/info"
import OrgMembers from "@/components/org/members"

// import WhiteLabel from "./white-label"

type PageProps = {
  params: {
    agentId: string
  }
}

const Page = ({ params }: PageProps) => {
  const { agentId } = params

  const [tab, setTab] = useState("1")

  const agentOrgs = useSelector((state: RootState) => state.app.agentOrgs)

  const agentProfile = useMemo(
    () => agentOrgs.find((agent) => agent._id === agentId),
    [agentId, agentOrgs]
  )

  return (
    <Stack sx={{ gap: 3 }}>
      <Stack
        sx={{
          gap: 1,
          alignItems: "center",
          flexDirection: "row",
        }}
      >
        <Typography
          sx={{ color: "gray.700", fontWeight: 500 }}
          variant="h4"
          component="h1"
        >
          {agentProfile?.org?.name}
        </Typography>
      </Stack>

      <TabContext value={tab}>
        <Box sx={{ borderBottom: 1, borderColor: "gray.300" }}>
          <TabList onChange={(_, value) => setTab(value)}>
            <Tab label="Info" value="1" />
            <Tab label="Members" value="2" />
            {/* {(agentProfile?.role === AgentRole.owner ||
              agentProfile?.role === AgentRole.admin) && (
              <Tab label="White Label" value="3" />
            )} */}
          </TabList>
        </Box>

        <TabPanel value="1">
          <OrgInfo org={agentProfile?.org} role={agentProfile?.role} />
        </TabPanel>
        <TabPanel value="2">
          <OrgMembers me={agentProfile} />
        </TabPanel>
        {/* {(agentProfile?.role === AgentRole.owner ||
          agentProfile?.role === AgentRole.admin) && (
          <TabPanel value="3">
            <WhiteLabel
              orgId={agentProfile.orgId}
              agentProfile={agentProfile}
            />
          </TabPanel>
        )} */}
      </TabContext>
    </Stack>
  )
}

export default Page
