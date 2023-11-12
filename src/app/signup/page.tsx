import Image from "next/image"
import Link from "next/link"
import Background from "~/assets/signup-background.jpg"

import Form from "./form"

export default function Signup() {
  return (
    <div className="flex min-h-screen h-full">
      <Image
        src={Background}
        alt=""
        className="w-1/2 min-h-screen object-cover"
      />

      <div className="flex py-20 px-40 flex-col items-center w-full">
        <h1 className="text-3xl font-bold text-gray-800">
          Create your account
        </h1>

        <p className="text-md mt-1 text-gray-600">
          Enter the answer for following fields and get started
        </p>

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

        <Form />

        <p className="text-sm text-gray-700 mt-20 text-center">
          Already have an account?{" "}
          <Link href="/" className="font-bold text-blue-500">
            Sign In
          </Link>{" "}
          to your account.
        </p>
      </div>
    </div>
  )
}
