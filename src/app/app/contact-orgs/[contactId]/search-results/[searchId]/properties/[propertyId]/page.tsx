"use client"

import { useMemo } from "react"
import { useGetPropertyQuery } from "@/redux/apis/search"
import { RootState } from "@/redux/store"
import { useSelector } from "react-redux"

import PropertyPage from "@/components/PropertyPage"

type PageProps = {
  params: {
    contactId: string
    searchId: string
    propertyId: string
  }
}

export default function Property({ params }: PageProps) {
  const { contactId, searchId, propertyId } = params

  const contactOrgs = useSelector((state: RootState) => state.app.contactOrgs)
  const contact = useMemo(
    () => contactOrgs.find((contact) => contact._id === contactId),
    [contactId, contactOrgs]
  )

  return (
    <PropertyPage
      orgId={String(contact?.orgId)}
      contactId={contactId}
      searchId={searchId}
      propertyId={propertyId}
    />
  )
}
