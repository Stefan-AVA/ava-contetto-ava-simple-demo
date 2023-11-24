import { useState, type JSX } from "react"
import { Route } from "next"
import Link from "next/link"
import { Card, Stack, Typography } from "@mui/material"
import { ListFilter } from "lucide-react"

import Dropdown from "./drop-down"

type Router = {
  icon: JSX.Element
  path: string
  label: string
  active: boolean
}

interface SidebarProps {
  routes: Router[]
}

export default function Sidebar({ routes }: SidebarProps) {
  const [open, setOpen] = useState(false)
  return (
    <>
      <Stack
        sx={{
          py: 3.5,
          px: 3,
          height: "100%",
          display: { xs: "none", md: "flex" },
          minWidth: "16rem",
          minHeight: "calc(100vh - 4rem)",
          borderRight: "1px solid",
          borderRightColor: "gray.300",
        }}
      >
        <Typography
          sx={{ mb: 2, color: "gray.500", fontWeight: 500 }}
          variant="body2"
        >
          MAIN MENU
        </Typography>

        {routes.map(({ label, path, icon, active }) => (
          <Stack
            sx={{
              p: 1,
              mb: 1,
              gap: 1.5,
              color: "gray.800",
              bgcolor: active ? "gray.200" : "white",
              alignItems: "center",
              borderRadius: 1.5,
            }}
            key={path}
            href={path as Route}
            component={Link}
            direction="row"
          >
            {icon}
            <Typography sx={{ fontWeight: 500 }}>{label}</Typography>
          </Stack>
        ))}
      </Stack>
      <Dropdown
        open={open}
        onClose={() => setOpen(false)}
        ancher={
          <Stack
            padding={1.5}
            display={{ xs: "flex", md: "none" }}
            alignItems="center"
            justifyContent="space-between"
            direction="row"
            onClick={() => setOpen(true)}
            sx={{
              borderBottom: "1px solid",
              borderBottomColor: "gray.300",
              bgcolor: "gray.200",
              borderRadius: 2,
            }}
          >
            <Stack direction="row" alignItems="center" spacing={2}>
              {routes.find((route) => route.active)?.icon}
              <Typography variant="h5" fontWeight={700}>
                {routes.find((route) => route.active)?.label}
              </Typography>
            </Stack>
            <ListFilter />
          </Stack>
        }
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "right",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
      >
        <Card sx={{ padding: 2, width: "calc(100vw - 20px)" }}>
          {routes.map(({ label, path, icon, active }) => (
            <Stack
              sx={{
                p: 1,
                mb: 1,
                gap: 1.5,
                color: "gray.800",
                bgcolor: active ? "gray.200" : "white",
                alignItems: "center",
                borderRadius: 1.5,
              }}
              key={path}
              href={path as Route}
              component={Link}
              direction="row"
              onClick={() => setOpen(false)}
            >
              {icon}
              <Typography sx={{ fontWeight: 500 }}>{label}</Typography>
            </Stack>
          ))}
        </Card>
      </Dropdown>
    </>
  )
}
