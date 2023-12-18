import { useMemo } from "react"
import { useParams } from "next/navigation"
import { useGetContactsQuery, useGetMembersQuery } from "@/redux/apis/org"
import { Autocomplete, TextField } from "@mui/material"

export type SearchMemberOption = {
  type: string
  value: string
  label: string
  agentId?: string
  agentName?: string
}

interface SearchMembersProps {
  value: SearchMemberOption[]
  orgId: string
  onChange: (options: SearchMemberOption[]) => void
}

export default function SearchMembers({
  value,
  orgId,
  onChange,
}: SearchMembersProps) {
  const { agentId } = useParams()

  const { data: agents } = useGetMembersQuery(
    { id: orgId },
    {
      skip: !orgId,
    }
  )

  const { data: contacts } = useGetContactsQuery(
    { orgId },
    {
      skip: !orgId,
    }
  )

  const data = useMemo(() => {
    const options = [] as SearchMemberOption[]

    if (agents && agents.members.length > 0) {
      const removeCurrentAgent = agents.members.filter(
        (agent) => agent._id !== agentId
      )

      const fields = removeCurrentAgent.map((agent) => ({
        type: "Agents",
        value: agent._id,
        label: agent.username,
      }))

      options.push(...fields)
    }

    if (contacts && contacts.length > 0) {
      const removeContactsWithoutUsername = contacts.filter(
        (contact) => contact.username
      )

      const fields = removeContactsWithoutUsername.map((contact) => ({
        type: "Contacts",
        value: contact._id,
        label: contact.username!,
        agentId: contact.agentProfileId,
        agentName: contact.agentName,
      }))

      options.push(...fields)
    }

    return options
  }, [agents, contacts, agentId])

  return (
    <Autocomplete
      id="grouped-contacts"
      value={value}
      options={data}
      groupBy={(option) => option.type}
      multiple
      onChange={(_, newValue) => onChange(newValue)}
      renderInput={(params) => <TextField {...params} label="Users" />}
      getOptionKey={(option) => option.value}
    />
  )
}
