import { loginAction } from "@/app/actions/auth";
import { Button } from "@/components/ui/button";
export function LoginForm() {
  return <form action={loginAction} className="space-y-4 rounded-xl border p-6 bg-card max-w-md w-full"><h2 className="text-xl font-semibold">Login to PrepWise</h2><input name="email" placeholder="Email" className="w-full rounded-md border px-3 py-2" required /><input name="password" type="password" placeholder="Password" className="w-full rounded-md border px-3 py-2" required /><Button className="w-full" type="submit">Sign In</Button><p className="text-xs text-muted-foreground">Use mock emails like student1@prepwise.com or admin@prepwise.com.</p></form>;
}
