import { redirect } from "next/navigation";

function toQueryString(searchParams: Record<string, string | string[] | undefined>) {
  const qp = new URLSearchParams();
  for (const [key, value] of Object.entries(searchParams)) {
    if (Array.isArray(value)) {
      value.forEach((v) => qp.append(key, v));
    } else if (value !== undefined) {
      qp.set(key, value);
    }
  }
  const str = qp.toString();
  return str ? `?${str}` : "";
}

export default async function TestResultAliasPage({
  params,
  searchParams,
}: {
  params: Promise<{ testId: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const { testId } = await params;
  const query = toQueryString(await searchParams);
  redirect(`/tests/${testId}/results${query}`);
}
