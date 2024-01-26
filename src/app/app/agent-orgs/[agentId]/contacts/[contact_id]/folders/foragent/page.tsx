"use client"

import { useMemo } from "react"
import { RootState } from "@/redux/store"
import { useSelector } from "react-redux"

import FolderPage from "@/components/pages/Folder"

type PageProps = {
  params: {
    agentId: string
    contact_id: string
  }
}

const Page = ({ params }: PageProps) => {
  const { agentId, contact_id } = params

  const agentOrgs = useSelector((state: RootState) => state.app.agentOrgs)

  const agentProfile = useMemo(
    () => agentOrgs.find((agent) => agent._id === agentId),
    [agentId, agentOrgs]
  )

  return (
    <FolderPage
      orgId={String(agentProfile?.orgId)}
      agentId={agentId}
      contactId={contact_id}
      isShared={false}
      forAgentOnly={true}
    />
  )
}

export default Page
