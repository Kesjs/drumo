# Drumo — Pregătire și testare teoretică auto (ro-RO)

Platformă web (PWA mobile-first) pentru pregătirea și examinarea teoretică a candidaților la permisul auto (piața România / UE).

## Stack
- **Next.js App Router** + TypeScript + Tailwind CSS + Framer Motion + Lucide + Radix UI
- **Supabase** (Auth, Postgres, Storage privat criptat pentru KYC/certificate/audio, RLS strict)
- **Stripe** (card, Apple Pay / Google Pay, transfer instant, webhook idempotent, RON & EUR)
- **Resend** (chitanțe și trimitere automată atestate PDF)
- **PDF + QR** (`pdf-lib` + `@pdf-lib/fontkit` + `qrcode`, fonturi IBM Plex cu diacritice românești `ș`, `ț`)

## Pornire locală

```bash
npm install
npm run dev      # http://localhost:3000
npm test         # Vitest (plăți în tranșe, blocaje acces, cronometru examen, antifraudă, coadă 3 zile, motor adaptiv)
npm run build
```

Când variabilele `NEXT_PUBLIC_SUPABASE_URL` / `STRIPE_SECRET_KEY` / `RESEND_API_KEY` nu sunt completate încă (vezi `.env.example`), aplicația folosește un mod local de testare (date persistate temporar în `os.tmpdir()`) pentru a putea testa întregul parcurs candidat și panoul `/admin`.

## Înainte de publicarea în producție
1. Completează datele juridice ale operatorului în `lib/config.ts` (`LEGAL_ENTITY`: denumire firmă, CUI, nr. reg. com., adresă, telefon).
2. Aplică `supabase/migrations/0001_init.sql` și `supabase/seed/0001_seed.sql` pe proiectul Supabase din UE (`eu-central-1` / `eu-west-1`).
3. Configurează webhook-ul Stripe către `/api/stripe/webhook` și variabilele din `.env.example` în Vercel.
4. Validează juridic în România:
   - textul privind statutul documentului (**atestat de reușită Drumo**, nu permis de conducere);
   - politica de rambursare afișată înainte de plată;
   - DPIA (evaluare de impact RGPD art. 9) pentru selfie + act de identitate (retenție 30 zile cu ștergere automată via `/api/cron/purge-kyc`).
5. Înregistrează fișierele audio umane per capitol (`audio_path` în `chapters`); până atunci, playerul folosește sinteza vocală `ro-RO`.
6. Fotografiază pe teren indicatoarele listate în pagina `/credite-imagini` (`SIGNS_TO_PHOTOGRAPH` din `lib/data/seed-content.ts`) și adaugă-le prin `scripts/fetch-images.mjs` / `credits.json`.
