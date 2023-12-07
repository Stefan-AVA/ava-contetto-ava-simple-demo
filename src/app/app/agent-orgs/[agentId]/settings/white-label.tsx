import { useEffect, useState } from "react"
import { setTheme as setDefaultTheme } from "@/redux/slices/app"
import { initialTheme } from "@/redux/slices/theme"
import { useAppDispatch, type RootState } from "@/redux/store"
import {
  Button,
  Unstable_Grid2 as Grid,
  MenuItem,
  Stack,
  TextField,
} from "@mui/material"
import { MuiColorInput } from "mui-color-input"
import { useSelector } from "react-redux"

import { dmsans } from "@/styles/fonts"

export default function WhiteLabel() {
  const [theme, setTheme] = useState(initialTheme)

  const state = useSelector((state: RootState) => state.app.theme)

  const dispatch = useAppDispatch()

  useEffect(() => setTheme(state), [state])

  function submit() {
    dispatch(setDefaultTheme(theme))
  }

  return (
    <Stack>
      <TextField
        sx={{ mb: 3 }}
        select
        label="Select a font"
        value={theme.fontFamily}
        onChange={({ target }) =>
          setTheme((prev) => ({ ...prev, fontFamily: target.value }))
        }
      >
        <MenuItem value={dmsans.style.fontFamily}>DM Sans</MenuItem>
        <MenuItem value="Inter">Inter</MenuItem>
        <MenuItem value="Roboto">Roboto</MenuItem>
        <MenuItem value="Open Sans">Open Sans</MenuItem>
        <MenuItem value="Plus Jakarta Sans">Plus Jakarta Sans</MenuItem>
        <MenuItem value="Lato">Lato</MenuItem>
        <MenuItem value="Raleway">Raleway</MenuItem>
        <MenuItem value="Nunito Sans">Nunito Sans</MenuItem>
      </TextField>

      <Grid spacing={3} container>
        <Grid xs={12} md={6}>
          <MuiColorInput
            value={theme.primary}
            label="Color primary"
            format="rgb"
            onChange={(value) =>
              setTheme((prev) => ({ ...prev, primary: value }))
            }
            fullWidth
          />
        </Grid>

        <Grid xs={12} md={6}>
          <MuiColorInput
            value={theme.secondary}
            label="Color secondary"
            format="rgb"
            onChange={(value) =>
              setTheme((prev) => ({ ...prev, secondary: value }))
            }
            fullWidth
          />
        </Grid>

        <Grid xs={12} md={6}>
          <MuiColorInput
            value={theme.background}
            label="Background color"
            format="rgb"
            onChange={(value) =>
              setTheme((prev) => ({ ...prev, background: value }))
            }
            fullWidth
          />
        </Grid>

        <Grid xs={12} md={6}>
          <MuiColorInput
            value={theme.title}
            label="Color title"
            format="rgb"
            onChange={(value) =>
              setTheme((prev) => ({ ...prev, title: value }))
            }
            fullWidth
          />
        </Grid>

        <Grid xs={12} md={6}>
          <MuiColorInput
            value={theme.description}
            label="Color description"
            format="rgb"
            onChange={(value) =>
              setTheme((prev) => ({ ...prev, description: value }))
            }
            fullWidth
          />
        </Grid>
      </Grid>

      <Stack
        sx={{
          mt: 6,
          gap: 2,
          alignItems: "center",
          flexDirection: "row",
          justifyContent: "flex-end",
        }}
      >
        <Button variant="outlined" onClick={() => setTheme(initialTheme)}>
          Cancel
        </Button>

        <Button onClick={submit}>Save</Button>
      </Stack>
    </Stack>
  )
}
