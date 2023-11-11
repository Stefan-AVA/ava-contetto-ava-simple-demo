import Image from "next/image"
import {
  Bath,
  BedDouble,
  Calendar,
  MapPin,
  PhoneCall,
  Table2,
} from "lucide-react"

const images = [
  "/assets/gallery-house-1.jpg",
  "/assets/gallery-house-2.jpg",
  "/assets/gallery-house-3.jpg",
  "/assets/gallery-house-4.jpg",
  "/assets/gallery-house-5.jpg",
]

export default function House() {
  return (
    <div className="flex flex-col border border-solid border-gray-300 rounded-xl p-4">
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <div className="flex flex-col col-span-2">
          <div className="flex flex-col gap-3">
            <Image
              src="/assets/banner-house.jpg"
              alt=""
              width={980}
              height={452}
              className="rounded-xl w-full object-cover"
            />

            <div className="grid grid-cols-3 gap-3 md:grid-cols-5">
              {images.map((image) => (
                <Image
                  key={image}
                  src={image}
                  alt=""
                  width={186}
                  height={152}
                  className="rounded-lg w-full object-cover"
                />
              ))}
            </div>
          </div>

          <div className="flex flex-col py-4 px-3 md:p-8">
            <h1 className="text-4xl font-medium text-gray-800">$250,000</h1>

            <p className="flex flex-col mt-3 mb-6 gap-3 text-xl text-gray-700 md:items-center md:flex-row">
              <MapPin />
              2520 Wark St Victoria, BC V9T 5G6
            </p>

            <div className="flex flex-col gap-4 md:flex-row md:items-center">
              <span className="flex items-center rounded-lg bg-gray-200 py-2 px-3 gap-2 font-medium text-gray-600">
                <Table2 size={20} />
                2000 sq ft
              </span>

              <span className="flex items-center rounded-lg bg-gray-200 py-2 px-3 gap-2 font-medium text-gray-600">
                <BedDouble size={20} />2 Beds
              </span>

              <span className="flex items-center rounded-lg bg-gray-200 py-2 px-3 gap-2 font-medium text-gray-600">
                <Bath size={20} />2 Baths
              </span>
            </div>

            <h2 className="mt-8 mb-4 font-medium text-2xl">
              Property Information
            </h2>

            <p className="text-gray-500">
              This charming 3-bedroom, 2-bathroom home is located in a quiet,
              family-friendly neighborhood. It is the perfect place to call
              home, with its spacious layout, updated finishes, and private
              backyard. As you enter the home, you are greeted by a bright and
              airy living room with hardwood floors and a cozy fireplace. The
              perfect place to relax and unwind after a long day, the living
              room opens to the dining room, which is perfect for entertaining
              guests.
            </p>
          </div>
        </div>

        <div className="flex flex-col gap-10">
          <div className="flex flex-col pt-4 pl-4 pr-6 pb-8 relative border border-solid border-blue-500 rounded-xl">
            <h3 className="font-medium text-gray-800">Property Tour</h3>

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
            <h3 className="font-medium text-gray-800">Agent Details</h3>

            <p className="mt-2 text-sm text-gray-500">
              Contact Ms. Ashely Black to discuss more about your potential new
              home.
            </p>

            <button
              type="button"
              className="py-2 px-3 font-medium rounded-lg bg-white absolute -bottom-6 mx-auto left-0 right-0 w-fit flex items-center gap-3 text-blue-500 border border-solid border-blue-500"
            >
              <PhoneCall />
              Contact Agent
            </button>
          </div>

          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2647.078123180155!2d-123.36259452355989!3d48.43584037127811!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x548f74807521b311%3A0x6f5e7ffceef9daec!2s2520%20Wark%20St%2C%20Victoria%2C%20BC%20V8T%205G6%2C%20Canad%C3%A1!5e0!3m2!1spt-BR!2sbr!4v1699661763423!5m2!1spt-BR!2sbr"
            style={{ border: 0 }}
            height={284}
            loading="lazy"
            className="w-full"
            referrerPolicy="no-referrer-when-downgrade"
            allowFullScreen
          ></iframe>
        </div>
      </div>
    </div>
  )
}
