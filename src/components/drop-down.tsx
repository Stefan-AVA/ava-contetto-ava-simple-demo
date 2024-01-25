import { useId, useRef, type PropsWithChildren, type ReactNode } from "react"
import { Box, BoxProps } from "@mui/material"
import Popover, { type PopoverOrigin } from "@mui/material/Popover"

interface IDropDown extends BoxProps, PropsWithChildren {
  open: boolean
  onClose: (event: {}, reason: "backdropClick" | "escapeKeyDown") => void
  ancher: ReactNode
  anchorOrigin?: PopoverOrigin
  transformOrigin?: PopoverOrigin
}

export default function Dropdown({
  open,
  ancher,
  onClose,
  children,
  anchorOrigin,
  transformOrigin,
  ...rest
}: IDropDown) {
  const ancherRef = useRef(null)
  const id = useId()

  return (
    <>
      <Box sx={{ display: "flex" }} ref={ancherRef} {...rest}>
        {ancher}
      </Box>
      <Popover
        id={id}
        open={open}
        anchorEl={ancherRef.current}
        onClose={onClose}
        anchorOrigin={
          anchorOrigin || {
            vertical: "bottom",
            horizontal: "left",
          }
        }
        transformOrigin={
          transformOrigin || {
            vertical: "bottom",
            horizontal: "left",
          }
        }
        onClick={(e) => {
          if (e.preventDefault) e.preventDefault()
          if (e.stopPropagation) e.stopPropagation()
        }}
      >
        {children}
      </Popover>
    </>
  )
}
