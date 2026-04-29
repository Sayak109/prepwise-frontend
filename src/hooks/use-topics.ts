"use client";
import { useQuery } from "@tanstack/react-query";
import { fetchTopics } from "@/services/mock-api";
export function useTopics() { return useQuery({ queryKey: ["topics"], queryFn: fetchTopics }); }
