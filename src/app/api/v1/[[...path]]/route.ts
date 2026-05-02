import type { NextRequest } from "next/server";
import { handleApi } from "@/server/backend";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest, context: { params: Promise<{ path?: string[] }> }) {
  return handleApi(req, (await context.params).path ?? []);
}

export async function POST(req: NextRequest, context: { params: Promise<{ path?: string[] }> }) {
  return handleApi(req, (await context.params).path ?? []);
}

export async function PATCH(req: NextRequest, context: { params: Promise<{ path?: string[] }> }) {
  return handleApi(req, (await context.params).path ?? []);
}

export async function PUT(req: NextRequest, context: { params: Promise<{ path?: string[] }> }) {
  return handleApi(req, (await context.params).path ?? []);
}

export async function DELETE(req: NextRequest, context: { params: Promise<{ path?: string[] }> }) {
  return handleApi(req, (await context.params).path ?? []);
}

