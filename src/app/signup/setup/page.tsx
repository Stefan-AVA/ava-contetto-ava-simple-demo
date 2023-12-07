"use client"

import { useState, type FormEvent } from "react"
import { useRouter } from "next/navigation"
import { LoadingButton } from "@mui/lab"
import { MenuItem, Stack, TextField, Typography } from "@mui/material"
import { MuiTelInput } from "mui-tel-input"
import { z } from "zod"

import { Upload } from "@/components/upload"

import Steps from "./steps"

const first = z.object({
  name: z.string().min(1, "Enter your full name"),
  phone: z.string().min(1, "Enter your phone number"),
  avatar: z.custom<FileList>(),
  country: z.string().min(1, "Enter your country"),
  username: z.string().min(1, "Enter your user name"),
})

const second = z.object({
  company: z.string().min(1, "Enter your company name"),
  industry: z.string().min(1, "Select the industry"),
  headCount: z.string().min(1, "Enter the head count"),
  companyAddress: z.string().min(1, "Enter the company address"),
})

const third = z.object({})

const schema = {
  1: first,
  2: second,
  3: third,
}

type FirstFormSchema = z.infer<typeof first>
type SecondFormSchema = z.infer<typeof second>

type FormSchema = FirstFormSchema & SecondFormSchema

const options = [
  { value: "industry-1", label: "Industry 1" },
  { value: "industry-2", label: "Industry 2" },
  { value: "industry-3", label: "Industry 3" },
]

export default function Setup() {
  const [step, setStep] = useState(1)

  const { replace } = useRouter()

  async function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()

    if (step <= 2) return setStep((prev) => prev + 1)

    // Send request to backend.

    replace("/app")
  }

  return (
    <Stack
      sx={{
        mt: 5,
        width: "100%",
        alignItems: "center",
      }}
    >
      <Steps step={step} />

      <Stack
        sx={{
          mt: 2.5,
          py: {
            xs: 6,
            md: 7,
          },
          px: {
            xs: 3,
            md: 10,
          },
          width: "100%",
          border: "1px solid",
          borderColor: "gray.300",
          borderRadius: ".75rem",
        }}
        onSubmit={submit}
        component="form"
      >
        {step === 1 && (
          <Stack>
            <Upload name="avatar" className="mx-auto" />

            <TextField sx={{ mt: 3.5, mb: 3 }} label="User Name" />

            <TextField label="Full Name" />

            <MuiTelInput
              sx={{ my: 3 }}
              label="Phone Number"
              defaultCountry="CA"
            />

            <TextField label="Country" />
          </Stack>
        )}

        {step === 2 && (
          <Stack sx={{ gap: 3 }}>
            <TextField label="Company Name" />

            <TextField label="Industry" select>
              {options.map(({ value, label }) => (
                <MenuItem key={value} value={value}>
                  {label}
                </MenuItem>
              ))}
            </TextField>

            <TextField type="number" label="Head Count" />

            <TextField label="Company Address (Optional)" />
          </Stack>
        )}

        {step === 3 && (
          <Typography sx={{ color: "gray.700" }}>
            I agree to the Terms of Service and Privacy Policy of the AVA
            platform to start using it.
          </Typography>
        )}

        <LoadingButton sx={{ mt: 6, width: "100%" }} type="submit">
          {step === 3 ? "Confirm" : "Next"}
        </LoadingButton>
      </Stack>
    </Stack>
  )
}
