export interface PuneArea {
  name: string;
  lat: number;
  lng: number;
}

export const PUNE_AREAS: PuneArea[] = [
  { name: "Koregaon Park", lat: 18.5362, lng: 73.8935 },
  { name: "Hinjewadi", lat: 18.5912, lng: 73.7390 },
  { name: "Kothrud", lat: 18.5074, lng: 73.8077 },
  { name: "Viman Nagar", lat: 18.5679, lng: 73.9143 },
  { name: "Baner", lat: 18.5590, lng: 73.7868 },
  { name: "Wakad", lat: 18.5981, lng: 73.7607 },
  { name: "Shivaji Nagar", lat: 18.5308, lng: 73.8475 },
  { name: "Kharadi", lat: 18.5511, lng: 73.9407 },
  { name: "Hadapsar", lat: 18.5089, lng: 73.9260 },
  { name: "Aundh", lat: 18.5580, lng: 73.8073 },
  { name: "Pimpri-Chinchwad", lat: 18.6298, lng: 73.7997 },
  { name: "Deccan Gymkhana", lat: 18.5168, lng: 73.8411 },
  { name: "Camp (Pune Station)", lat: 18.5196, lng: 73.8754 },
  { name: "Magarpatta City", lat: 18.5133, lng: 73.9270 },
  { name: "Sinhagad Road", lat: 18.4788, lng: 73.8263 },
  { name: "Katraj", lat: 18.4575, lng: 73.8669 },
  { name: "Warje", lat: 18.4876, lng: 73.8080 },
];

// Default center of Pune city
export const PUNE_CENTER = { lat: 18.5204, lng: 73.8567 };
