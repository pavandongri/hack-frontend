export interface User {
  id: string;
  name: string;
  email: string;
  picture?: string;
}

export type LeafMapProps = {
  start: [number, number] | null;
  end: [number, number] | null;
};

export type LocationOption = {
  place_id: number;
  display_name: string;
  lat: string;
  lon: string;
};

export type Coordinates = [number, number];
