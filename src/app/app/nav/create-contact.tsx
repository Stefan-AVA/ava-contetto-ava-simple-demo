import { useState } from "react"
import { Card, IconButton } from "@mui/material"
import { Plus } from "lucide-react"

import CreateContactForm from "@/components/create-contact-form"
import Dropdown from "@/components/drop-down"

interface CreateContactProps {
  orgId: string
}

export default function CreateContact({ orgId }: CreateContactProps) {
  const [open, setOpen] = useState(false)

  return (
    <Dropdown
      open={open}
      ancher={
        <IconButton onClick={() => setOpen(true)}>
          <Plus />
        </IconButton>
      }
      onClose={() => setOpen(false)}
      anchorOrigin={{
        vertical: "bottom",
        horizontal: "right",
      }}
      transformOrigin={{
        vertical: "top",
        horizontal: "right",
      }}
    >
      <Card sx={{ width: "30rem" }}>
        <CreateContactForm orgId={orgId} onClose={() => setOpen(false)} />
      </Card>
    </Dropdown>
  )
}
