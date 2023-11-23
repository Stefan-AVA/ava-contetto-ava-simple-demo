import { differenceInMilliseconds, formatDistance } from "date-fns"

export const getDatefromUnix = (timeStamp?: number) => {
  if (!timeStamp) return ""
  return new Date(timeStamp * 1000).toDateString()
}

export const getTimeDifference = (
  unixTime: number,
  currentTimestamp = Date.now()
) => {
  const pastTimestamp = unixTime * 1000

  const timeDifference = differenceInMilliseconds(
    currentTimestamp,
    pastTimestamp
  )

  const intervals = [
    { label: "year", divisor: 31536000000 }, // 1 year = 365 days * 24 hours * 60 minutes * 60 seconds * 1000 milliseconds
    { label: "month", divisor: 2629800000 }, // 1 month = (365 days / 12 months) * 24 hours * 60 minutes * 60 seconds * 1000 milliseconds
    { label: "day", divisor: 86400000 }, // 1 day = 24 hours * 60 minutes * 60 seconds * 1000 milliseconds
    { label: "hour", divisor: 3600000 }, // 1 hour = 60 minutes * 60 seconds * 1000 milliseconds
    { label: "minute", divisor: 60000 }, // 1 minute = 60 seconds * 1000 milliseconds
    { label: "second", divisor: 1000 }, // 1 second = 1000 milliseconds
  ]

  for (const { label, divisor } of intervals) {
    const value = Math.floor(timeDifference / divisor)
    if (value >= 1) {
      return formatDistance(currentTimestamp, pastTimestamp, {
        addSuffix: true,
      })
    }
  }

  return "Just before" // If the time difference is less than a second
}
