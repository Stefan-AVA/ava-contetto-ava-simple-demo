"use client"

import Link from "next/link"
import { useGetOrgsQuery } from "@/redux/apis/org"
import { ArrowRight } from "lucide-react"

import Button from "@/components/button"

const Page = () => {
  const { data } = useGetOrgsQuery()

  return (
    <div className="flex flex-col">
      <div className="flex w-full items-center justify-between">
        <h1 className="text-2xl font-medium text-blue-800">
          Your Organizations
        </h1>
        <Link href="/app/orgs/create">
          <Button className="w-fit">Create</Button>
        </Link>
      </div>

      <div className="flex flex-col gap-2 mt-5">
        {(data?.agentProfiles || []).map(({ _id, org, role, orgId }) => (
          <div key={_id} className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="font-bold capitalize">{org?.name}</span>
              <span className="text-xs text-gray-500">({role})</span>
            </div>

            <Link href={`/app/orgs/${orgId}`}>
              <ArrowRight />
            </Link>
          </div>
        ))}
        {(data?.contacts || []).map(({ _id, org, agent }) => (
          <div key={_id} className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-base font-bold capitalize">
                {org?.name}
              </span>
              <span className="text-xs text-gray-500">{`(contact of ${agent?.username})`}</span>
            </div>

            {/* <Link href={`/app/contacts/${_id}`}>
              <ArrowRight />
            </Link> */}
          </div>
        ))}
      </div>
    </div>
  )
}

export default Page
