"use client"

import { useMemo } from "react"
import { useParams } from "next/navigation"
import { RootState } from "@/redux/store"
import { useSelector } from "react-redux"

import FolderPage from "@/components/pages/Folder"

export default function Files() {
  const { contactId } = useParams()

  const contactOrgs = useSelector((state: RootState) => state.app.contactOrgs)
  const contact = useMemo(
    () => contactOrgs.find((contact) => contact._id === contactId),
    [contactId, contactOrgs]
  )

  return (
    <FolderPage
      orgId={String(contact?.orgId)}
      isShared={false}
      contactId={contactId as string}
    />
  )
}
