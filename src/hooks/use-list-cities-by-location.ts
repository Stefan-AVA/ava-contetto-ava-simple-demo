import { useEffect, useState } from "react"
import { useLazyNearestCitiesQuery } from "@/redux/apis/city"

import type { ICity } from "@/types/city.types"

import useGetCurrentPosition from "./use-get-current-position"

export default function useListCitiesByLocation() {
  const [cities, setCities] = useState<ICity[]>([])

  const { location } = useGetCurrentPosition()

  const [getNearestCities, { isFetching }] = useLazyNearestCitiesQuery()

  useEffect(() => {
    if (location) {
      console.log({ location })

      const fetchCitiesByLocation = async () => {
        const cities = await getNearestCities({
          lat: location.lat,
          lng: location.lng,
        }).unwrap()

        setCities(cities)
      }

      fetchCitiesByLocation()
    }
  }, [location, getNearestCities])

  return {
    cities,
    isLoading: isFetching,
  }
}
