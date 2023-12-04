import { useState } from "react"
import {
  Button,
  Unstable_Grid2 as Grid,
  MenuItem,
  Stack,
  TextField,
} from "@mui/material"
import { MuiColorInput } from "mui-color-input"

const initialTheme = {
  title: "#172832",
  primary: "#5A57FF",
  background: "#FFF",
  description: "#8C8C8C",
}

export default function WhiteLabel() {
  const [theme, setTheme] = useState(initialTheme)

  async function submit() {
    //
  }

  return (
    <Stack>
      <TextField sx={{ mb: 3 }} select label="Select a font">
        <MenuItem>Font 1</MenuItem>
        <MenuItem>Font 2</MenuItem>
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
