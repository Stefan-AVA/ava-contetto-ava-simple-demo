"use client"

import { useMemo } from "react"
import { RootState } from "@/redux/store"
import { useSelector } from "react-redux"

import SearchPage from "@/components/SearchPage"

type PageProps = {
  params: {
    agentId: string
  }
  searchParams: {
    search_id?: string
  }
}

const Page = ({ params, searchParams }: PageProps) => {
  const { agentId } = params
  const { search_id } = searchParams

  const agentOrgs = useSelector((state: RootState) => state.app.agentOrgs)

  const agentProfile = useMemo(
    () => agentOrgs.find((agent) => agent._id === agentId),
    [agentId, agentOrgs]
  )

  return (
    <SearchPage
      orgId={String(agentProfile?.orgId)}
      agentId={agentId}
      searchId={search_id}
    />
  )
}

export default Page
