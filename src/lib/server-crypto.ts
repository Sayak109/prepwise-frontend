import crypto from "crypto";

const SALTED_MAGIC = "Salted__";

function evpBytesToKey(password: Buffer, salt: Buffer, keyLength: number, ivLength: number) {
  let derived = Buffer.alloc(0);
  let block = Buffer.alloc(0);

  while (derived.length < keyLength + ivLength) {
    block = crypto
      .createHash("md5")
      .update(Buffer.concat([block, password, salt]))
      .digest();
    derived = Buffer.concat([derived, block]);
  }

  return {
    key: derived.subarray(0, keyLength),
    iv: derived.subarray(keyLength, keyLength + ivLength),
  };
}

export function encryptForBackend(payload: unknown) {
  const secret = process.env.PRIVATE_ENCRYPTION_KEY ?? process.env.NEXT_PRIVATE_ENCRYPTION_KEY;
  if (!secret) throw new Error("PRIVATE_ENCRYPTION_KEY is not configured for frontend auth actions.");

  const salt = crypto.randomBytes(8);
  const { key, iv } = evpBytesToKey(Buffer.from(secret), salt, 32, 16);
  const cipher = crypto.createCipheriv("aes-256-cbc", key, iv);
  const encrypted = Buffer.concat([
    cipher.update(JSON.stringify(payload), "utf8"),
    cipher.final(),
  ]);

  return Buffer.concat([Buffer.from(SALTED_MAGIC), salt, encrypted]).toString("base64");
}

export function decryptFromBackend<T>(encrypted: string): T {
  const secret = process.env.PRIVATE_ENCRYPTION_KEY ?? process.env.NEXT_PRIVATE_ENCRYPTION_KEY;
  if (!secret) throw new Error("PRIVATE_ENCRYPTION_KEY is not configured for frontend auth actions.");

  const input = Buffer.from(encrypted, "base64");
  const saltHeader = input.subarray(0, 8).toString("utf8");
  if (saltHeader !== SALTED_MAGIC) {
    throw new Error("Unsupported encrypted payload format.");
  }

  const salt = input.subarray(8, 16);
  const ciphertext = input.subarray(16);
  const { key, iv } = evpBytesToKey(Buffer.from(secret), salt, 32, 16);
  const decipher = crypto.createDecipheriv("aes-256-cbc", key, iv);
  const decrypted = Buffer.concat([decipher.update(ciphertext), decipher.final()]);
  return JSON.parse(decrypted.toString("utf8")) as T;
}
