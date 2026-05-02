import mongoose from "mongoose";
import fs from "fs";
import path from "path";
import dns from "dns";

loadEnvFile(".env.local");
loadEnvFile(".env");

const configuredMongoUrl = process.env.MONGO_URL?.trim() || process.env.DATABASE_URL?.trim();

if (!configuredMongoUrl) {
  throw new Error("MONGO_URL is not configured.");
}

const MONGO_URL = configuredMongoUrl;
const DNS_SERVERS = (process.env.MONGO_DNS_SERVERS ?? "8.8.8.8,1.1.1.1")
  .split(",")
  .map((server) => server.trim())
  .filter(Boolean);

if (DNS_SERVERS.length) {
  dns.setServers(DNS_SERVERS);
}

type CachedConnection = {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
};

const globalForMongoose = globalThis as typeof globalThis & {
  mongooseConn?: CachedConnection;
};

const cached = globalForMongoose.mongooseConn ?? { conn: null, promise: null };
globalForMongoose.mongooseConn = cached;

export async function connectDb() {
  if (cached.conn) return cached.conn;

  cached.promise ??= mongoose.connect(MONGO_URL, {
    bufferCommands: false,
  });
  cached.conn = await cached.promise;
  return cached.conn;
}

function loadEnvFile(fileName: string) {
  const filePath = path.join(process.cwd(), fileName);
  if (!fs.existsSync(filePath)) return;

  for (const line of fs.readFileSync(filePath, "utf8").split(/\r?\n/)) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;

    const equalsIndex = trimmed.indexOf("=");
    if (equalsIndex === -1) continue;

    const key = trimmed.slice(0, equalsIndex).trim();
    const value = trimmed.slice(equalsIndex + 1).trim().replace(/^["']|["']$/g, "");
    process.env[key] ??= value;
  }
}
