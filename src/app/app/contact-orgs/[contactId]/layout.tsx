"use client"

import { useMemo, type PropsWithChildren } from "react"
import { useParams, usePathname } from "next/navigation"
import type { RootState } from "@/redux/store"
import { Box, Stack } from "@mui/material"
import { FolderHeart, LayoutDashboardIcon, Search } from "lucide-react"
import { useSelector } from "react-redux"

import Sidebar from "@/components/sidebar"
import WhiteLabelWrapper from "@/components/white-label-wrapper"

export default function Layout({ children }: PropsWithChildren) {
  const pathName = usePathname()

  const { contactId } = useParams()

  const contactOrgs = useSelector((state: RootState) => state.app.contactOrgs)

  const contact = useMemo(
    () => contactOrgs.find((contact) => contact._id === contactId),
    [contactId, contactOrgs]
  )

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
      {
        path: `/app/contact-orgs/${contactId}/folders`,
        icon: <FolderHeart />,
        label: "Files",
        active: pathName.includes("folders"),
      },
    ],
    [pathName, contactId]
  )

  const hasWhiteLabelDefined = contact?.org?.whiteLabel

  const orgName = contact?.org?.name

  const isRoomPath = pathName.includes("/rooms/")

  return (
    <WhiteLabelWrapper whiteLabel={hasWhiteLabelDefined}>
      <Stack
        sx={{
          p: { xs: 1, md: 0 },
          gap: { xs: 2, md: 0 },
          flexDirection: { xs: "column", md: "row" },
        }}
      >
        <Sidebar routes={routes} orgName={orgName ?? ""} />

        <Box
          sx={{
            p: isRoomPath ? 0 : { xs: 1, md: 5 },
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
