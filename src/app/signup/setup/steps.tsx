import { Stack, Typography } from "@mui/material"

interface StepsProps {
  step: number
}

export default function Steps({ step }: StepsProps) {
  return (
    <Stack
      sx={{
        width: "100%",
        maxWidth: "36rem",
        alignItems: "center",
        flexDirection: "row",
        justifyContent: "space-between",
      }}
    >
      {[1, 2, 3].map((field, index) => (
        <Stack
          sx={
            index !== 0
              ? {
                  flex: 1,
                  alignItems: "center",
                  flexDirection: "row",
                }
              : undefined
          }
          key={field}
        >
          {index !== 0 && (
            <Stack
              sx={{
                width: "100%",
                height: "1px",
                bgcolor: index + 1 <= step ? "blue.500" : "gray.300",
              }}
            />
          )}

          <Typography
            sx={{
              color: "white",
              width: "3.5rem",
              height: "3.5rem",
              display: "flex",
              bgcolor: index + 1 <= step ? "blue.500" : "gray.300",
              textAlign: "center",
              alignItems: "center",
              lineHeight: "2rem",
              fontWeight: 600,
              aspectRatio: 1 / 1,
              borderRadius: "50%",
              justifyContent: "center",
            }}
            variant="h3"
          >
            {field}
          </Typography>
        </Stack>
      ))}
    </Stack>
  )
}
