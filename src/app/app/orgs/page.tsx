"use client"

import { Route } from "next"
import Link from "next/link"
import { useGetOrgsQuery } from "@/redux/apis/org"
import { Box, Button, CircularProgress, Stack, Typography } from "@mui/material"
import { ArrowRight } from "lucide-react"

export default function Page() {
  const { data, isLoading } = useGetOrgsQuery()

  return (
    <Stack sx={{ gap: 3 }}>
      <Stack
        sx={{
          width: "100%",
          alignItems: "center",
          flexDirection: "row",
          justifyContent: "space-between",
        }}
      >
        <Typography
          sx={{ color: "gray.800", fontWeight: 500 }}
          variant="h4"
          component="h1"
        >
          Your Organizations
        </Typography>

        <Link href="/app/orgs/create">
          <Button className="w-fit">Create</Button>
        </Link>
      </Stack>

      {isLoading && (
        <Stack
          sx={{ width: "100%", alignItems: "center", justifyContent: "center" }}
        >
          <CircularProgress size="1.25rem" />
        </Stack>
      )}

      {data && (
        <Stack sx={{ gap: 1 }}>
          {(data.agentProfiles || []).map(({ _id, org, role, orgId }) => (
            <Stack
              sx={{
                p: 3,
                border: "1px solid",
                alignItems: "center",
                borderColor: "gray.300",
                borderRadius: ".5rem",
                flexDirection: "row",
                justifyContent: "space-between",

                ":hover": {
                  ".arrow-right": {
                    color: "cyan.500",
                  },
                },
              }}
              key={_id}
              href={`/app/orgs/${orgId}` as Route}
              component={Link}
            >
              <Stack
                sx={{
                  gap: 1,
                  alignItems: "center",
                  flexDirection: "row",
                }}
              >
                <Typography
                  sx={{ fontWeight: 700, textTransform: "uppercase" }}
                >
                  {org?.name}
                </Typography>

                <Typography
                  sx={{ color: "gray.500" }}
                  variant="caption"
                  component="span"
                >
                  ({role})
                </Typography>
              </Stack>

              <Box
                sx={{ transition: "all .3s ease-in-out" }}
                component={ArrowRight}
                className="arrow-right"
              />
            </Stack>
          ))}

          {(data.contacts || []).map(({ _id, org, agent }) => (
            <Stack
              sx={{
                p: 3,
                border: "1px solid",
                alignItems: "center",
                borderColor: "gray.300",
                borderRadius: ".5rem",
                flexDirection: "row",
                justifyContent: "space-between",

                ":hover": {
                  ".arrow-right": {
                    color: "cyan.500",
                  },
                },
              }}
              key={_id}
            >
              <Stack
                sx={{
                  gap: 1,
                  alignItems: "center",
                  flexDirection: "row",
                }}
              >
                <Typography
                  sx={{ fontWeight: 700, textTransform: "uppercase" }}
                >
                  {org?.name}
                </Typography>

                <Typography
                  sx={{ color: "gray.500" }}
                  variant="caption"
                  component="span"
                >
                  {`(contact of ${agent?.username})`}
                </Typography>
              </Stack>

              {/* <Box
                sx={{ transition: "all .3s ease-in-out" }}
                component={ArrowRight}
                className="arrow-right"
              /> */}
            </Stack>
          ))}
        </Stack>
      )}
    </Stack>
  )
}
