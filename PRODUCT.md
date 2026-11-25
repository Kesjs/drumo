# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

Candidates preparing the theory part of a driving licence in Romania (and EU residents choosing Romania's framework), mostly on a phone, often in short sessions (commute, evening). Job: learn the rules chapter by chapter, know honestly whether they are ready, then sit a supervised online theory test and receive proof of success.

Secondary: PermiStart staff (admins, KYC reviewers) operating candidates, payments, question bank, fraud reports and the certificate send queue.

## Product Purpose

PermiStart combines training and a supervised online theory test. A candidate pays one fee that depends on the licence category (AM, A1, A2, A, B1, B, BE, C, CE, D…), either in full or in instalments, learns through detailed chapters (real images, recorded audio), is assessed adaptively, and unlocks the exam once readiness is reached and the fee is fully paid. Success produces an "atestat de reușită PermiStart" emailed within 3 days, with a unique number and a public QR verification page.

Success = candidates who pass are genuinely prepared; zero confusion between the atestat and an official driving licence.

## Positioning

One fee per category, no subscription, no packages. Courses unlock at the first instalment; the exam unlocks only when the fee is fully paid AND readiness is proven by the adaptive/global evaluation. Exam integrity is enforced server-side (per-question timer, no going back, camera, focus log, random draw).

## Operating Context

- Mobile-first PWA, Romanian (ro-RO) UI, i18n-ready.
- Payment: card, Apple Pay / Google Pay, instant bank transfer, via Stripe; RON and EUR. Receipt by email after every payment. Refund policy shown before any payment.
- KYC: ID document + selfie, manual admin review for doubtful cases. Short retention, automatic deletion, encryption, audit log (GDPR).
- Lesson audio: human recording first, Romanian TTS later as a fallback.
- Content: original courses and questions written from the Romanian Highway Code (OUG 195/2002, HG 1391/2006), to be reviewed by a licensed instructor.

## Capabilities and Constraints

- Stack (fixed by the owner): Next.js App Router + TypeScript + Tailwind + shadcn/ui + Framer Motion, Supabase (auth, Postgres, encrypted storage, strict RLS), Stripe, Vercel.
- Locks (courses, exam) are enforced server-side via RLS and verified Stripe webhooks, never only in the UI.
- Category fee, minimum first instalment, thresholds are configured in the `categories` table; prices are shown only during signup, never in a public price grid.
- Legal: the document is named "atestat de reușită PermiStart". Never "permis" / "permis de conducere", never implies it replaces the official exam. A config flag changes the label if an accreditation ever exists.
- Undecided: company legal identity (name, CUI, address) for the footer and legal pages; final category fees.

## Brand Commitments

- Name: PermiStart (provisional).
- Voice: calm, natural Romanian, administrative but human. Correct diacritics (ș, ț with comma below).
- Owner-pinned identity: "administratif moderne". Asphalt #18202b, chalk #f5f6f3, ONE signal-yellow accent #f2b705, sign blue #0b4ea2 in touches. IBM Plex Sans, Sans Condensed, Mono.
- Forbidden: purple gradients, gratuitous glassmorphism, emoji as icons, identical card grids, generic 3D illustrations, lorem ipsum.

## Evidence on Hand

- No testimonials, no statistics, no partner logos exist. None may be fabricated.
- Images: real Romanian road signs and road photos from clearly licensed sources only (Wikimedia Commons, Unsplash, Pexels, Pixabay, Mapillary), self-hosted, credited in `credits.json` and on the "Credite imagini" page.
- Product screenshots: the landing uses product mockups built in code, labelled as illustrative where values are synthetic.

## Product Principles

1. Honesty over persuasion: say what the atestat is and is not before any payment.
2. The server is the source of truth for every lock, timer and score.
3. Readiness is earned, not bought: paying never skips the evaluation.
4. Calm under pressure: the exam room removes everything that is not the question.
5. Data minimalism: collect identity only to secure the exam, delete it fast.

## Accessibility & Inclusion

WCAG 2.1 AA. Audio for lessons and exam questions (replay, mute). Keyboard-operable exam. Reduced-motion respected. Lighthouse mobile > 90.
