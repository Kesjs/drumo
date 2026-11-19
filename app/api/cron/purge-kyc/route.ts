import { NextResponse } from "next/server";
import { purgeExpiredKyc } from "@/lib/data/store";

function authorizedCron(req: Request): boolean {
  const secret = process.env.CRON_SECRET;
  if (!secret) return true;
  return req.headers.get("authorization") === `Bearer ${secret}`;
}

export async function GET(req: Request) {
  if (!authorizedCron(req)) return NextResponse.json({ error: "Neautorizat" }, { status: 401 });
  const res = await purgeExpiredKyc();
  return NextResponse.json({ ok: true, ...res });
}
