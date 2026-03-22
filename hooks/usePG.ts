"use client";

import { useQuery } from "@tanstack/react-query";
import axios from "axios";

export function usePG(id: string | undefined) {
  return useQuery({
    queryKey: ["pg", id],
    queryFn: async () => {
      const res = await axios.get(`/api/pgs/${id}`);
      return res.data.data;
    },
    enabled: !!id,
  });
}
