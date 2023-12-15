import { useMemo, useState } from "react"
import { useParams } from "next/navigation"
import type { RootState } from "@/redux/store"
import { Box, CircularProgress, Stack } from "@mui/material"
import { Send } from "lucide-react"
import { useSelector } from "react-redux"

import EmojiPicker from "./emoji-picker"
import TextField from "./text-field"

export default function Footer() {
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState("")

  const { agentId } = useParams()

  const agentOrgs = useSelector((state: RootState) => state.app.agentOrgs)

  const currentOrg = useMemo(
    () => agentOrgs.find((agent) => agent._id === agentId)!,
    [agentId, agentOrgs]
  )

  async function submit() {
    setLoading(true)

    // send message.

    setLoading(false)

    setMessage("")
  }

  return (
    <Stack sx={{ px: 5, py: 3, gap: 4, flexDirection: "row" }}>
      <EmojiPicker onMessage={setMessage} />

      <TextField
        value={message}
        orgId={currentOrg?.orgId as string}
        onSend={submit}
        onChange={({ target }) => setMessage(target.value)}
      />

      <Box sx={{ color: "secondary.main" }} onClick={submit} component="button">
        {loading ? <CircularProgress size="1.5rem" /> : <Send />}
      </Box>
    </Stack>
  )
}
