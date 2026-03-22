export interface PGLocation {
  type: "Point";
  coordinates: [number, number]; // [lng, lat] (GeoJSON format)
}

export interface PGData {
  _id: string;
  name: string;
  location: PGLocation;
  address?: string;
  rent?: {
    min?: number;
    max?: number;
  };
  amenities?: string[];
  ratings?: {
    avg: number;
    count: number;
  };
}
