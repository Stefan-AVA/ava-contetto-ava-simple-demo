import { Circle, FabricImage, Rect, Textbox } from "fabric"

type SelectedText = {
  type: "TEXT"
  elem: Textbox
}

type SelectedLogo = {
  type: "LOGO"
  elem: FabricImage
}

type SelectedImage = {
  type: "IMAGE"
  elem: FabricImage
}

type SelectedSymbol = {
  type: "SYMBOL"
  elem: Rect | Circle
}

export type SelectedElement =
  | SelectedText
  | SelectedLogo
  | SelectedImage
  | SelectedSymbol
