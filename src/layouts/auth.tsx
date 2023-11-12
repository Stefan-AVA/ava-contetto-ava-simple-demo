import type { PropsWithChildren } from "react"
import Image from "next/image"
import Background from "~/assets/signup-background.jpg"

interface AuthLayoutProps extends PropsWithChildren {
  title: string
  description?: string
}

export default function AuthLayout({
  title,
  children,
  description,
}: AuthLayoutProps) {
  return (
    <div className="flex flex-col min-h-screen h-full lg:flex-row">
      <Image
        src={Background}
        alt=""
        className="w-full h-96 object-cover lg:h-full lg:min-h-screen lg:w-1/2"
      />

      <div className="flex px-6 py-10 flex-col items-center w-full md:p-20 lg:w-1/2 2xl:px-40">
        <h1 className="text-3xl font-bold text-gray-800">{title}</h1>

        {description && (
          <p className="text-md mt-1 text-gray-600">{description}</p>
        )}

        <button
          type="button"
          className="flex gap-3 my-6 items-center text-gray-800 justify-center border border-solid border-gray-300 rounded py-2.5 px-4 w-full"
        >
          <Image src="/assets/logo-google.svg" alt="" width={24} height={24} />
          Sign up with Google
        </button>

        <div className="flex w-full items-center gap-6 mb-6">
          <span className="flex w-full h-px bg-gray-300" />

          <p className="text-sm text-gray-400">or</p>

          <span className="flex w-full h-px bg-gray-300" />
        </div>

        {children}
      </div>
    </div>
  )
}
