import type { PropsWithChildren } from "react"
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Stack,
  Typography,
} from "@mui/material"
import { ChevronDown } from "lucide-react"

interface IListRoomsProps extends PropsWithChildren {
  type: "CHANNELS" | "DIRECT_CHATS"
}

const types = {
  CHANNELS: "Groups",

  DIRECT_CHATS: "Direct Chats",
}

export default function ListRooms({ type, children }: IListRoomsProps) {
  const element = types[type as keyof typeof types]

  return (
    <Accordion defaultExpanded>
      <AccordionSummary expandIcon={<ChevronDown />}>
        <Typography sx={{ color: "gray.700", fontWeight: 600 }} variant="h6">
          {element}
        </Typography>
      </AccordionSummary>

      <AccordionDetails>
        <Stack sx={{ gap: 2 }}>{children}</Stack>
      </AccordionDetails>
    </Accordion>
  )
}
