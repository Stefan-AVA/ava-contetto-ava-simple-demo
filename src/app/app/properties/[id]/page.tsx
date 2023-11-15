"use client"

import "swiper/css"
import "swiper/css/pagination"

import { useMemo } from "react"
import Image from "next/image"
import Link from "next/link"
import { useGetListingQuery } from "@/redux/apis/search"
import formatMoney from "@/utils/format-money"
import {
  Bath,
  BedDouble,
  Calendar,
  MapPin,
  PhoneCall,
  Table2,
} from "lucide-react"
import { Pagination } from "swiper/modules"
import { Swiper, SwiperSlide, type SwiperProps } from "swiper/react"

import Spinner from "@/components/spinner"

const breakpoints: SwiperProps["breakpoints"] = {
  560: {
    slidesPerView: 3,
  },

  768: {
    slidesPerView: 5,
  },
}

type PageProps = {
  params: {
    id: string
  }
}

const Property = ({ params }: PageProps) => {
  const { data, isLoading } = useGetListingQuery({ id: params.id })

  const media = useMemo(() => {
    if (data) {
      const banner = data.Media[0].MediaURL
      const images = data.Media.slice(1).map(({ MediaURL }) => MediaURL)

      return {
        banner,
        images,
      }
    }

    return {
      banner: "",
      images: [],
    }
  }, [data])

  return (
    <div className="flex flex-col items-center justify-center border border-solid border-gray-300 rounded-xl p-4">
      {isLoading && (
        <div className="py-20">
          <Spinner variant="primary" />
        </div>
      )}

      {data && (
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
          <div className="flex flex-col col-span-2">
            <div className="flex flex-col gap-3">
              {media.banner && (
                <Image
                  src={media.banner}
                  alt=""
                  width={980}
                  height={452}
                  className="rounded-xl w-full object-cover h-[28.25rem]"
                />
              )}

              <Swiper
                modules={[Pagination]}
                className="w-full"
                pagination={{
                  clickable: true,
                }}
                grabCursor
                breakpoints={breakpoints}
                spaceBetween={12}
                slidesPerView={2}
              >
                {media.images.map((image) => (
                  <SwiperSlide key={image} className="w-fit">
                    <Image
                      src={image}
                      alt=""
                      width={186}
                      height={160}
                      className="rounded-lg w-full object-cover h-40"
                    />
                  </SwiperSlide>
                ))}
              </Swiper>
            </div>

            <div className="flex flex-col py-4 px-3 md:p-8">
              <h1 className="text-4xl font-medium text-blue-800">
                {formatMoney(data.ListPrice || data.ClosePrice)}
              </h1>

              <p className="flex flex-col mt-3 mb-6 gap-3 text-xl text-gray-700 md:items-center md:flex-row">
                <MapPin />
                {data.UnparsedAddress}
              </p>

              <div className="flex flex-col gap-4 md:flex-row md:items-center">
                {data.VIVA_AdditionalRentSqFt && (
                  <span className="flex items-center rounded-lg bg-gray-200 py-2 px-3 gap-2 font-medium text-gray-600">
                    <Table2 size={20} />
                    {`${data.VIVA_AdditionalRentSqFt} sq ft`}
                  </span>
                )}

                {data.BedroomsTotal > 0 && (
                  <span className="flex items-center rounded-lg bg-gray-200 py-2 px-3 gap-2 font-medium text-gray-600">
                    <BedDouble size={20} />
                    {`${data.BedroomsTotal} Beds`}
                  </span>
                )}

                {data.BathroomsTotalInteger > 0 && (
                  <span className="flex items-center rounded-lg bg-gray-200 py-2 px-3 gap-2 font-medium text-gray-600">
                    <Bath size={20} />
                    {`${data.BathroomsTotalInteger} Baths`}
                  </span>
                )}
              </div>

              {data.PublicRemarks && (
                <>
                  <h2 className="mt-8 mb-4 font-medium text-2xl">
                    Property Information
                  </h2>

                  <p className="text-gray-500">{data.PublicRemarks}</p>
                </>
              )}
            </div>
          </div>

          <div className="flex flex-col gap-10">
            <div className="flex flex-col pt-4 pl-4 pr-6 pb-8 relative border border-solid border-blue-500 rounded-xl">
              <h3 className="font-medium text-blue-800">Property Tour</h3>

              <p className="mt-2 text-sm text-gray-500">
                If you want to tour property then feel free to schedule from the
                calendar. Now you can book as early as 9:00 AM
              </p>

              <button
                type="button"
                className="py-2 px-3 font-medium rounded-lg bg-white absolute -bottom-6 mx-auto left-0 right-0 w-fit flex items-center gap-3 text-blue-500 border border-solid border-blue-500"
              >
                <Calendar />
                Schedule a tour
              </button>
            </div>

            <div className="flex flex-col pt-4 pl-4 pr-6 pb-8 relative border border-solid border-blue-500 rounded-xl">
              <h3 className="font-medium text-blue-800">Agent Details</h3>

              <p className="mt-2 text-sm text-gray-500">
                {`Contact ${data.ListOfficeAOR} to discuss more about your potential
                new home.`}
              </p>

              <Link
                href={`tel:${data.ListAgentOfficePhone}`}
                className="py-2 px-3 font-medium rounded-lg bg-white absolute -bottom-6 mx-auto left-0 right-0 w-fit flex items-center gap-3 text-blue-500 border border-solid border-blue-500"
              >
                <PhoneCall />
                Contact Agent
              </Link>
            </div>

            <iframe
              src={`//maps.google.com/maps?q=${data.Latitude},${data.Longitude}&z=15&output=embed`}
              style={{ border: 0 }}
              height={284}
              loading="lazy"
              className="w-full"
              referrerPolicy="no-referrer-when-downgrade"
              allowFullScreen
            ></iframe>
          </div>
        </div>
      )}
    </div>
  )
}

export default Property
