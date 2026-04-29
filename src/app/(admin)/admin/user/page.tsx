import { AdminLayout } from "@/components/layout/admin-layout";
import { users } from "@/data/users";
export default function AdminUsersPage() {
  return <AdminLayout><h2 className="text-2xl font-semibold mb-4">Manage Users / Editors</h2><div className="rounded-xl border overflow-x-auto"><table className="w-full text-sm"><thead className="bg-muted"><tr><th className="text-left px-3 py-2">Name</th><th className="text-left px-3 py-2">Email</th><th className="text-left px-3 py-2">Role</th><th className="text-left px-3 py-2">Premium</th></tr></thead><tbody>{users.map((user) => <tr key={user.id} className="border-t"><td className="px-3 py-2">{user.name}</td><td className="px-3 py-2">{user.email}</td><td className="px-3 py-2">{user.role}</td><td className="px-3 py-2">{user.premium ? "Yes" : "No"}</td></tr>)}</tbody></table></div></AdminLayout>;
}
