"use client";

import { useQuery } from "@tanstack/react-query";
import axios from "axios";

export interface PG {
  _id: string;
  name: string;
  location: {
    type: "Point";
    coordinates: [number, number];
  };
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
export function usePG(id: string | undefined) {
  return useQuery<PG>({
    queryKey: ["pg", id],
    queryFn: async () => {
      const res = await axios.get<{ data: PG }>(`/api/pgs/${id}`);
      return res.data.data;
    },
    enabled: !!id,
  });
}