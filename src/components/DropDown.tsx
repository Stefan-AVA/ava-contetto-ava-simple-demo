import { PropsWithChildren, ReactNode, useId, useRef } from "react"
import { Box } from "@mui/material"
import Popover, { PopoverOrigin } from "@mui/material/Popover"

interface IDropDown extends PropsWithChildren {
  open: boolean
  onClose: (event: {}, reason: "backdropClick" | "escapeKeyDown") => void
  ancher: ReactNode
  anchorOrigin?: PopoverOrigin
  transformOrigin?: PopoverOrigin
}

const DropDown = ({
  open,
  onClose,
  ancher,
  children,
  anchorOrigin,
  transformOrigin,
}: IDropDown) => {
  const ancherRef = useRef(null)
  const id = useId()

  return (
    <div>
      <Box ref={ancherRef}>
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
      >
        {children}
      </Popover>
    </div>
  )
}

export default DropDown
