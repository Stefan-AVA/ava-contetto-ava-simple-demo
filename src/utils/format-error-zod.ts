import type { ZodError } from "zod"

export default function formatErrorZodMessage<T = {}>(error: ZodError<T>) {
  const err = error.format()

  const response = {} as Record<keyof T, string>

  Object.entries(err).forEach(([key, value]) => {
    if (key === "_errors") return

    console.log({ value })

    response[key as keyof T] = value._errors[0]
  })

  return response
}
