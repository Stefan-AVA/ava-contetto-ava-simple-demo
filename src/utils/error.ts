export const parseError = (err: any) => {
  if (err.data && err.data.msg) {
    return err.data.msg
  }

  return "unknown error: check server"
}
