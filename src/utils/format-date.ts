export const getDatefromUnix = (timeStamp: number) => {
  return new Date(timeStamp * 1000).toDateString()
}
