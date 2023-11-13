"use client"

import { PropsWithChildren, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useGetMeQuery } from "@/redux/apis/auth"
import { logout } from "@/redux/slices/app"
import { useAppDispatch } from "@/redux/store"

const AuthLayout = ({ children }: PropsWithChildren) => {
  const { replace } = useRouter()
  const dispatch = useAppDispatch()

  const { isError } = useGetMeQuery()

  useEffect(() => {
    if (isError) {
      dispatch(logout())
      replace("/")
    }
  }, [dispatch, isError])

  return <>{children}</>
}

export default AuthLayout
