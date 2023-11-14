"use client"

import Image from "next/image"
import { useRouter } from "next/navigation"
import { clearToken } from "@/redux/fetchAuthQuery"
import { RootState } from "@/redux/store"
import { nameInitials } from "@/utils/sting"
import { useSelector } from "react-redux"

const Menu = () => {
  const { push } = useRouter()

  const user = useSelector((state: RootState) => state.app.user)

  const options = [
    {
      label: "Profile",
      action: () => {
        push("/app/profile")
      },
    },
    {
      label: "Organizations",
      action: () => {
        push("/app/orgs")
      },
    },
    {
      label: "Logout",
      action: () => {
        clearToken()
        push("/")
      },
    },
  ]

  return (
    <div className="group relative">
      <button
        type="button"
        className="flex items-center justify-center border border-solid border-gray-300 rounded-full p-0.5 w-12 h-12 md:w-16 md:h-16"
      >
        {user?.image ? (
          <Image
            src={user.image}
            alt=""
            width={60}
            height={60}
            className="object-cover rounded-full"
          />
        ) : (
          <span>{nameInitials(user?.name || user?.username || "U")}</span>
        )}
      </button>
      <div className="flex flex-col gap-2 opacity-0 absolute transition-all duration-300 bg-white shadow-2xl shadow-blue-800/20 p-2 rounded-lg top-10 w-60 right-0 z-20 pointer-events-none group-focus-within:opacity-100 group-focus-within:pointer-events-auto group-focus-within:top-20">
        {options.map(({ label, action }) => (
          <button
            key={label}
            type="button"
            onClick={action}
            className="py-1 px-2 text-left text-gray-500 transition-all duration-300 rounded hover:bg-gray-200 hover:text-gray-600"
          >
            {label}
          </button>
        ))}
      </div>
    </div>
  )
}

export default Menu
