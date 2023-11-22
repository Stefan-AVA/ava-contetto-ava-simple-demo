"use client"

import "swiper/css"
import "swiper/css/pagination"

import { useMemo } from "react"
import Image from "next/image"
import Link from "next/link"
import { useGetPropertyQuery } from "@/redux/apis/search"
import { RootState } from "@/redux/store"
import formatMoney from "@/utils/format-money"
import {
  Box,
  CircularProgress,
  Unstable_Grid2 as Grid,
  Stack,
  Typography,
} from "@mui/material"
import {
  Bath,
  BedDouble,
  Calendar,
  MapPin,
  PhoneCall,
  Table2,
} from "lucide-react"
import { useSelector } from "react-redux"
import { Pagination } from "swiper/modules"
import { Swiper, SwiperSlide, type SwiperProps } from "swiper/react"

import PropertyPage from "@/components/PropertyPage"

const breakpoints: SwiperProps["breakpoints"] = {
  560: {
    slidesPerView: 3,
  },

  768: {
    slidesPerView: 5,
  },
}

type PageProps = {
  params: {
    agentId: string
    searchId: string
    propertyId: string
  }
}

export default function Property({ params }: PageProps) {
  const { agentId, searchId, propertyId } = params

  const agentOrgs = useSelector((state: RootState) => state.app.agentOrgs)
  const agentProfile = useMemo(
    () => agentOrgs.find((agent) => agent._id === agentId),
    [agentId, agentOrgs]
  )
  const { data, isLoading } = useGetPropertyQuery(
    { orgId: String(agentProfile?.orgId), searchId, propertyId },
    { skip: !agentProfile }
  )

  return (
    <PropertyPage
      orgId={String(agentProfile?.orgId)}
      agentId={agentId}
      searchId={searchId}
      data={data?.property}
      isLoading={isLoading}
    />
  )
}
