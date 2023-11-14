"use client"

import Link from "next/link"
import { useGetOrgsQuery } from "@/redux/apis/org"
import { ArrowRight } from "lucide-react"

const Page = () => {
  const { data } = useGetOrgsQuery()

  return (
    <div className="flex flex-col">
      <div className="flex w-full items-center justify-between">
        <h1 className="text-2xl font-medium text-blue-800">
          Your Organizations
        </h1>
        <Link href="/app/orgs/create">
          <button className="bg-blue-500 text-white hover:bg-blue-800 inline-flex h-8 py-3 px-6 items-center justify-center rounded-lg text-sm transition-colors">
            Create
          </button>
        </Link>
      </div>

      <div className="flex flex-col gap-2 mt-5">
        {(data?.agentProfiles || []).map(({ _id, org, role, orgId }) => (
          <div key={_id} className="flex items-center justify-between">
            <div className="flex items-center">
              <span className="text-base font-bold capitalize">
                {org?.name}
              </span>
              <span className="text-xs ml-2">({role})</span>
            </div>
            <Link href={`/app/orgs/${orgId}`}>
              <ArrowRight />
            </Link>
          </div>
        ))}
        {/* {(data?.contacts || []).map(({ _id, org }) => (
          <div key={_id} className="flex items-center justify-between">
            <div className="flex items-center">
              <span className="text-base font-bold capitalize">
                {org?.name}
              </span>
              <span className="text-xs ml-2">(contact)</span>
            </div>
            <Link href={`/app/contacts/${_id}`}>
              <ArrowRight />
            </Link>
          </div>
        ))} */}
      </div>
    </div>
  )
}

export default Page
