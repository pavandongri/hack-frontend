export type MapLocation = { lat: number; lng: number };

export interface User {
  id: string;
  name: string;
  email: string;
  picture?: string;
}

export type LocationOption = {
  place_id: number;
  display_name: string;
  lat: string;
  lon: string;
};

export type Coordinates = [number, number];

/** Single hazard point from list-hazards buckets (obstacles, surface_risk, etc.). */
export type RouteHazardPoint = {
  id: string;
  latitude: number;
  longitude: number;
  category: string;
  subcategory: string;
  riskLevel?: string;
  score?: number;
  imageUrl?: string;
};

/** Per-route buckets from GET /maps/list-hazards (e.g. r1, r2). */
export type RouteHazardBuckets = Record<string, RouteHazardPoint[]>;

/** Wrapped API response from GET /maps/list-hazards. */
export type RouteHazardsResponse = {
  success: boolean;
  message: string;
  data: Record<string, RouteHazardBuckets>;
  requestId: string;
};

export type RouteType = {
  geometry: {
    coordinates: [number, number][];
  };
  distance: number;
  duration: number;
  legs: {
    steps: any[];
    annotation?: any;
  }[];
};

export type LeafMapProps = {
  start: [number, number] | null;
  end: [number, number] | null;
  routes: RouteType[];
  hazardPoints?: RouteHazardPoint[];
};
