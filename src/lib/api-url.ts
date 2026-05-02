/**
 * Absolute origin for server-side HTTP (Server Actions, RSC). Client-side axios uses relative `/api/v1`.
 * Production: set `NEXT_PUBLIC_APP_URL` to your public site URL (e.g. https://app.example.com).
 * On Vercel, `VERCEL_URL` is used automatically when `NEXT_PUBLIC_APP_URL` is unset.
 */
export function serverOrigin(): string {
  const explicit = process.env.NEXT_PUBLIC_APP_URL?.trim();
  if (explicit) return explicit.replace(/\/$/, "");

  const vercel = process.env.VERCEL_URL?.trim();
  if (vercel) {
    const host = vercel.replace(/^https?:\/\//, "").replace(/\/$/, "");
    return `https://${host}`;
  }

  return `http://localhost:${process.env.PORT ?? 3000}`;
}

export function serverApiUrl(path = "") {
  const base = process.env.NEXT_PUBLIC_API_URL?.trim() ?? "/api/v1";
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  if (/^https?:\/\//i.test(base)) return `${base.replace(/\/$/, "")}${normalizedPath}`;
  const origin = serverOrigin();
  const pathBase = base.startsWith("/") ? base : `/${base}`;
  return `${origin.replace(/\/$/, "")}${pathBase}${normalizedPath}`;
}

