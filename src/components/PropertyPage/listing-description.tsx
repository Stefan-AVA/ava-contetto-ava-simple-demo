import { useEffect, useRef, useState, type ElementRef } from "react"
import { Box, Typography } from "@mui/material"

interface DescriptionProps {
  message: string
}

export default function ListingDescription({ message }: DescriptionProps) {
  const [readMore, setReadMore] = useState(false)
  const [numberOfLinesGreaterThan6, setNumberOfLinesGreaterThan6] =
    useState(false)

  const descriptionRef = useRef<ElementRef<"span">>(null)

  useEffect(() => {
    if (descriptionRef.current) {
      const divHeight = descriptionRef.current.offsetHeight
      const lineHeight = +descriptionRef.current.style.lineHeight.replace(
        "px",
        ""
      )

      const lines = divHeight / lineHeight

      if (lines >= 6) setNumberOfLinesGreaterThan6(true)
    }
  }, [])

  return (
    <>
      <Typography
        sx={{
          mt: 6,
          mb: 2,
          fontWeight: 700,
        }}
        variant="h5"
      >
        Listing Description
      </Typography>

      <Typography
        sx={{
          color: "gray.500",
          display: "-webkit-box",
          overflow: "hidden",
          WebkitLineClamp: !readMore ? 6 : undefined,
          WebkitBoxOrient: "vertical",
        }}
        ref={descriptionRef}
        style={{ lineHeight: "24px" }}
      >
        {message}
      </Typography>

      {numberOfLinesGreaterThan6 && (
        <Box
          sx={{
            mt: 3,
            color: "gray.500",
            fontWeight: 500,
            textDecoration: "underline",
          }}
          onClick={() => setReadMore((prev) => !prev)}
          component="button"
        >
          READ {readMore ? "LESS" : "MORE"}
        </Box>
      )}
    </>
  )
}
