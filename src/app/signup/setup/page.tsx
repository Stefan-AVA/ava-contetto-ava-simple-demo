"use client"

import { useState } from "react"
import { cn } from "@/utils/classname"

import Steps from "./steps"

export default function Setup() {
  const [step, setStep] = useState(1)

  return (
    <div className="flex flex-col items-center mt-8 w-full">
      <Steps step={step} />

      <div className="flex w-full mt-5 py-14 px-20 flex-col border border-solid border-r-gray-300 rounded-xl"></div>
    </div>
  )
}
