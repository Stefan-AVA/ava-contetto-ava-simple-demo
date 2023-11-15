"use client"

import { useEffect } from "react"
import { Route } from "next"
import Image from "next/image"
import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import { useLazySearchQuery } from "@/redux/apis/search"
import formatMoney from "@/utils/format-money"
import { zodResolver } from "@hookform/resolvers/zod"
import { Bath, BedDouble, Mic, Search, Send, Table2 } from "lucide-react"
import { FormProvider, useForm } from "react-hook-form"
import { z } from "zod"

import Spinner from "@/components/spinner"

const schema = z.object({
  search: z.string().optional(),
})

type FormSchema = z.infer<typeof schema>

const Page = () => {
  const { push } = useRouter()
  const searchParams = useSearchParams()
  const search = searchParams.get("search")

  const methods = useForm<FormSchema>({
    resolver: zodResolver(schema),
    values: {
      search: search || "",
    },
  })

  const [searchListings, { data, isLoading, isFetching }] = useLazySearchQuery()

  useEffect(() => {
    if (search) {
      searchListings({ search: search || "" })
    }
  }, [])

  const onSearch = async ({ search }: FormSchema) => {
    await searchListings({ search })
    push(search ? `/app?search=${search}` : "/app")
  }

  return (
    <div className="flex flex-col">
      <div className="flex flex-col gap-9 max-w-3xl mx-auto w-full">
        <h1 className="text-4xl font-medium text-blue-800">
          {"Let's start exploring"}
        </h1>

        <FormProvider {...methods}>
          <form
            onSubmit={methods.handleSubmit(onSearch)}
            className="flex py-4 rounded-full text-blue-300 bg-gray-200"
          >
            <div className="py-2 pl-5 mr-3 text-blue-800">
              <Search size={20} />
            </div>

            <input
              {...methods.register("search")}
              className="text-sm w-full h-auto font-medium bg-transparent text-blue-800 outline-none placeholder:text-blue-300"
              placeholder="Type in your search criteria"
            />

            <div className="py-2 pr-6 pl-4 ml-4 flex items-center gap-4 border-l border-solid border-l-gray-400/20">
              {/* <Mic size={20} /> */}

              {(isLoading || isFetching) && <Spinner variant="primary" />}

              {!(isFetching || isLoading) && (
                <button type="submit">
                  <Send
                    size={20}
                    className="text-cyan-500 transition-colors hover:text-cyan-600"
                  />
                </button>
              )}
            </div>
          </form>
        </FormProvider>
      </div>

      {data && (
        <div className="grid gap-8 mt-16 grid-cols-1 md:mt-28 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {data.map(
            ({
              _id,
              Media,
              ListPrice,
              ClosePrice,
              BedroomsTotal,
              UnparsedAddress,
              BathroomsTotalInteger,
              VIVA_AdditionalRentSqFt,
            }) => {
              const findMedia = Media.find(({ MediaURL }) => MediaURL)

              return (
                <Link
                  key={_id}
                  href={`/app/properties/${_id}` as Route}
                  className="border border-solid border-gray-300 rounded-xl"
                >
                  {findMedia && (
                    <Image
                      src={findMedia.MediaURL}
                      alt=""
                      width={276}
                      height={166}
                      className="w-full object-cover rounded-t-xl h-60"
                    />
                  )}

                  <div className="flex flex-col p-3">
                    <h3 className="text-xl font-medium text-blue-800">
                      {formatMoney(ListPrice || ClosePrice)}
                    </h3>

                    <div className="flex items-center gap-6 mt-2 mb-4">
                      {BedroomsTotal > 0 && (
                        <span className="flex items-center gap-1 text-xs text-gray-500">
                          <BedDouble size={16} />
                          {`${BedroomsTotal} Beds`}
                        </span>
                      )}

                      {BathroomsTotalInteger > 0 && (
                        <span className="flex items-center gap-1 text-xs text-gray-500">
                          <Bath size={16} />
                          {`${BathroomsTotalInteger} Baths`}
                        </span>
                      )}

                      {VIVA_AdditionalRentSqFt && (
                        <span className="flex items-center gap-1 text-xs text-gray-500">
                          <Table2 size={16} />
                          {`${VIVA_AdditionalRentSqFt} sq ft`}
                        </span>
                      )}
                    </div>

                    <p className="text-sm text-blue-800">{UnparsedAddress}</p>
                  </div>

                  <p className="p-3 text-blue-500 flex items-center justify-center w-full border-t border-solid border-t-gray-300">
                    View Listing
                  </p>
                </Link>
              )
            }
          )}
        </div>
      )}
    </div>
  )
}

export default Page
