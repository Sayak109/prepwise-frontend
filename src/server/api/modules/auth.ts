import { randomBytes } from "node:crypto";
import type { NextRequest } from "next/server";
import { apiResponse } from "@/server/api-response";
import { User, UserSession } from "@/server/models";
import {
  authResponse,
  bcrypt,
  bodyPayload,
  currentUser,
  decryptData,
  encryptData,
  hash,
  publicUser,
  randomUUID,
  readBody,
  signAccessToken,
  toPlain,
} from "@/server/api/shared";

export async function handleAuth(req: NextRequest, path: string[]) {
  const action = path[1];
  const body = bodyPayload(await readBody(req));
  if (req.method === "POST" && action === "check") {
    const credential = String(body.email ?? body.phone_no ?? body.credential ?? "").trim();
    const user = credential ? await User.findOne({ $or: [{ email: credential.toLowerCase() }, { phoneNo: credential }] }) : null;
    const data = { is_exists: !!user, is_admin: user?.role === "ADMIN", isRegistered: !!user, isAdmin: user?.role === "ADMIN", isStudent: user?.role === "STUDENT", isEditor: user?.role === "EDITOR" };
    return apiResponse(encryptData({ success: true, message: "User checked.", data }), "User checked.");
  }
  if (req.method === "POST" && action === "register") {
    const email = String(body.email ?? "").trim().toLowerCase();
    if (!email) throw new Error("Email is required");
    if (await User.findOne({ email })) throw new Error("Email already exists");
    const [firstName, ...rest] = String(body.name ?? "").trim().split(/\s+/).filter(Boolean);
    const user = await User.create({ email, firstName, lastName: rest.join(" ") || undefined, passwordHash: await bcrypt.hash(String(body.password), 10), role: "STUDENT", status: "ACTIVE", authMethod: "EMAIL_PW" });
    return apiResponse(encryptData({ success: true, message: "Registration successful.", data: await authResponse(user, req) }), "Registration successful.", 201);
  }
  if (req.method === "POST" && action === "login") {
    const email = String(body.email ?? "").trim().toLowerCase();
    const user = await User.findOne({ email });
    if (!user || !(await bcrypt.compare(String(body.password ?? ""), user.passwordHash))) throw new Error("Invalid credentials");
    if (user.status === "INACTIVE") throw new Error("Sorry, your account is suspended.");
    await User.findByIdAndUpdate(user.id, { lastLoginAt: new Date() });
    return apiResponse(encryptData({ success: true, message: "Login successful.", data: await authResponse(user, req) }), "Login successful.");
  }
  if (req.method === "POST" && action === "refresh") {
    const refreshToken = typeof body === "string" ? body : body.refreshToken ?? body.data;
    const nested = typeof refreshToken === "string" ? decryptData(refreshToken) : null;
    const plain = typeof nested === "string" ? nested : refreshToken;
    const session = await UserSession.findOne({ refreshTokenHash: hash(plain), revokedAt: null, expiresAt: { $gt: new Date() } });
    if (!session) throw new Error("Session expired");
    const user = await User.findById(session.userId);
    const newPlain = randomUUID() + randomUUID();
    await UserSession.findByIdAndUpdate(session.id, { refreshTokenHash: hash(newPlain), refreshTokenEncrypted: encryptData(newPlain), lastUsedAt: new Date() });
    const data = { accessToken: signAccessToken(toPlain(user), session.sessionId), refreshToken: encryptData(newPlain) };
    return apiResponse(encryptData({ success: true, message: "Tokens refreshed successfully", data }), "Tokens refreshed successfully");
  }
  if (req.method === "GET" && action === "me") {
    return apiResponse(publicUser(await currentUser(req)), "User fetched successfully.");
  }
  if (req.method === "POST" && action === "logout") {
    const user = await currentUser(req);
    await UserSession.updateMany({ userId: user.id, sessionId: user.sid, revokedAt: null }, { revokedAt: new Date(), lastUsedAt: new Date() });
    return apiResponse(null, "Logout successful.");
  }
  if (req.method === "POST" && action === "logout-all") {
    const user = await currentUser(req);
    await UserSession.updateMany({ userId: user.id, revokedAt: null }, { revokedAt: new Date(), lastUsedAt: new Date() });
    return apiResponse(null, "Logout successful from all device.");
  }
  if (req.method === "POST" && action === "forgot-password") {
    const user = await User.findOne({ email: String(body.email ?? "").trim().toLowerCase() });
    if (!user) throw new Error("Email address not found.");
    const token = randomBytes(8).toString("hex").toUpperCase();
    await User.findByIdAndUpdate(user.id, { resetToken: token, resetTokenExp: new Date(Date.now() + 5 * 60 * 1000) });
    return apiResponse(null, "Password reset request accepted. An email will be sent if the email exists.");
  }
  if (req.method === "POST" && action === "reset-password") {
    const user = await User.findOne({ resetToken: body.token, resetTokenExp: { $gt: new Date() } });
    if (!user) throw new Error("Invalid or expired token");
    await User.findByIdAndUpdate(user.id, { passwordHash: await bcrypt.hash(String(body.new_password ?? body.newPassword), 10), resetToken: null, resetTokenExp: null, authMethod: "EMAIL_PW" });
    return apiResponse(null, "Your password has been reset successfully.");
  }
  if (req.method === "POST" && action === "test-encryption") return apiResponse(encryptData(body), "Encrypted data.");
  if (req.method === "POST" && action === "test-decryption") return apiResponse(decryptData(body.data), "Decrypted data.");
}

