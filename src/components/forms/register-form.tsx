import { registerAction } from "@/app/actions/auth";
import { Button } from "@/components/ui/button";
export function RegisterForm() {
  return <form action={registerAction} className="space-y-4 rounded-xl border p-6 bg-card max-w-md w-full"><h2 className="text-xl font-semibold">Create account</h2><input name="name" placeholder="Full name" className="w-full rounded-md border px-3 py-2" required /><input name="email" placeholder="Email" className="w-full rounded-md border px-3 py-2" required /><input name="password" type="password" placeholder="Password" className="w-full rounded-md border px-3 py-2" required /><select name="role" className="w-full rounded-md border px-3 py-2"><option value="STUDENT">Student</option><option value="EDITOR">Editor</option><option value="ADMIN">Admin</option></select><Button className="w-full" type="submit">Register</Button></form>;
}
