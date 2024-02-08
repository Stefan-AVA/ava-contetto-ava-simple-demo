import { dmsans } from "./fonts"
import { palette } from "./theme"

export interface DefaultAvaOrgTheme {
  title: string
  primary: string
  secondary: string
  background: string
  fontFamily: string
  description: string
}

export const initialTheme = {
  title: palette.gray[700],
  primary: palette.blue[800],
  secondary: palette.cyan[500],
  background: palette.white,
  fontFamily: dmsans.style.fontFamily,
  description: palette.gray[500],
} satisfies DefaultAvaOrgTheme
