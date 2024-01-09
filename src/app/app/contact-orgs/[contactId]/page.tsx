"use client"

import { useMemo } from "react"
import { RootState } from "@/redux/store"
import { useSelector } from "react-redux"

import SearchPage from "@/components/SearchPage"

type PageProps = {
  params: {
    contactId: string
  }
  searchParams: {
    search_id?: string
  }
}

const Page = ({ params, searchParams }: PageProps) => {
  const { contactId } = params
  const { search_id } = searchParams

  const contactOrgs = useSelector((state: RootState) => state.app.contactOrgs)

  const contact = useMemo(
    () => contactOrgs.find((contact) => contact._id === contactId),
    [contactId, contactOrgs]
  )

  return (
    <SearchPage
      orgId={String(contact?.orgId)}
      contactId={contactId}
      searchId={search_id}
    />
  )
}

export default Page
