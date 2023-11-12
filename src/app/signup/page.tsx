import Link from "next/link"
import AuthLayout from "@/layouts/auth"

import Form from "./form"

export default function Signup() {
  return (
    <AuthLayout
      title="Create your account"
      description="Enter the answer for following fields and get started"
    >
      <Form />

      <p className="text-sm text-gray-700 mt-20 text-center">
        Already have an account?{" "}
        <Link href="/" className="font-bold text-blue-500">
          Sign In
        </Link>{" "}
        to your account.
      </p>
    </AuthLayout>
  )
}
