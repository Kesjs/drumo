// Atestat: label rules, public code, and the 3-day send queue.

export const MAX_SEND_DELAY_HOURS = 72;
const FORBIDDEN = [/permis\s+de\s+conducere/i, /\bpermis\b(?!\s*PermisStart)/i, /driving\s+licen[cs]e/i];

export interface LabelConfig {
  label: string;           // app_config.certificate_label
  accredited: boolean;     // app_config.accredited
}

/**
 * Returns the label to print. While not accredited, any label that could be
 * read as a driving licence is refused and the safe default is used.
 */
export function certificateLabel(cfg: LabelConfig): string {
  const SAFE = "atestat de reușită PermisStart";
  if (cfg.accredited) return cfg.label;
  const stripped = cfg.label.replace(/PermisStart/g, "");
  return FORBIDDEN.some((re) => re.test(stripped)) ? SAFE : cfg.label;
}

// Crockford base32 without I, L, O, U: unambiguous when read aloud or typed.
const ALPHABET = "0123456789ABCDEFGHJKMNPQRSTVWXYZ";

function checksum(body: string) {
  let sum = 0;
  for (let i = 0; i < body.length; i++) sum = (sum * 31 + ALPHABET.indexOf(body[i])) % 32;
  return ALPHABET[sum];
}

/** DR-XXXX-XXXX where the last char is a checksum. */
export function generatePublicCode(randomBytes: Uint8Array): string {
  if (randomBytes.length < 7) throw new Error("need 7 random bytes");
  const body = Array.from(randomBytes.slice(0, 7), (b) => ALPHABET[b % 32]).join("");
  const full = body + checksum(body);
  return `DR-${full.slice(0, 4)}-${full.slice(4)}`;
}

export function isValidPublicCode(code: string): boolean {
  const m = /^DR-([0-9A-HJKMNP-TV-Z]{4})-([0-9A-HJKMNP-TV-Z]{4})$/.exec(code.toUpperCase().trim());
  if (!m) return false;
  const full = m[1] + m[2];
  return checksum(full.slice(0, 7)) === full[7];
}

export function scheduleSendAt(issuedAt: number, delayHours: number): number {
  const h = Math.min(Math.max(0, delayHours), MAX_SEND_DELAY_HOURS);
  return issuedAt + h * 3_600_000;
}

export interface QueuedCertificate {
  id: string;
  status: "queued" | "held" | "sent" | "revoked" | "failed";
  scheduledSendAt: number;
  sendAttempts: number;
}

export const MAX_SEND_ATTEMPTS = 5;

/** Certificates the cron job must send now. Held ones are never sent. */
export function dueForSend<T extends QueuedCertificate>(certs: T[], now: number): T[] {
  return certs.filter(
    (c) => (c.status === "queued" || (c.status === "failed" && c.sendAttempts < MAX_SEND_ATTEMPTS)) && c.scheduledSendAt <= now,
  );
}

/** Retry backoff for failed sends; still bounded by the 72 h promise when possible. */
export function nextRetryAt(now: number, attempts: number) {
  return now + Math.min(6, 2 ** attempts) * 15 * 60_000;
}
