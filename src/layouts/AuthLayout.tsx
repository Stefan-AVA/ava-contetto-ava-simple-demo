"use client"

import { PropsWithChildren, useCallback, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useLazyGetMeQuery } from "@/redux/apis/auth"
import { logout } from "@/redux/slices/app"
import { useAppDispatch } from "@/redux/store"

const AuthLayout = ({ children }: PropsWithChildren) => {
  const { replace } = useRouter()
  const dispatch = useAppDispatch()

  const [getme] = useLazyGetMeQuery()

  const checkAuth = useCallback(async () => {
    try {
      const me = await getme().unwrap()
    } catch (error) {
      dispatch(logout())
      replace("/")
    }
  }, [getme, dispatch, replace])

  useEffect(() => {
    checkAuth()
  }, [])

  return <>{children}</>
}

export default AuthLayout
