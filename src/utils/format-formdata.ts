export const formatFormdata = (fields: any) => {
  const formData = new FormData()

  Object.entries(fields).forEach(([key, value]) => {
    formData.append(key, String(value))
  })

  return formData
}
