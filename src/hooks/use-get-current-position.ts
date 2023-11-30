import { useEffect, useState } from "react"
import { useSnackbar } from "notistack"

type Data = {
  city: string
  state: string
  country: string
}

export default function useGetCurrentPosition() {
  const [data, setData] = useState<Data | null>(null)
  const [loading, setLoading] = useState(true)

  const { enqueueSnackbar } = useSnackbar()

  /**
   * Get current location by Geolocation API.
   */
  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      async ({ coords }) => {
        const request = await fetch(
          `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${coords.latitude}&longitude=${coords.longitude}`
        )

        const response = await request.json()

        setLoading(false)

        setData({
          city: response.city,
          state: response.principalSubdivision,
          country: response.countryCode,
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

  console.log({ loading, data })

  return {
    data,
    loading,
  }
}
