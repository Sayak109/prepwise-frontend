import { users } from "@/data/users";
import { AuthResponse, Role } from "@/types";

export async function mockLogin(email: string): Promise<AuthResponse> {
  const user = users.find((u) => u.email.toLowerCase() === email.toLowerCase()) ?? users[3];
  return { token: `token-${user.id}`, refreshToken: `refresh-${user.id}`, user };
}
export async function mockRegister(name: string, email: string, role: Role): Promise<AuthResponse> {
  const user = { id: `u-${Date.now()}`, name, email, role, premium: false };
  return { token: `token-${user.id}`, refreshToken: `refresh-${user.id}`, user };
}
