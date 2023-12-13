"use client"

import { useMemo } from "react"
import { RootState } from "@/redux/store"
import { useSelector } from "react-redux"

import PropertyPage from "@/components/PropertyPage"

type PageProps = {
  params: {
    agentId: string
    searchId: string
    propertyId: string
  }
}

export default function Property({ params }: PageProps) {
  const { agentId, searchId, propertyId } = params

  const agentOrgs = useSelector((state: RootState) => state.app.agentOrgs)
  const agentProfile = useMemo(
    () => agentOrgs.find((agent) => agent._id === agentId),
    [agentId, agentOrgs]
  )

  return (
    <PropertyPage
      orgId={String(agentProfile?.orgId)}
      agentId={agentId}
      searchId={searchId}
      propertyId={propertyId}
    />
  )
}
