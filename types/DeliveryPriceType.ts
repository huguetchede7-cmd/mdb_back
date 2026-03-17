import { CoordinatesType } from "./CoordonateType"
import { DistanceDetailType } from "./DistanceDetailType"
import { TraficCostDetailType } from "./TraficCostDetailType"

type MoreFarthestCompanies = {
  farthestCoord: CoordinatesType;
  maxDistance: string;
  allDistances: DistanceDetailType[];
}

export type DeliveryData = {
  driving ?: string;
  moreFarthestCompanies ?: MoreFarthestCompanies;
  farthestCoord: CoordinatesType;
  destinationPoint: {
    lat: string;
    lng: string;
  };
  companiesPositions: CoordinatesType[];
  trafic_cost_detail: TraficCostDetailType;
  real_trafic_cost: number;
}