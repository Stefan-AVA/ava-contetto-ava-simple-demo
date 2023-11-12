export default function formatMoney(
  value: number,
  options: Intl.NumberFormatOptions = {}
) {
  const { format } = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    ...options,
  })

  return format(value)
}
