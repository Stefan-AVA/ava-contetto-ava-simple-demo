import { Route } from "next"
import Image from "next/image"
import Link from "next/link"
import { Bath, BedDouble, Mic, Search, Table2 } from "lucide-react"

const houses = [
  "/assets/house-1.jpg",
  "/assets/house-2.jpg",
  "/assets/house-3.jpg",
  "/assets/house-4.jpg",
  "/assets/house-5.jpg",
  "/assets/house-6.jpg",
  "/assets/house-7.jpg",
  "/assets/house-8.jpg",
]

export default function App() {
  return (
    <div className="flex flex-col">
      <div className="flex flex-col gap-9 max-w-3xl mx-auto w-full">
        <h1 className="text-4xl font-medium text-gray-800">
          {"Let's start exploring"}
        </h1>

        <div className="flex py-4 rounded-full text-gray-400 bg-gray-200">
          <div className="py-2 pl-5 mr-3 text-gray-800">
            <Search size={20} />
          </div>

          <input
            className="text-sm w-full h-auto font-medium bg-transparent text-gray-800 outline-none placeholder:text-gray-400"
            placeholder="Type in your search criteria"
          />

          <div className="py-2 pr-6 pl-4 ml-4 border-l border-solid border-l-gray-400/20">
            <Mic size={20} />
          </div>
        </div>
      </div>

      <div className="grid gap-8 mt-16 grid-cols-1 md:mt-28 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {houses.map((house) => (
          <Link
            key={house}
            href={"/1" as Route}
            className="border border-solid border-gray-300 rounded-xl"
          >
            <Image
              src={house}
              alt=""
              width={276}
              height={166}
              className="w-full object-cover rounded-t-xl"
            />

            <div className="flex flex-col p-3">
              <h3 className="text-xl font-medium text-gray-800">$250,000</h3>

              <div className="flex items-center gap-6 mt-2 mb-4">
                <span className="flex items-center gap-1 text-xs text-gray-500">
                  <BedDouble size={16} />2 Beds
                </span>

                <span className="flex items-center gap-1 text-xs text-gray-500">
                  <Bath size={16} />2 Baths
                </span>

                <span className="flex items-center gap-1 text-xs text-gray-500">
                  <Table2 size={16} />
                  2000 sq ft
                </span>
              </div>

              <p className="text-sm text-gray-800">
                2520 Wark St Victoria, BC V9T 5G6
              </p>
            </div>

            <p className="p-3 text-blue-500 flex items-center justify-center w-full border-t border-solid border-t-gray-300">
              View Listing
            </p>
          </Link>
        ))}
      </div>
    </div>
  )
}
