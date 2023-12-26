"use client"

import { useMemo } from "react"
import { Route } from "next"
import Link from "next/link"
import { useParams, usePathname } from "next/navigation"
import { Breadcrumbs, Typography } from "@mui/material"

type BreadcrumbOption = {
  link: boolean
  label: string
  hidden?: boolean
}

type BreadcrumbPaths = Record<string, BreadcrumbOption>

const breadcrumbNameMap: BreadcrumbPaths = {
  "/search-results": { label: "My Searches", link: true },
  "/search-results/searchId": { label: "Search", link: true },
  "/search-results/searchId/properties": { label: "Properties", link: false },
  "/search-results/searchId/properties/propertyId": {
    link: true,
    label: "Property",
    hidden: true,
  },
  "/contacts": { label: "Contacts", link: true },
  "/contacts/contact_id": { label: "Contact", link: true },
  "/contacts/contact_id/saved-searches": {
    label: "Saved Searches",
    link: true,
  },
  "/contacts/contact_id/saved-searches/search_id": {
    label: "Saved Search",
    link: true,
  },
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

  const isAvailable = useMemo(() => {
    const find = replaceWithParams.filter((_, index) => {
      const name = `/${replaceWithParams.slice(0, index + 1).join("/")}`

      const getBreadcrumbMap = Object.keys(breadcrumbNameMap).findIndex(
        (key) => {
          if (key === name) return true

          return false
        }
      )

      if (getBreadcrumbMap === -1) return false

      const breadcrumb = Object.values(breadcrumbNameMap)[getBreadcrumbMap]

      return !breadcrumb.hidden
    })

    return replaceWithParams.length === find.length
  }, [replaceWithParams])

  if (!isAvailable) return null

  return (
    <Breadcrumbs aria-label="breadcrumb">
      {replaceWithParams.map((_, index) => {
        const last = index === sliceRoute.length - 1
        const href = `/${sliceRoute.slice(0, index + 1).join("/")}`

        const name = `/${replaceWithParams.slice(0, index + 1).join("/")}`

        if (!breadcrumbNameMap[name]) return null

        return last ? (
          <Typography
            sx={{ color: "secondary.main", fontWeight: 600 }}
            key={href}
          >
            {breadcrumbNameMap[name]?.label}
          </Typography>
        ) : breadcrumbNameMap[name]?.link ? (
          <Link href={`/${initialRoute.join("/")}${href}` as Route} key={href}>
            {breadcrumbNameMap[name]?.label}
          </Link>
        ) : (
          <Typography key={href}>{breadcrumbNameMap[name]?.label}</Typography>
        )
      })}
    </Breadcrumbs>
  )
}
