import { useEffect, useState } from "react"
import { useSnackbar } from "notistack"

type Data = {
  lat: number
  lng: number
}

export default function useGetCurrentPosition() {
  const [location, setLocation] = useState<Data | null>(null)
  const [loading, setLoading] = useState(true)

  const { enqueueSnackbar } = useSnackbar()

  /**
   * Get current location by Geolocation API.
   */
  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      async ({ coords }) => {
        setLoading(false)

        setLocation({
          lat: coords.latitude,
          lng: coords.longitude,
        })
      },
      (error) => {
        let message = ""

        switch (error.code) {
          case error.PERMISSION_DENIED:
            message = "User denied the request for Geolocation."
            break
          case error.POSITION_UNAVAILABLE:
            message = "Location information is unavailable."
            break
          case error.TIMEOUT:
            message = "The request to get user location timed out."
            break
        }

        setLoading(false)

        enqueueSnackbar(message)
      }
    )
  }, [enqueueSnackbar])

  return {
    location,
    loading,
  }
}
