import { useState, type Dispatch, type SetStateAction } from "react"
import { Modal, Paper, Stack, Typography } from "@mui/material"
import { X } from "lucide-react"

interface AdvancedSearchProps {
  open: boolean
  onClose: Dispatch<SetStateAction<boolean>>
}

const initialForm = {
  mls: "",
  city: "",
  rooms: "",
  range: "",
  storeys: "",
  minPrice: "",
  maxPrice: "",
  bathrooms: "",
  listedSince: "",
}

export default function AdvancedSearch({ open, onClose }: AdvancedSearchProps) {
  const [form, setForm] = useState()

  return (
    <Modal open={open} onClose={() => onClose(false)}>
      <Paper
        sx={{
          p: 4,
          top: "50%",
          left: "50%",
          width: "100%",
          maxWidth: "54rem",
          position: "absolute",
          overflowY: "auto",
          maxHeight: "90vh",
          transform: "translate(-50%, -50%)",
        }}
        variant="outlined"
      >
        <Stack
          sx={{
            alignItems: "center",
            flexDirection: "row",
            justifyContent: "space-between",
          }}
        >
          <Typography sx={{ fontWeight: 600 }} variant="h4">
            Advanced search
          </Typography>

          <Stack
            sx={{
              color: "white",
              width: "2.5rem",
              height: "2.5rem",
              bgcolor: "gray.300",
              alignItems: "center",
              borderRadius: "50%",
              justifyContent: "center",
            }}
            component="button"
          >
            <X strokeWidth={3} />
          </Stack>
        </Stack>
      </Paper>
    </Modal>
  )
}
