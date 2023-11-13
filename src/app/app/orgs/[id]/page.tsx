"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useGetMembersQuery, useGetOrgQuery } from "@/redux/apis/org"
import { Tab, TabList, TabPanel, Tabs } from "react-tabs"

import "react-tabs/style/react-tabs.css"

import { useGetContactsQuery } from "@/redux/apis/agent"

import MyContacts from "./Contacts"
import OrgMembers from "./Members"
import OrgInfo from "./OrgInfo"

type PageProps = {
  params: {
    id: string
  }
}

const Page = ({ params: { id } }: PageProps) => {
  const { replace } = useRouter()
  const { data: orgData, isError } = useGetOrgQuery({ id }, { skip: !id })
  const { data: members = [] } = useGetMembersQuery({ id }, { skip: !id })
  const { data: contacts = [] } = useGetContactsQuery(
    { id: orgData?.agentProfile._id as string },
    { skip: !orgData?.agentProfile._id }
  )

  useEffect(() => {
    if (!id || isError) replace("/app/orgs")
  }, [id, isError])

  return (
    <div className="flex flex-col">
      <div className="flex w-full items-center justify-between">
        <h1 className="text-2xl font-medium text-blue-800 capitalize">
          {orgData?.org.name}
        </h1>
      </div>

      <div className="mt-5">
        <Tabs>
          <TabList>
            <Tab>Info</Tab>
            <Tab>Members</Tab>
            <Tab>My Contacts</Tab>
          </TabList>

          <TabPanel>
            <OrgInfo org={orgData?.org} role={orgData?.agentProfile.role} />
          </TabPanel>
          <TabPanel>
            <OrgMembers me={orgData?.agentProfile} members={members} />
          </TabPanel>
          <TabPanel>
            <MyContacts me={orgData?.agentProfile} contacts={contacts} />
          </TabPanel>
        </Tabs>
      </div>
    </div>
  )
}

export default Page
