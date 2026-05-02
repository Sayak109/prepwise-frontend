import crypto from "crypto";

const SALTED_MAGIC = "Salted__";

function evpBytesToKey(password: Buffer, salt: Buffer, keyLength: number, ivLength: number) {
  let derived = Buffer.alloc(0);
  let block = Buffer.alloc(0);

  while (derived.length < keyLength + ivLength) {
    block = crypto.createHash("md5").update(Buffer.concat([block, password, salt])).digest();
    derived = Buffer.concat([derived, block]);
  }

  return {
    key: derived.subarray(0, keyLength),
    iv: derived.subarray(keyLength, keyLength + ivLength),
  };
}

function getSecret() {
  const secret = process.env.PRIVATE_ENCRYPTION_KEY ?? process.env.NEXT_PRIVATE_ENCRYPTION_KEY;
  if (!secret) throw new Error("PRIVATE_ENCRYPTION_KEY is not configured.");
  return secret;
}

export function decryptData<T = any>(encrypted: string): T | null {
  try {
    const input = Buffer.from(encrypted, "base64");
    if (input.subarray(0, 8).toString("utf8") !== SALTED_MAGIC) return null;
    const salt = input.subarray(8, 16);
    const ciphertext = input.subarray(16);
    const { key, iv } = evpBytesToKey(Buffer.from(getSecret()), salt, 32, 16);
    const decipher = crypto.createDecipheriv("aes-256-cbc", key, iv);
    return JSON.parse(Buffer.concat([decipher.update(ciphertext), decipher.final()]).toString("utf8"));
  } catch {
    return null;
  }
}

export function encryptData(payload: unknown) {
  const salt = crypto.randomBytes(8);
  const { key, iv } = evpBytesToKey(Buffer.from(getSecret()), salt, 32, 16);
  const cipher = crypto.createCipheriv("aes-256-cbc", key, iv);
  const encrypted = Buffer.concat([
    cipher.update(JSON.stringify(payload), "utf8"),
    cipher.final(),
  ]);
  return Buffer.concat([Buffer.from(SALTED_MAGIC), salt, encrypted]).toString("base64");
}

