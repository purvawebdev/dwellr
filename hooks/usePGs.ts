"use client";

import { useQuery } from "@tanstack/react-query";
import axios from "axios";

export function usePGs(lat?: number, lng?: number) {
  return useQuery({
    queryKey: ["pgs", lat, lng],
    queryFn: async () => {
      const res = await axios.get("/api/pgs", {
        params: { lat, lng },
      });
      return res.data.data;
    },
    enabled: !!lat && !!lng,
  });
}