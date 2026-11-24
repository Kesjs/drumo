import Link from "next/link";
import QRCode from "qrcode";
import { AppShell } from "@/components/app-shell";
import { NoticeBox, Panel, StatusTag } from "@/components/ui/primitives";
import { requireCandidateSnapshot } from "@/lib/data/require-user";
import { SITE_URL } from "@/lib/config";
import { formatRoDateTime } from "@/lib/i18n";

export const metadata = { title: "Atestat de reușită" };
export const dynamic = "force-dynamic";

export default async function CertificatePage() {
  const snap = await requireCandidateSnapshot("/atestat");

  const withQr = await Promise.all(
    snap.certificates.map(async (c) => {
      const verifyUrl = `${SITE_URL}/verificare/${encodeURIComponent(c.public_code)}`;
      const qr = await QRCode.toDataURL(verifyUrl, { width: 160, margin: 1 });
      return { cert: c, verifyUrl, qr };
    }),
  );

  return (
    <AppShell
      userName={`${snap.user.first_name} ${snap.user.last_name}`}
      categoryCode={snap.category.code}
      role={snap.user.role}
      coursesUnlocked={snap.access.coursesUnlocked}
      examUnlocked={snap.access.examUnlocked}
    >
      <div className="max-w-3xl space-y-6">
        <div>
          <h1 className="font-cond text-3xl font-bold md:text-4xl">Atestat de reușită PermisStart</h1>
          <p className="mt-1 text-sm text-mute">
            După promovarea examenului, atestatul PDF este programat pentru trimitere automată pe e-mail în maximum 3
            zile.
          </p>
        </div>

        <NoticeBox tone="info" title="Mențiune legală">
          Atestatul de reușită PermisStart confirmă rezultatul obținut pe platformă. Nu este permis de conducere și nu
          înlocuiește examenul oficial organizat de autorități.
        </NoticeBox>

        {withQr.length === 0 ? (
          <Panel>
            <p className="text-sm text-mute">
              Nu ai încă niciun atestat emis. Promovează examenul teoretic pentru a genera atestatul cu cod QR.
            </p>
            <Link
              href="/examen/briefing"
              className="mt-4 inline-flex min-h-[40px] items-center rounded border-2 border-asphalt bg-signal px-4 text-xs font-semibold text-asphalt"
            >
              Verifică accesul la examen
            </Link>
          </Panel>
        ) : (
          <div className="space-y-5">
            {withQr.map(({ cert, verifyUrl, qr }) => (
              <Panel key={cert.id} strong className="space-y-4">
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div>
                    <p className="font-mono text-xs text-sign">{cert.public_code}</p>
                    <h2 className="mt-1 font-cond text-2xl font-bold capitalize">{cert.label_snapshot}</h2>
                    <p className="mt-1 text-sm text-mute">
                      Titular: <strong className="text-asphalt">{cert.holder_name}</strong> · Categorie{" "}
                      <strong className="font-mono text-asphalt">{cert.category_code}</strong> · Scor{" "}
                      <strong className="font-mono tabular-nums text-asphalt">
                        {cert.score}/{cert.total}
                      </strong>
                    </p>
                  </div>

                  <StatusTag
                    tone={
                      cert.status === "sent"
                        ? "ok"
                        : cert.status === "held" || cert.status === "revoked"
                          ? "danger"
                          : "signal"
                    }
                  >
                    {cert.status === "sent"
                      ? "Trimis pe e-mail"
                      : cert.status === "held"
                        ? "Reținut pentru verificare"
                        : cert.status === "revoked"
                          ? "Revocat"
                          : "Programat în coada de trimitere"}
                  </StatusTag>
                </div>

                <div className="flex flex-wrap items-center justify-between gap-4 rounded border border-line bg-chalk p-4">
                  <div className="space-y-1 text-xs text-mute">
                    <p>Emis la: {formatRoDateTime(cert.issued_at)}</p>
                    <p>
                      {cert.sent_at
                        ? `Trimis la: ${formatRoDateTime(cert.sent_at)}`
                        : `Termen maxim trimitere automată: ${formatRoDateTime(cert.scheduled_send_at)}`}
                    </p>
                    {cert.hold_reason ? <p className="text-danger">Motiv reținere: {cert.hold_reason}</p> : null}
                    <div className="pt-2 flex flex-wrap gap-3">
                      {cert.status !== "held" && cert.status !== "revoked" ? (
                        <a
                          href={`/api/certificates/${encodeURIComponent(cert.public_code)}/pdf`}
                          className="inline-flex min-h-[40px] items-center rounded border-2 border-asphalt bg-signal px-4 text-xs font-semibold text-asphalt"
                        >
                          Descarcă PDF
                        </a>
                      ) : null}
                      <Link
                        href={`/verificare/${cert.public_code}`}
                        className="inline-flex min-h-[40px] items-center rounded border border-asphalt bg-surface px-4 text-xs font-semibold text-asphalt"
                      >
                        Pagină publică QR
                      </Link>
                    </div>
                  </div>

                  <a href={verifyUrl} target="_blank" rel="noreferrer" className="shrink-0">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={qr}
                      alt={`Cod QR pentru verificarea atestatului ${cert.public_code}`}
                      className="h-28 w-28 rounded border border-line bg-white p-1"
                    />
                  </a>
                </div>
              </Panel>
            ))}
          </div>
        )}
      </div>
    </AppShell>
  );
}
