export const nameInitials = (st: string) => {
  return st
    .split(" ")
    .map((s) => s.charAt(0).toUpperCase())
    .join("")
}
