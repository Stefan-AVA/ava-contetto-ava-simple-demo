"use client"

import { useMemo } from "react"
import { RootState } from "@/redux/store"
import { useSelector } from "react-redux"

import FolderPage from "@/components/pages/Folder"

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
    <FolderPage
      orgId={String(contact?.orgId)}
      contactId={contactId}
      isShared={false}
    />
  )
}

export default Page
