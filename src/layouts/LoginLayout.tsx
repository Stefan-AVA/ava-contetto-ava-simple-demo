"use client"

import { PropsWithChildren, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useGetMeQuery } from "@/redux/apis/auth"
import { setUser } from "@/redux/slices/app"
import { useAppDispatch } from "@/redux/store"

const LoginLayout = ({ children }: PropsWithChildren) => {
  const { replace } = useRouter()
  const dispatch = useAppDispatch()

  const { data: user, isLoading, isError } = useGetMeQuery()

  useEffect(() => {
    if (user && !isLoading) {
      dispatch(setUser(user))
      replace("/app")
    }
  }, [user, isLoading, isError])

  return <>{children}</>
}

export default LoginLayout
