import type { PropsWithChildren } from "react"
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Stack,
  Typography,
} from "@mui/material"
import { ChevronDown, CircleUserRound, Hash } from "lucide-react"

interface ListMessagesProps extends PropsWithChildren {
  type: "CHANNELS" | "DIRECT_CHATS"
}

const types = {
  CHANNELS: {
    icon: Hash,
    title: "Channels",
  },

  DIRECT_CHATS: {
    icon: CircleUserRound,
    title: "Direct Chats",
  },
}

export default function ListMessages({ type, children }: ListMessagesProps) {
  const element = types[type as keyof typeof types]

  const Icon = element.icon

  return (
    <Accordion>
      <AccordionSummary expandIcon={<ChevronDown />}>
        <Box sx={{ mr: 2, color: "gray.700" }} component={Icon} />

        <Typography sx={{ color: "gray.700", fontWeight: 600 }} variant="h6">
          {element.title}
        </Typography>
      </AccordionSummary>

      <AccordionDetails>
        <Stack sx={{ gap: 2 }}>{children}</Stack>
      </AccordionDetails>
    </Accordion>
  )
}
