export default function reduce(text: string, length = 32) {
  return text.length > length ? `${text.substring(0, length)}...` : text
}
