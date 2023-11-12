"use client"

import { useState } from "react"

export default function Setup() {
  const [step, setStep] = useState(1)

  return (
    <div className="flex flex-col items-center mt-8">
      <div className="flex items-center">
        {[1, 2, 3].map((field) => (
          <button key={field}>{field}</button>
        ))}
      </div>
    </div>
  )
}
