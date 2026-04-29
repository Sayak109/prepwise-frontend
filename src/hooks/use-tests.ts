"use client";
import { useQuery } from "@tanstack/react-query";
import { fetchTestById, fetchTests } from "@/services/mock-api";
export function useTests() { return useQuery({ queryKey: ["tests"], queryFn: fetchTests }); }
export function useTest(testId: string) { return useQuery({ queryKey: ["tests", testId], queryFn: () => fetchTestById(testId), enabled: Boolean(testId) }); }
