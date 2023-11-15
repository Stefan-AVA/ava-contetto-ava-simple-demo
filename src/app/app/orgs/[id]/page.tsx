"use client"

import "react-tabs/style/react-tabs.css"

import { useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useGetContactsQuery } from "@/redux/apis/agent"
import { useGetMembersQuery, useGetOrgQuery } from "@/redux/apis/org"
import { ChevronLeft } from "lucide-react"
import { Tab, TabList, TabPanel, Tabs } from "react-tabs"

import Spinner from "@/components/spinner"

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
    <div className="flex flex-col gap-10">
      {isLoading && (
        <div className="w-full flex justify-center">
          <Spinner variant="primary" />
        </div>
      )}

      {orgData && (
        <>
          <div className="flex w-full gap-2 items-center">
            <Link
              href="/app/orgs"
              className="text-gray-400 transition-colors duration-300 hover:text-cyan-500"
            >
              <ChevronLeft size={20} />
            </Link>

            <h1 className="text-2xl font-medium text-blue-800 capitalize">
              {orgData.org.name}
            </h1>
          </div>

          <Tabs>
            <TabList>
              <Tab>Info</Tab>
              <Tab>Members</Tab>
              <Tab>My Contacts</Tab>
            </TabList>

            <TabPanel>
              <OrgInfo org={orgData.org} role={orgData.agentProfile.role} />
            </TabPanel>
            <TabPanel>
              <OrgMembers me={orgData.agentProfile} members={members} />
            </TabPanel>
            <TabPanel>
              <MyContacts me={orgData.agentProfile} contacts={contacts} />
            </TabPanel>
          </Tabs>
        </>
      )}
    </div>
  )
}

export default Page
