"use client"

import { PropsWithChildren, useCallback, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useLazyGetMeQuery } from "@/redux/apis/auth"
import { setUser } from "@/redux/slices/app"
import { useAppDispatch } from "@/redux/store"

const LoginLayout = ({ children }: PropsWithChildren) => {
  const { replace } = useRouter()
  const dispatch = useAppDispatch()

  const [getme] = useLazyGetMeQuery()

  const checkAuth = useCallback(async () => {
    try {
      const user = await getme().unwrap()

      dispatch(setUser(user))
      replace("/app")
    } catch (error) {}
  }, [getme, dispatch, replace])

  useEffect(() => {
    checkAuth()
  }, [])

  return <>{children}</>
}

export default LoginLayout
