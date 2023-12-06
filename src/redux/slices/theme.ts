import { dmsans } from "@/styles/fonts"

export interface DefaultAvaOrgTheme {
  title: string
  primary: string
  secondary: string
  background: string
  fontFamily: string
  description: string
}

export const initialTheme = {
  title: "#172832",
  primary: "#00B8D2",
  secondary: "#5A57FF",
  background: "#FFF",
  fontFamily: dmsans.style.fontFamily,
  description: "#8C8C8C",
} satisfies DefaultAvaOrgTheme
