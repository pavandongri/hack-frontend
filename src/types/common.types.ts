export type MapLocation = { lat: number; lng: number };

export interface User {
  id: string;
  name: string;
  email: string;
  picture?: string;
}

export type LeafMapProps = {
  start: [number, number] | null;
  end: [number, number] | null;
  setRouteLoading: (loading: boolean) => void;
};

export type LocationOption = {
  place_id: number;
  display_name: string;
  lat: string;
  lon: string;
};

export type Coordinates = [number, number];

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
