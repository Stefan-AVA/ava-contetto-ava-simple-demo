import { AreaUnitType } from "@/types/listing.types"

export const formatAreaUint = (unit?: AreaUnitType) => {
  switch (unit) {
    case AreaUnitType.sm:
      return "sq m."

    case AreaUnitType.sf:
    default:
      return "sq ft."
  }
}
