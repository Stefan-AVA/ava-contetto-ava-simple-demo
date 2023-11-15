"use client"

import Link from "next/link"
import { useGetOrgsQuery } from "@/redux/apis/org"
import { ArrowRight } from "lucide-react"

import Button from "@/components/button"
import Spinner from "@/components/spinner"

const Page = () => {
  const { data, isLoading } = useGetOrgsQuery()

  return (
    <div className="flex flex-col gap-6">
      <div className="flex w-full items-center justify-between">
        <h1 className="text-2xl font-medium text-blue-800">
          Your Organizations
        </h1>

        <Link href="/app/orgs/create">
          <Button className="w-fit">Create</Button>
        </Link>
      </div>

      {isLoading && (
        <div className="w-full flex justify-center">
          <Spinner variant="primary" />
        </div>
      )}

      {data && (
        <div className="flex flex-col gap-2">
          {(data.agentProfiles || []).map(({ _id, org, role, orgId }) => (
            <Link
              key={_id}
              href={`/app/orgs/${orgId}`}
              className="flex group items-center justify-between border border-solid border-gray-300 rounded-lg p-6"
            >
              <div className="flex items-center gap-2">
                <span className="font-bold capitalize">{org?.name}</span>
                <span className="text-xs text-gray-500">({role})</span>
              </div>

              <ArrowRight className="transition-colors duration-300 group-hover:text-cyan-500" />
            </Link>
          ))}

          {(data.contacts || []).map(({ _id, org, agent }) => (
            <div
              key={_id}
              className="flex items-center justify-between border border-solid border-gray-300 rounded-lg p-6"
            >
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
      )}
    </div>
  )
}

export default Page
