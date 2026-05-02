export function serverApiUrl(path = "") {
  const base = process.env.NEXT_PUBLIC_API_URL ?? "/api/v1";
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  if (/^https?:\/\//i.test(base)) return `${base.replace(/\/$/, "")}${normalizedPath}`;
  const origin = process.env.NEXT_PUBLIC_APP_URL ?? `http://localhost:${process.env.PORT ?? 3000}`;
  return `${origin.replace(/\/$/, "")}${base}${normalizedPath}`;
}

