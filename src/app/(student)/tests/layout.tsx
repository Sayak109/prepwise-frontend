import { getSession } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function TestsSectionLayout({ children }: { children: React.ReactNode }) {
  const session = await getSession();
  if (!session.isAuthenticated) {
    redirect("/login");
  }
  return <>{children}</>;
}
