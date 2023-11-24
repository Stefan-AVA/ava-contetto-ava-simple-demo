"use client"

import { useMemo } from "react"
import { RootState } from "@/redux/store"
import { useSelector } from "react-redux"

import SearchPage from "@/components/SearchPage"

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

  return <SearchPage orgId={String(agentProfile?.orgId)} agentId={agentId} />
}

export default Page
