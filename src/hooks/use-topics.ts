"use client";
import { useQuery } from "@tanstack/react-query";
import { fetchTopics } from "@/services/student-api";
export function useTopics() { return useQuery({ queryKey: ["topics"], queryFn: fetchTopics }); }
