"use client";
import { useQuery } from "@tanstack/react-query";
import { fetchTests } from "@/services/student-api";
import type { Test } from "@/types";

export function useTests(params?: { search?: string; difficulty?: Test["difficulty"] }) {
  return useQuery({
    queryKey: ["tests", params],
    queryFn: () => fetchTests(params),
  });
}
