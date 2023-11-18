"use client"

import {
  forwardRef,
  useState,
  type ChangeEvent,
  type ComponentProps,
} from "react"
import Image from "next/image"
import { cn } from "@/utils/classname"
import { Plus, UserCircle2 } from "lucide-react"

interface UploadProps extends ComponentProps<"input"> {
  error?: string
}

export const Upload = forwardRef<HTMLInputElement, UploadProps>(
  ({ error, className, ...rest }, ref) => {
    const [preview, setPreview] = useState<string | null>(null)

    function onChange(e: ChangeEvent<HTMLInputElement>) {
      const file = e.target.files?.[0]

      if (!file) {
        setPreview(null)

        return
      }

      if (rest.onChange) rest.onChange(e)

      setPreview(URL.createObjectURL(file))
    }

    return (
      <div
        className={cn("flex w-fit flex-col cursor-pointer relative", className)}
      >
        <div className="flex flex-col items-center justify-center pointer-events-none bg-gray-300 w-28 h-28 rounded-full aspect-square relative">
          {preview && (
            <Image
              src={preview}
              alt=""
              fill
              className="w-full h-full object-cover rounded-full pointer-events-none select-none"
            />
          )}

          {!preview && (
            <UserCircle2 size={64} strokeWidth={1.5} className="text-white" />
          )}

          <div className="flex items-center justify-center absolute bottom-0 right-0 bg-gray-300 text-white rounded-full w-7 h-7 border border-solid border-white">
            <Plus size={20} />
          </div>
        </div>

        <input
          ref={ref}
          {...rest}
          type="file"
          onChange={onChange}
          className="top-0 left-0 w-full h-full absolute opacity-0 cursor-pointer"
        />

        {error && <p className="text-sm mt-1 text-red-500">{error}</p>}
      </div>
    )
  }
)

Upload.displayName = "Upload"
