import Link from "next/link"
import AuthLayout from "@/layouts/auth"

import Form from "./form"

export default function Auth() {
  return (
    <AuthLayout title="Login to your account">
      <Form />

      <p className="text-sm text-gray-700 mt-20 text-center">
        {"Don't have an account? "}
        <Link href="/signup" className="font-bold text-blue-500">
          Sign up
        </Link>{" "}
        your account.
      </p>
    </AuthLayout>
  )
}
