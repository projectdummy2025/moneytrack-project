import { EncryptJWT, jwtDecrypt } from "jose";
import bcrypt from "bcryptjs";
import { createHash } from "crypto";

// Fungsi untuk memastikan kunci selalu tepat 32 byte (256 bit)
function getSecretKey() {
  const rawSecret = process.env.JWT_SECRET || "fallback-secret-at-least-32-chars-long-12345";
  return createHash("sha256").update(rawSecret).digest();
}

const SECRET_KEY = getSecretKey();

export async function hashPassword(password: string) {
  return await bcrypt.hash(password, 10);
}

export async function comparePassword(password: string, hashed: string) {
  return await bcrypt.compare(password, hashed);
}

export async function createRegistrationToken(payload: any) {
  return await new EncryptJWT(payload)
    .setProtectedHeader({ alg: "dir", enc: "A256GCM" })
    .setIssuedAt()
    .setExpirationTime("10m") // OTP valid for 10 minutes
    .encrypt(SECRET_KEY);
}

export async function decryptRegistrationToken(token: string) {
  try {
    const { payload } = await jwtDecrypt(token, SECRET_KEY);
    return payload;
  } catch (error) {
    console.error("Decryption Error:", error);
    return null;
  }
}

export function generateOTP() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}
