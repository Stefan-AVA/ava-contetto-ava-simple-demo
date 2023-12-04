import Image from "next/image"
import { Box, IconButton } from "@mui/material"
import { XCircle } from "lucide-react"

import DragDrop, { IDragDropProps } from "./DragDrop"

interface IImageUploadProps extends IDragDropProps {
  images: string[]
  onDelete: Function
}

const ImageUpload = ({
  images,
  onDelete,
  multiple = false,
  width,
  height,
  ...rest
}: IImageUploadProps) => {
  return images.filter((image) => image).length > 0 ? (
    images.map((image) => (
      <Box
        key={image}
        sx={{
          position: "relative",
          width: width || "100%",
          height: height || "100px",
          margin: "5px 0",
        }}
      >
        <Image
          src={image}
          alt="coverImage"
          fill
          sizes="100vw"
          style={{ borderRadius: "4px", overflow: "hidden" }}
        />
        <IconButton
          onClick={() => {
            if (onDelete) onDelete(image)
          }}
          sx={{
            position: "absolute",
            top: 0,
            right: 0,
            transform: "translate(50%, -50%)",
            borderRadius: "50%",
            padding: 0,
            background: "white",
            color: "red",
            ":hover": {
              opacity: 0.8,
            },
          }}
        >
          <XCircle size={20} color="red" />
        </IconButton>
      </Box>
    ))
  ) : (
    <DragDrop
      multiple={multiple}
      accept={{ "image/*": [".png", ".jpeg", ".gif"] }}
      width={width}
      height={height}
      {...rest}
    />
  )
}

export default ImageUpload
