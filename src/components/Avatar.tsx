import { ChangeEvent } from "react"
import { nameInitials } from "@/utils/format-name"
import { Box, IconButton, Avatar as MuiAvatar, Typography } from "@mui/material"
import { Edit } from "lucide-react"

interface IAvatar {
  name?: string
  image?: string
  onChange?: (file: File) => void
  onCancel?: Function
  editable?: boolean
  height?: number | string
  width?: number | string
  circle?: boolean
  fontSize?: number | string
}

const Avatar = ({
  name,
  image,
  onChange,
  editable = false,
  width = 100,
  height = 100,
  circle = true,
  fontSize = 32,
}: IAvatar) => {
  const onFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]

    if (file && onChange) onChange(file)
  }

  return !name && !image ? (
    <Box
      sx={{
        position: "relative",
        width: width,
        height: height,
        border: "dashed 2px #0658c2",
        borderRadius: circle ? "100%" : 4,
      }}
    >
      <input
        type="file"
        style={{
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          opacity: 0,
          position: "absolute",
          cursor: "pointer",
        }}
        accept="image/*"
        onChange={onFileChange}
      />
    </Box>
  ) : (
    <Box
      sx={{
        position: "relative",
        width: width,
        height: height,
      }}
    >
      {image ? (
        <MuiAvatar
          sx={{ width, height, borderRadius: circle ? "100%" : 4 }}
          src={image}
        />
      ) : (
        <MuiAvatar sx={{ width, height, borderRadius: circle ? "100%" : 4 }}>
          <Typography variant="h3" fontSize={fontSize}>
            {nameInitials(String(name))}
          </Typography>
        </MuiAvatar>
      )}
      {editable && (
        <IconButton
          sx={{
            position: "absolute",
            bottom: 5,
            right: 10,
            padding: 0,
            background: "transparent",
            rotate: "90deg",
            ":hover": {
              opacity: 0.8,
              background: "transparent",
            },
          }}
        >
          <Edit size={20} color="gray" />
          <input
            type="file"
            style={{
              top: 0,
              left: 0,
              width: "100%",
              height: "100%",
              opacity: 0,
              position: "absolute",
              cursor: "pointer",
            }}
            accept="image/*"
            onChange={onFileChange}
          />
        </IconButton>
      )}
    </Box>
  )
}

export default Avatar
