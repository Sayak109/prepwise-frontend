"use client";
import dynamic from "next/dynamic";
export const LazyDashboardCharts = dynamic(() => import("@/components/dashboard/dashboard-charts").then((mod) => mod.DashboardCharts), { ssr: false, loading: () => <div className="rounded-xl border p-4">Loading charts...</div> });
