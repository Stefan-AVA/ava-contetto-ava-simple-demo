"use client"

import Link from "next/link"

import OrgInfo from "../[id]/OrgInfo"

const CreateOrgPage = () => {
  return (
    <div className="flex flex-col py-5 max-w-[500px]">
      <div className="flex w-full items-center justify-between">
        <h1 className="text-2xl font-medium text-blue-800 capitalize">
          Organization Create
        </h1>
        <Link href="/app/orgs">Back</Link>
      </div>

      <OrgInfo isCreate />
    </div>
  )
}

export default CreateOrgPage
