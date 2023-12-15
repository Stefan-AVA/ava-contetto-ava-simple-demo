"use client"

import { useEffect, useMemo, type PropsWithChildren } from "react"
import { useParams, usePathname } from "next/navigation"
import { useLazyGetAllRoomsQuery } from "@/redux/apis/room"
import type { RootState } from "@/redux/store"
import { Box, Stack } from "@mui/material"
import { LayoutDashboardIcon, Search } from "lucide-react"
import { useSelector } from "react-redux"

import Sidebar from "@/components/sidebar"
import WhiteLabelWrapper from "@/components/white-label-wrapper"

export default function Layout({ children }: PropsWithChildren) {
  const pathName = usePathname()

  const { contactId } = useParams()

  const contactOrgs = useSelector((state: RootState) => state.app.contactOrgs)

  const [getAllRooms, { isLoading }] = useLazyGetAllRoomsQuery()

  const contact = useMemo(
    () => contactOrgs.find((contact) => contact._id === contactId),
    [contactId, contactOrgs]
  )

  useEffect(() => {
    if (contact) getAllRooms({ orgId: contact.orgId, contactId: contact._id })
  }, [contact])

  const routes = useMemo(
    () => [
      {
        label: "Search",
        path: `/app/contact-orgs/${contactId}`,
        icon: <LayoutDashboardIcon />,
        active: pathName === `/app/contact-orgs/${contactId}`,
      },
      {
        label: "My Searches",
        path: `/app/contact-orgs/${contactId}/search-results`,
        icon: <Search />,
        active: pathName.includes("search-results"),
      },
    ],
    [pathName, contactId]
  )

  const hasWhiteLabelDefined = contact?.org?.whiteLabel

  return (
    <WhiteLabelWrapper whiteLabel={hasWhiteLabelDefined}>
      <Stack
        padding={{ xs: 1, md: 0 }}
        spacing={{ xs: 2, md: 0 }}
        direction={{ xs: "column", md: "row" }}
      >
        <Sidebar routes={routes} roomsLoading={isLoading} />

        <Box
          sx={{
            p: { xs: 1, md: 5 },
            width: "100%",
            height: { xs: "calc(100vh - 11rem)", md: "calc(100vh - 4rem)" },
            overflowY: "auto",
            overflowX: "hidden",
          }}
        >
          {children}
        </Box>
      </Stack>
    </WhiteLabelWrapper>
  )
}
