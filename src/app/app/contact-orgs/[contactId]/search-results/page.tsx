"use client"

import { useMemo } from "react"
import { RootState } from "@/redux/store"
import { useSelector } from "react-redux"

import SearchResultPage from "@/components/SearchResultPage"

type PageProps = {
  params: {
    contactId: string
  }
}

const Page = ({ params }: PageProps) => {
  const { contactId } = params

  const contactOrgs = useSelector((state: RootState) => state.app.contactOrgs)
  const contact = useMemo(
    () => contactOrgs.find((contact) => contact._id === contactId),
    [contactId, contactOrgs]
  )

  return (
    <SearchResultPage orgId={String(contact?.orgId)} contactId={contactId} />
  )
}

export default Page
