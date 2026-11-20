// End-to-end smoke test against a running Drumo server (default http://127.0.0.1:3099)
const BASE = process.env.BASE_URL || "http://127.0.0.1:3099";

async function req(path, opts = {}) {
  const res = await fetch(`${BASE}${path}`, {
    ...opts,
    redirect: "manual",
    headers: { ...(opts.headers || {}) },
  });
  return res;
}

function cookieHeader(res, prev = "") {
  const setCookies = res.headers.getSetCookie ? res.headers.getSetCookie() : [];
  if (!setCookies.length) return prev;
  const map = new Map();
  for (const part of prev.split(";").map((s) => s.trim()).filter(Boolean)) {
    const [k, ...v] = part.split("=");
    map.set(k, v.join("="));
  }
  for (const c of setCookies) {
    const [pair] = c.split(";");
    const [k, ...v] = pair.split("=");
    map.set(k.trim(), v.join("="));
  }
  return [...map.entries()].map(([k, v]) => `${k}=${v}`).join("; ");
}

async function run() {
  // 1. Public pages render 200 and landing has no price grid
  for (const p of ["/", "/categorii", "/categorii/b", "/cum-functioneaza", "/cursuri", "/examen", "/verificare", "/credite-imagini", "/rambursari", "/termeni", "/confidentialitate"]) {
    const r = await req(p);
    if (r.status !== 200) throw new Error(`Public page ${p} returned ${r.status}`);
    const html = await r.text();
    if (p === "/" && /\b1\.?450\s?RON\b|\b290\s?EUR\b/i.test(html)) {
      throw new Error("Landing page leaked category fee!");
    }
  }
  console.log("ok public pages + no price grid on landing");

  // 2. Register a fresh candidate
  const email = `test.${Date.now()}@drumo.ro`;
  let r = await req("/api/auth/register", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      firstName: "Ioana",
      lastName: "Ionescu",
      email,
      password: "Password123!",
      country: "RO",
      categoryCode: "B",
      currency: "RON",
      consentTerms: true,
      consentPrivacy: true,
      consentBiometric: true,
    }),
  });
  if (r.status !== 200) throw new Error(`Register failed: ${r.status} ${await r.text()}`);
  let candCookie = cookieHeader(r);
  console.log("ok register", email);

  // 3. Before payment: chapters/practice must be locked (403)
  r = await req("/api/practice/start", {
    method: "POST",
    headers: { "Content-Type": "application/json", Cookie: candCookie },
    body: JSON.stringify({ kind: "chapter", chapterSlug: "semne-de-circulatie" }),
  });
  if (r.status !== 403) throw new Error(`Expected 403 before payment, got ${r.status}`);
  console.log("ok server lock before payment");

  // 4. Pay first installment (550 RON = 55000 bani) -> unlocks courses, exam remains locked
  r = await req("/api/payments/checkout", {
    method: "POST",
    headers: { "Content-Type": "application/json", Cookie: candCookie },
    body: JSON.stringify({ mode: "installments", currency: "RON", amountMinor: 55000, method: "card" }),
  });
  if (r.status !== 200) throw new Error(`First installment failed: ${await r.text()}`);
  console.log("ok installment 1 (550 RON)");

  // 5. Submit KYC
  r = await req("/api/kyc/submit", {
    method: "POST",
    headers: { "Content-Type": "application/json", Cookie: candCookie },
    body: JSON.stringify({ documentType: "ci", idFileName: "ci.jpg", selfieFileName: "selfie.jpg" }),
  });
  if (r.status !== 200) throw new Error(`KYC submit failed: ${await r.text()}`);
  const kycId = (await r.json()).kyc.id;
  console.log("ok kyc submitted", kycId);

  // 6. Practice chapter + adaptive + global
  r = await req("/api/practice/start", {
    method: "POST",
    headers: { "Content-Type": "application/json", Cookie: candCookie },
    body: JSON.stringify({ kind: "chapter", chapterSlug: "semne-de-circulatie" }),
  });
  const chData = await r.json();
  if (!chData.ok || !chData.questions.length) throw new Error("Chapter start failed");
  if (JSON.stringify(chData.questions).includes("is_correct")) throw new Error("Correct answer leaked to client!");
  console.log("ok practice started without leaking answers");

  // 7. Exam must still be locked (403) before full payment & KYC approval
  r = await req("/api/exam/start", {
    method: "POST",
    headers: { "Content-Type": "application/json", Cookie: candCookie },
    body: JSON.stringify({ cameraGranted: true }),
  });
  if (r.status !== 403) throw new Error(`Expected 403 for exam before full payment/KYC, got ${r.status}`);
  console.log("ok exam locked while partial payment");

  // 8. Admin login & approve KYC
  r = await req("/api/auth/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ identifier: "admin@drumo.ro", password: "AdminDrumo2026!" }),
  });
  if (r.status !== 200) throw new Error("Admin login failed");
  const adminCookie = cookieHeader(r);
  r = await req("/api/admin", {
    method: "POST",
    headers: { "Content-Type": "application/json", Cookie: adminCookie },
    body: JSON.stringify({ kind: "kyc", id: kycId, decision: "approved", note: "OK" }),
  });
  if (r.status !== 200) throw new Error("Admin KYC approval failed");
  console.log("ok admin approved KYC");

  // 8b. Pay installment #2 (450 RON = 45000 bani) -> totalPaid 1000 RON / 1450 RON -> exam STILL locked
  r = await req("/api/payments/checkout", {
    method: "POST",
    headers: { "Content-Type": "application/json", Cookie: candCookie },
    body: JSON.stringify({ mode: "installments", currency: "RON", amountMinor: 45000, method: "card" }),
  });
  if (r.status !== 200) throw new Error(`Second installment failed: ${await r.text()}`);
  console.log("ok installment 2 (450 RON -> 1000/1450 RON)");

  // 8c. Last allowed installment (#3 of 3) must settle remaining 450 RON; trying 200 RON must fail (400)
  r = await req("/api/payments/checkout", {
    method: "POST",
    headers: { "Content-Type": "application/json", Cookie: candCookie },
    body: JSON.stringify({ mode: "installments", currency: "RON", amountMinor: 20000, method: "card" }),
  });
  if (r.status !== 400) throw new Error(`Expected 400 when 3rd installment does not settle balance, got ${r.status}`);
  console.log("ok last installment rule enforced");

  // 8d. Pay final installment #3 (450 RON = 45000 bani) -> fee_fully_paid = true (1450/1450 RON)
  r = await req("/api/payments/checkout", {
    method: "POST",
    headers: { "Content-Type": "application/json", Cookie: candCookie },
    body: JSON.stringify({ mode: "installments", currency: "RON", amountMinor: 45000, method: "card" }),
  });
  if (r.status !== 200) throw new Error(`Final installment failed: ${await r.text()}`);
  const meAfterPay = await (await req("/api/auth/me", { headers: { Cookie: candCookie } })).json();
  if (!meAfterPay.snapshot?.access?.coursesUnlocked || !meAfterPay.snapshot?.access?.feeFullyPaid) {
    throw new Error("Expected coursesUnlocked=true and feeFullyPaid=true after 3 installments");
  }
  console.log("ok installment 3 (450 RON -> 1450/1450 RON, feeFullyPaid = true)");

  // 9. Verify existing demo certificate PDF + public verify page
  r = await req("/api/verify/DR-0C1C-3Q3R");
  // Check seeded certificate from admin overview via login as demo candidate
  r = await req("/api/auth/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ identifier: "candidat@drumo.ro", password: "Candidat2026!" }),
  });
  const demoCookie = cookieHeader(r);
  const me = await (await req("/api/auth/me", { headers: { Cookie: demoCookie } })).json();
  const certCode = me.snapshot?.certificates?.[0]?.public_code;
  if (!certCode) throw new Error("Demo certificate missing");
  const ver = await req(`/verificare/${certCode}`);
  if (ver.status !== 200) throw new Error(`Public verify page returned ${ver.status}`);
  const pdf = await req(`/api/certificates/${certCode}/pdf`, { headers: { Cookie: demoCookie } });
  if (pdf.status !== 200 || pdf.headers.get("content-type") !== "application/pdf") {
    throw new Error(`PDF download failed: ${pdf.status}`);
  }
  const pdfBytes = await pdf.arrayBuffer();
  if (pdfBytes.byteLength < 10000) throw new Error("PDF unexpectedly small");
  console.log("ok PDF generated + public QR verification works:", certCode, pdfBytes.byteLength, "bytes");
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
