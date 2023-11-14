"use client"

import { PropsWithChildren, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useGetMeQuery } from "@/redux/apis/auth"
import { logout } from "@/redux/slices/app"
import { useAppDispatch } from "@/redux/store"

const AuthLayout = ({ children }: PropsWithChildren) => {
  const { replace } = useRouter()
  const dispatch = useAppDispatch()

  const { isLoading, isError } = useGetMeQuery()

  useEffect(() => {
    if (!isLoading && isError) {
      dispatch(logout())
      replace("/")
    }
  }, [dispatch, isLoading, isError])

  return <>{children}</>
}

export default AuthLayout
