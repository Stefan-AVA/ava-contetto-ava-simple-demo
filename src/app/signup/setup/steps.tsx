import { cn } from "@/utils/classname"

interface StepsProps {
  step: number
}

export default function Steps({ step }: StepsProps) {
  return (
    <div className="flex items-center w-full max-w-xl justify-between">
      {[1, 2, 3].map((field, index) => (
        <div
          key={field}
          className={cn("flex", index !== 0 ? "flex-1 items-center" : "")}
        >
          {index !== 0 && (
            <span
              className={cn(
                "h-px flex w-full",
                index + 1 <= step ? "bg-blue-500" : "bg-gray-300"
              )}
            />
          )}

          <span
            className={cn(
              "flex items-center justify-center w-14 h-14 aspect-square rounded-full text-white font-semibold text-3xl leading-8 text-center",
              index + 1 <= step ? "bg-blue-500" : "bg-gray-300"
            )}
          >
            {field}
          </span>
        </div>
      ))}
    </div>
  )
}
