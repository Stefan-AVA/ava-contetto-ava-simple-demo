import { useMemo } from "react"
import { Box, Stack, Typography } from "@mui/material"

interface BrandColoursProps {
  onChange?: (color: string) => void
  brandColours: string[]
}

export default function BrandColours({
  onChange,
  brandColours,
}: BrandColoursProps) {
  const colors = useMemo(() => {
    const palette: string[] = []

    if (brandColours) palette.push(...brandColours)

    palette.push(...["#000", "#FFF"])

    return palette
  }, [brandColours])

  return (
    <Stack
      sx={{
        p: 4,
        gap: 2,
        borderBottom: "1px solid",
        borderBottomColor: "gray.200",
      }}
    >
      <Typography variant="h6">Brand colours</Typography>

      <Stack sx={{ gap: 4, flexWrap: "wrap", flexDirection: "row" }}>
        {colors.map((color) => (
          <Stack
            sx={{
              gap: 2,
              width: onChange ? "45%" : "auto",
              cursor: onChange ? "pointer" : "default",
              alignItems: "center",
              flexDirection: "row",
            }}
            key={color}
            onClick={() => onChange?.(color)}
          >
            <Box
              sx={{
                width: "2.5rem",
                height: "2.5rem",
                border: "1px solid",
                bgcolor: color,
                borderColor: color !== "#FFF" ? color : "gray.300",
                borderRadius: ".75rem",
              }}
            />

            {onChange && (
              <Typography sx={{ color: "primary.main" }}>
                {color.toUpperCase()}
              </Typography>
            )}
          </Stack>
        ))}
      </Stack>
    </Stack>
  )
}
