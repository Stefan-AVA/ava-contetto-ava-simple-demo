export function parseError(err: any): string {
  if (err.data && err.data.msg) {
    return err.data.msg
  }

  return "unknown error: check server"
}
