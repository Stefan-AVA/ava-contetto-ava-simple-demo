"use client"

import { useMemo } from "react"
import { Route } from "next"
import Link from "next/link"
import { useParams, usePathname } from "next/navigation"
import { Breadcrumbs, Typography } from "@mui/material"

const breadcrumbNameMap: { [key: string]: string } = {
  "/contacts": "Contacts",
  "/contacts/contact_id": "Contact",
  "/contacts/contact_id/saved-searches": "Saved Searches",
  "/contacts/contact_id/saved-searches/search_id": "Saved Search",
}

interface IBreadcrumb {
  initialPosition: number
}

export default function Breadcrumb({ initialPosition }: IBreadcrumb) {
  const params = useParams()

  const pathname = usePathname()

  const pathnames = pathname.split("/").filter((x) => x)

  const sliceRoute = pathnames.slice(initialPosition)
  const initialRoute = pathnames.slice(0, initialPosition)

  const replaceWithParams = useMemo(() => {
    return sliceRoute.map((route) => {
      const findParam = Object.entries(params).find(
        ([_, value]) => value === route
      )

      if (findParam && findParam.length > 0) return findParam[0]

      return route
    })
  }, [params, sliceRoute])

  console.log({ replaceWithParams })

  return (
    <Breadcrumbs aria-label="breadcrumb">
      {replaceWithParams.map((_, index) => {
        const last = index === pathnames.length - 1
        const href = `/${sliceRoute.slice(0, index + 1).join("/")}`

        const name = `/${replaceWithParams.slice(0, index + 1).join("/")}`

        return last ? (
          <Typography color="text.primary" key={href}>
            {breadcrumbNameMap[name]}
          </Typography>
        ) : (
          <Link href={`/${initialRoute.join("/")}${href}` as Route} key={href}>
            {breadcrumbNameMap[name]}
          </Link>
        )
      })}
    </Breadcrumbs>
  )
}
