import Link from "next/link";
import { PublicHeader, PublicFooter } from "@/components/site-chrome";
import { getCurrentUser, verifyCertificatePublic } from "@/lib/data/store";
import { formatRoDate } from "@/lib/i18n";
import { isValidPublicCode } from "@/lib/domain/certificate";
import { CheckCircle2, AlertTriangle } from "lucide-react";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: { params: Promise<{ cod: string }> }) {
  const { cod } = await params;
  return { title: `Verificare ${cod.toUpperCase()}` };
}

export default async function VerifyCodePage({ params }: { params: Promise<{ cod: string }> }) {
  const { cod } = await params;
  const [user, cert] = await Promise.all([getCurrentUser(), verifyCertificatePublic(cod)]);
  const checksumOk = isValidPublicCode(cod);

  return (
    <>
      <PublicHeader loggedIn={Boolean(user)} />
      <main className="mx-auto max-w-2xl px-5 py-16">
        <Link href="/verificare" className="text-sm font-semibold text-sign underline underline-offset-4">
          ← Caută alt cod
        </Link>

        <h1 className="mt-6 font-cond text-4xl font-bold">Verificare cod atestat</h1>

        {cert && cert.valid ? (
          <div className="mt-6 rounded-lg border-2 border-asphalt bg-surface p-6">
            <div className="flex items-center gap-2 text-ok">
              <CheckCircle2 className="h-5 w-5" />
              <span className="font-semibold">Atestat valid înregistrat</span>
            </div>

            <dl className="mt-6 space-y-3 text-sm">
              <div className="flex justify-between border-b border-line pb-2">
                <dt className="text-mute">Document</dt>
                <dd className="font-semibold">{cert.label}</dd>
              </div>
              <div className="flex justify-between border-b border-line pb-2">
                <dt className="text-mute">Cod unic</dt>
                <dd className="font-mono font-medium">{cert.public_code}</dd>
              </div>
              <div className="flex justify-between border-b border-line pb-2">
                <dt className="text-mute">Titular</dt>
                <dd className="font-medium">{cert.holder_masked}</dd>
              </div>
              <div className="flex justify-between border-b border-line pb-2">
                <dt className="text-mute">Categorie</dt>
                <dd className="font-mono font-medium">{cert.category_code}</dd>
              </div>
              <div className="flex justify-between border-b border-line pb-2">
                <dt className="text-mute">Scor examen</dt>
                <dd className="font-mono font-medium tabular-nums">
                  {cert.score} / {cert.total}
                </dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-mute">Data emiterii</dt>
                <dd className="font-mono">{formatRoDate(cert.issued_at)}</dd>
              </div>
            </dl>

            {!cert.accredited ? (
              <p className="mt-6 rounded border border-asphalt bg-chalk p-4 text-xs text-asphalt">
                Acest atestat confirmă rezultatul obținut pe platforma PermiStart. Nu este permis de conducere și nu
                înlocuiește examenul oficial organizat de autorități.
              </p>
            ) : null}
          </div>
        ) : (
          <div className="mt-6 rounded-lg border-2 border-danger bg-surface p-6">
            <div className="flex items-center gap-2 text-danger">
              <AlertTriangle className="h-5 w-5" />
              <span className="font-semibold">
                {cert?.status === "revoked"
                  ? "Atestat revocat"
                  : checksumOk
                    ? "Codul nu figurează în registru"
                    : "Format sau cifră de control invalidă"}
              </span>
            </div>
            <p className="mt-2 text-sm text-mute">
              Verifică dacă ai transcris corect codul de pe document (ex.{" "}
              <span className="font-mono text-asphalt">DR-XXXX-XXXX</span>).
            </p>
          </div>
        )}
      </main>
      <PublicFooter />
    </>
  );
}
