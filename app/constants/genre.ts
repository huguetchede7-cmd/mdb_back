import { GenderType } from "../../types/GenderType";
import FileHelpers from "../helpers/fileHelpers";

export const Genders : {[key: string] : GenderType} = {
  "1": {
    label: 'Homme',
    tag: 'homme',
    value: 1,
    icon: FileHelpers.formatToUrl("1759964290790-3028b3aa-780c-42d0-b469-797247244a40.png"),
  },
  "2": {
    label: 'Femme',
    tag: 'femme',
    value: 2,
    icon:FileHelpers.formatToUrl("1759964311606-773a29ba-0a0d-414e-9414-1eb569702647.png")
  },
  "3": {
    label: 'Enfant',
    tag: 'enfant',
    value: 3,
    icon: FileHelpers.formatToUrl("1759964348610-67465fdb-b024-4d9c-9d9b-5d6b76557994.png")
  },
  "4": {
    label: 'Homme et Femme',
    tag: 'homme_femme',
    value: 4,
    icon: FileHelpers.formatToUrl("1759964382271-2bfce3cf-e27c-4726-90f0-de35d203ab27.png")
  },
  "5": {
    label: 'Homme et Enfant',
    tag: 'homme_enfant',
    value: 5,
    icon: FileHelpers.formatToUrl("")
  },
  "6": {
    label: 'Femme et Enfant',
    tag: 'femme_enfant',
    value: 6,
    icon: FileHelpers.formatToUrl("")
  },
  "7": {
    label: 'Homme et Femme et Enfant',
    tag: 'homme_femme_enfant',
    value: 7,
    icon: FileHelpers.formatToUrl("")
  },
  "8": {
    label: 'Tous les genres',
    tag: 'tous_les_genres',
    value: 8,
    icon: FileHelpers.formatToUrl("")
  }
}