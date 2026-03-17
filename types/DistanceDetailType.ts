import { CoordinatesType } from "./CoordonateType";

export type DistanceDetailType = {
  coord: CoordinatesType & {
    shopId ?: number | null;
  };
  distance: string;
  shopId ?: number | null;
};