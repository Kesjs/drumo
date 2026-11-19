import "server-only";
import crypto from "node:crypto";
import { cookies } from "next/headers";

export const LOCAL_SESSION_COOKIE = "ep_session";

function secret() {
  return process.env.SESSION_SECRET || "drumo-local-dev-secret-do-not-use-in-prod";
}

export function signSessionToken(userId: string): string {
  const payload = Buffer.from(JSON.stringify({ uid: userId, iat: Date.now() })).toString("base64url");
  const sig = crypto.createHmac("sha256", secret()).update(payload).digest("base64url");
  return `${payload}.${sig}`;
}

export function verifySessionToken(token: string | undefined): string | null {
  if (!token || !token.includes(".")) return null;
  const [payload, sig] = token.split(".");
  const expected = crypto.createHmac("sha256", secret()).update(payload).digest("base64url");
  if (!crypto.timingSafeEqual(Buffer.from(sig), Buffer.from(expected))) return null;
  try {
    const parsed = JSON.parse(Buffer.from(payload, "base64url").toString("utf8"));
    return typeof parsed.uid === "string" ? parsed.uid : null;
  } catch {
    return null;
  }
}

export async function getLocalSessionUserId(): Promise<string | null> {
  const store = await cookies();
  return verifySessionToken(store.get(LOCAL_SESSION_COOKIE)?.value);
}

export function hashPassword(password: string, salt?: string): string {
  const s = salt ?? crypto.randomBytes(16).toString("hex");
  const hash = crypto.scryptSync(password, s, 32).toString("hex");
  return `${s}:${hash}`;
}

export function verifyPassword(password: string, stored: string): boolean {
  const [s, expected] = stored.split(":");
  if (!s || !expected) return false;
  const actual = crypto.scryptSync(password, s, 32).toString("hex");
  return crypto.timingSafeEqual(Buffer.from(actual, "hex"), Buffer.from(expected, "hex"));
}
