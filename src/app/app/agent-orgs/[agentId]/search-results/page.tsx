"use client"

import { useMemo } from "react"
import { RootState } from "@/redux/store"
import { useSelector } from "react-redux"

import SearchResultsPage from "@/components/SearchResultsPage"

type PageProps = {
  params: {
    agentId: string
  }
}

const Page = ({ params }: PageProps) => {
  const { agentId } = params

  const agentOrgs = useSelector((state: RootState) => state.app.agentOrgs)
  const agentProfile = useMemo(
    () => agentOrgs.find((agent) => agent._id === agentId),
    [agentId, agentOrgs]
  )

  return (
    <SearchResultsPage orgId={String(agentProfile?.orgId)} agentId={agentId} />
  )
}

export default Page
