export function nameInitials(name: string) {
  return name
    .split(" ")
    .slice(0, 2)
    .map((s) => s.charAt(0).toUpperCase())
    .join("")
}

export function nameToColor(name: string) {
  let hash = 0
  let i

  for (i = 0; i < name.length; i += 1) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash)
  }

  let color = "#"

  for (i = 0; i < 3; i += 1) {
    const value = (hash >> (i * 8)) & 0xff

    color += `00${value.toString(16)}`.slice(-2)
  }

  return color
}
