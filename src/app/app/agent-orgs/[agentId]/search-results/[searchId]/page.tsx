"use client"

import { useMemo } from "react"
import { RootState } from "@/redux/store"
import { useSelector } from "react-redux"

import SearchResultPage from "@/components/SearchResultPage"

type PageProps = {
  params: {
    agentId: string
    searchId: string
  }
}

const Page = ({ params }: PageProps) => {
  const { agentId, searchId } = params

  const agentOrgs = useSelector((state: RootState) => state.app.agentOrgs)
  const agentProfile = useMemo(
    () => agentOrgs.find((agent) => agent._id === agentId),
    [agentId, agentOrgs]
  )

  return (
    <SearchResultPage
      orgId={String(agentProfile?.orgId)}
      searchId={searchId}
      agentId={agentId}
    />
  )
}

export default Page
