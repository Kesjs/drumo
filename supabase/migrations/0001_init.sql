-- Drumo initial schema. Strict RLS everywhere: the client can only read
-- what it owns; every lock (courses, exam) is derived from server-written state.

create extension if not exists pgcrypto;

-- ---------------------------------------------------------------------------
-- Enums
-- ---------------------------------------------------------------------------
create type user_role as enum ('candidate', 'reviewer', 'admin');
create type kyc_status as enum ('not_started', 'pending', 'manual_review', 'approved', 'rejected');
create type payment_mode as enum ('full', 'installments');
create type payment_status as enum ('pending', 'succeeded', 'failed', 'refunded', 'canceled');
create type currency_code as enum ('RON', 'EUR');
create type attempt_kind as enum ('chapter', 'adaptive', 'global', 'exam');
create type exam_status as enum ('briefing', 'in_progress', 'finished', 'aborted');
create type certificate_status as enum ('queued', 'held', 'sent', 'revoked', 'failed');
create type security_event_type as enum ('blur', 'tab_hidden', 'fullscreen_exit', 'camera_lost', 'camera_denied', 'copy', 'paste', 'context_menu', 'devtools', 'multiple_faces', 'no_face', 'network_lost');

-- ---------------------------------------------------------------------------
-- Configuration
-- ---------------------------------------------------------------------------
create table app_config (
  key text primary key,
  value jsonb not null,
  updated_at timestamptz not null default now()
);

insert into app_config (key, value) values
  ('certificate_label', '"atestat de reușită Drumo"'),
  ('accredited', 'false'),
  ('certificate_send_delay_hours', '72'),
  ('kyc_retention_days', '30'),
  ('eur_ron_display_rate', '4.97');

create table categories (
  id uuid primary key default gen_random_uuid(),
  code text not null unique,                 -- AM, A1, A2, A, B1, B, BE, C, CE, D...
  slug text not null unique,
  name_ro text not null,
  short_ro text not null,
  description_ro text not null,
  min_age int not null,
  fee_ron int not null check (fee_ron > 0),                -- in bani (1/100 RON)
  fee_eur int not null check (fee_eur > 0),                -- in cents
  min_first_installment_ron int not null,
  min_first_installment_eur int not null,
  max_installments int not null default 3 check (max_installments between 1 and 6),
  exam_question_count int not null default 26,
  exam_pass_mark int not null default 22,
  seconds_per_question int not null default 60,
  readiness_threshold int not null default 80 check (readiness_threshold between 50 and 100),
  sort_order int not null default 0,
  active boolean not null default true,
  check (min_first_installment_ron > 0 and min_first_installment_ron <= fee_ron),
  check (min_first_installment_eur > 0 and min_first_installment_eur <= fee_eur),
  check (exam_pass_mark <= exam_question_count)
);

-- ---------------------------------------------------------------------------
-- People
-- ---------------------------------------------------------------------------
create table profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  first_name text not null,
  last_name text not null,
  email text,
  phone text,
  country char(2) not null,
  category_id uuid references categories(id),
  currency currency_code not null default 'RON',
  role user_role not null default 'candidate',
  locale text not null default 'ro',
  consent_terms_at timestamptz,
  consent_privacy_at timestamptz,
  consent_biometric_at timestamptz,          -- explicit consent for selfie (GDPR art. 9)
  consent_marketing_at timestamptz,
  created_at timestamptz not null default now(),
  check (email is not null or phone is not null)
);

create or replace function is_staff(uid uuid) returns boolean
language sql stable security definer set search_path = public as $$
  select exists (select 1 from profiles where id = uid and role in ('admin', 'reviewer'));
$$;

create or replace function is_admin(uid uuid) returns boolean
language sql stable security definer set search_path = public as $$
  select exists (select 1 from profiles where id = uid and role = 'admin');
$$;

create table kyc_submissions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references profiles(id) on delete cascade,
  id_document_path text,                     -- private bucket "kyc", encrypted at rest
  selfie_path text,
  document_type text check (document_type in ('ci', 'passport', 'eu_id')),
  status kyc_status not null default 'pending',
  risk_flags text[] not null default '{}',
  reviewer_id uuid references profiles(id),
  reviewer_note text,
  submitted_at timestamptz not null default now(),
  reviewed_at timestamptz,
  purge_after timestamptz not null,
  purged_at timestamptz
);
create index on kyc_submissions (user_id, submitted_at desc);
create index on kyc_submissions (status) where purged_at is null;

-- ---------------------------------------------------------------------------
-- Money. Only the Stripe webhook (service role) writes here.
-- ---------------------------------------------------------------------------
create table enrollments (
  user_id uuid primary key references profiles(id) on delete cascade,
  category_id uuid not null references categories(id),
  currency currency_code not null,
  mode payment_mode not null,
  total_due int not null,
  total_paid int not null default 0,
  courses_unlocked boolean generated always as (total_paid > 0) stored,
  fee_fully_paid boolean generated always as (total_paid >= total_due) stored,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table payments (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references profiles(id) on delete cascade,
  category_id uuid not null references categories(id),
  mode payment_mode not null,
  installment_no int not null default 1,
  amount int not null check (amount > 0),
  currency currency_code not null,
  status payment_status not null default 'pending',
  method text,
  stripe_checkout_session text unique,
  stripe_payment_intent text unique,
  receipt_url text,
  refunded_amount int not null default 0,
  created_at timestamptz not null default now(),
  paid_at timestamptz
);
create index on payments (user_id, created_at desc);

create table stripe_events (
  id text primary key,                        -- idempotency for webhooks
  type text not null,
  received_at timestamptz not null default now()
);

create table refund_requests (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references profiles(id) on delete cascade,
  payment_id uuid references payments(id),
  reason text not null,
  status text not null default 'open' check (status in ('open', 'approved', 'rejected')),
  created_at timestamptz not null default now(),
  decided_at timestamptz,
  decided_by uuid references profiles(id)
);

-- ---------------------------------------------------------------------------
-- Content
-- ---------------------------------------------------------------------------
create table media (
  id uuid primary key default gen_random_uuid(),
  path text not null unique,
  alt_ro text not null,
  width int, height int,
  source text not null,
  source_url text not null,
  author text not null,
  license text not null,
  retrieved_at date not null,
  flagged boolean not null default false
);

create table chapters (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  title_ro text not null,
  summary_ro text not null,
  key_points_ro text[] not null default '{}',
  cover_media_id uuid references media(id),
  audio_path text,                            -- human recording; TTS fallback later
  audio_kind text check (audio_kind in ('human', 'tts')),
  minutes int not null default 15,
  sort_order int not null default 0,
  published boolean not null default false
);

create table chapter_categories (
  chapter_id uuid references chapters(id) on delete cascade,
  category_id uuid references categories(id) on delete cascade,
  primary key (chapter_id, category_id)
);

create table lesson_blocks (
  id uuid primary key default gen_random_uuid(),
  chapter_id uuid not null references chapters(id) on delete cascade,
  sort_order int not null,
  kind text not null check (kind in ('heading', 'text', 'image', 'rule', 'example', 'warning')),
  body_ro text,
  media_id uuid references media(id),
  legal_ref text                              -- e.g. "OUG 195/2002, art. 49"
);
create index on lesson_blocks (chapter_id, sort_order);

create table questions (
  id uuid primary key default gen_random_uuid(),
  chapter_id uuid not null references chapters(id) on delete cascade,
  difficulty smallint not null check (difficulty between 1 and 5),
  stem_ro text not null,
  media_id uuid references media(id),
  audio_path text,
  exam_pool boolean not null default false,  -- exam-only questions never leak into practice
  multi boolean not null default false,
  explanation_ro text not null,
  legal_ref text,
  active boolean not null default true,
  created_at timestamptz not null default now()
);
create index on questions (chapter_id, difficulty) where active;

create table question_categories (
  question_id uuid references questions(id) on delete cascade,
  category_id uuid references categories(id) on delete cascade,
  primary key (question_id, category_id)
);

create table answer_options (
  id uuid primary key default gen_random_uuid(),
  question_id uuid not null references questions(id) on delete cascade,
  label text not null check (label in ('A', 'B', 'C', 'D')),
  body_ro text not null,
  is_correct boolean not null,
  unique (question_id, label)
);

-- ---------------------------------------------------------------------------
-- Learning state
-- ---------------------------------------------------------------------------
create table chapter_progress (
  user_id uuid references profiles(id) on delete cascade,
  chapter_id uuid references chapters(id) on delete cascade,
  summary_read_at timestamptz,
  lesson_completed_at timestamptz,
  best_test_score int,
  primary key (user_id, chapter_id)
);

create table attempts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references profiles(id) on delete cascade,
  kind attempt_kind not null,
  chapter_id uuid references chapters(id),
  question_ids uuid[] not null,
  started_at timestamptz not null default now(),
  finished_at timestamptz,
  score int,
  total int
);
create index on attempts (user_id, kind, started_at desc);

create table attempt_answers (
  attempt_id uuid references attempts(id) on delete cascade,
  question_id uuid references questions(id),
  chosen text[] not null default '{}',
  correct boolean not null,
  ms_taken int,
  answered_at timestamptz not null default now(),
  primary key (attempt_id, question_id)
);

-- Spaced repetition per chapter (SM-2 inspired)
create table mastery (
  user_id uuid references profiles(id) on delete cascade,
  chapter_id uuid references chapters(id) on delete cascade,
  ease numeric(4,2) not null default 2.5,
  interval_days numeric(6,2) not null default 0,
  streak int not null default 0,
  seen int not null default 0,
  correct int not null default 0,
  ability numeric(4,2) not null default 2.0,  -- 1..5, drives difficulty selection
  due_at timestamptz not null default now(),
  primary key (user_id, chapter_id)
);

create table readiness (
  user_id uuid primary key references profiles(id) on delete cascade,
  score int not null check (score between 0 and 100),
  global_attempt_id uuid references attempts(id),
  computed_at timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- Exam
-- ---------------------------------------------------------------------------
create table exam_sessions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references profiles(id) on delete cascade,
  category_id uuid not null references categories(id),
  question_ids uuid[] not null,
  current_index int not null default 0,
  question_started_at timestamptz,
  question_deadline timestamptz,
  seconds_per_question int not null,
  pass_mark int not null,
  status exam_status not null default 'briefing',
  camera_granted boolean not null default false,
  score int,
  passed boolean,
  started_at timestamptz,
  finished_at timestamptz,
  created_at timestamptz not null default now()
);
create unique index one_active_exam on exam_sessions (user_id) where status in ('briefing', 'in_progress');

create table exam_answers (
  session_id uuid references exam_sessions(id) on delete cascade,
  idx int not null,
  question_id uuid not null references questions(id),
  chosen text[] not null default '{}',
  correct boolean not null,
  timed_out boolean not null default false,
  answered_at timestamptz not null default now(),
  primary key (session_id, idx)
);

create table security_events (
  id bigserial primary key,
  session_id uuid not null references exam_sessions(id) on delete cascade,
  type security_event_type not null,
  question_index int,
  at timestamptz not null default now(),
  client_at timestamptz,
  meta jsonb not null default '{}'
);
create index on security_events (session_id, at);

-- ---------------------------------------------------------------------------
-- Certificates (atestate) + send queue
-- ---------------------------------------------------------------------------
create table certificates (
  id uuid primary key default gen_random_uuid(),
  public_code text not null unique,           -- DR-XXXX-XXXX
  user_id uuid not null references profiles(id) on delete cascade,
  session_id uuid not null unique references exam_sessions(id),
  category_code text not null,
  holder_name text not null,
  score int not null,
  total int not null,
  label_snapshot text not null,
  issued_at timestamptz not null default now(),
  scheduled_send_at timestamptz not null,
  status certificate_status not null default 'queued',
  hold_reason text,
  held_by uuid references profiles(id),
  sent_at timestamptz,
  send_attempts int not null default 0,
  last_error text,
  pdf_path text,
  check (scheduled_send_at <= issued_at + interval '72 hours')
);
create index on certificates (status, scheduled_send_at);

-- ---------------------------------------------------------------------------
-- Audit log (append-only)
-- ---------------------------------------------------------------------------
create table audit_log (
  id bigserial primary key,
  actor_id uuid,
  action text not null,
  entity text not null,
  entity_id text,
  diff jsonb,
  ip inet,
  at timestamptz not null default now()
);
create index on audit_log (entity, entity_id);
create or replace function audit_log_immutable() returns trigger language plpgsql as $$
begin raise exception 'audit_log is append-only'; end; $$;
create trigger audit_log_no_update before update or delete on audit_log
  for each row execute function audit_log_immutable();

-- ---------------------------------------------------------------------------
-- Derived permission helpers (used by RLS and API)
-- ---------------------------------------------------------------------------
create or replace function courses_unlocked(uid uuid) returns boolean
language sql stable security definer set search_path = public as $$
  select coalesce((select courses_unlocked from enrollments where user_id = uid), false);
$$;

create or replace function exam_eligibility(uid uuid)
returns table (fee_fully_paid boolean, kyc_approved boolean, readiness_ok boolean, eligible boolean)
language sql stable security definer set search_path = public as $$
  with e as (select coalesce((select fee_fully_paid from enrollments where user_id = uid), false) as paid),
       k as (select exists (select 1 from kyc_submissions where user_id = uid and status = 'approved') as ok),
       r as (
         select coalesce((select rd.score >= c.readiness_threshold
                          from readiness rd join profiles p on p.id = rd.user_id
                          join categories c on c.id = p.category_id
                          where rd.user_id = uid), false) as ok)
  select e.paid, k.ok, r.ok, (e.paid and k.ok and r.ok) from e, k, r;
$$;

-- ---------------------------------------------------------------------------
-- RLS
-- ---------------------------------------------------------------------------
alter table app_config enable row level security;
alter table categories enable row level security;
alter table profiles enable row level security;
alter table kyc_submissions enable row level security;
alter table enrollments enable row level security;
alter table payments enable row level security;
alter table stripe_events enable row level security;
alter table refund_requests enable row level security;
alter table media enable row level security;
alter table chapters enable row level security;
alter table chapter_categories enable row level security;
alter table lesson_blocks enable row level security;
alter table questions enable row level security;
alter table question_categories enable row level security;
alter table answer_options enable row level security;
alter table chapter_progress enable row level security;
alter table attempts enable row level security;
alter table attempt_answers enable row level security;
alter table mastery enable row level security;
alter table readiness enable row level security;
alter table exam_sessions enable row level security;
alter table exam_answers enable row level security;
alter table security_events enable row level security;
alter table certificates enable row level security;
alter table audit_log enable row level security;

-- Public catalogue: categories (fees are read by signup flow), media, chapter list
create policy "categories public read" on categories for select using (active);
create policy "categories admin write" on categories for all using (is_admin(auth.uid())) with check (is_admin(auth.uid()));
create policy "config public read" on app_config for select using (key in ('certificate_label', 'accredited', 'eur_ron_display_rate'));
create policy "config admin" on app_config for all using (is_admin(auth.uid())) with check (is_admin(auth.uid()));
create policy "media public read" on media for select using (not flagged or is_staff(auth.uid()));
create policy "media admin" on media for all using (is_admin(auth.uid())) with check (is_admin(auth.uid()));
create policy "chapters public outline" on chapters for select using (published or is_staff(auth.uid()));
create policy "chapters admin" on chapters for all using (is_admin(auth.uid())) with check (is_admin(auth.uid()));
create policy "chapter_categories read" on chapter_categories for select using (true);
create policy "chapter_categories admin" on chapter_categories for all using (is_admin(auth.uid())) with check (is_admin(auth.uid()));

-- Course body: only after the first payment (verified by webhook)
create policy "lessons paid read" on lesson_blocks for select using (courses_unlocked(auth.uid()) or is_staff(auth.uid()));
create policy "lessons admin" on lesson_blocks for all using (is_admin(auth.uid())) with check (is_admin(auth.uid()));

-- Questions and answers are NEVER readable directly by candidates: practice and
-- exam endpoints serve them through the service role, stripping is_correct.
create policy "questions staff" on questions for all using (is_staff(auth.uid())) with check (is_admin(auth.uid()));
create policy "question_categories staff" on question_categories for all using (is_staff(auth.uid())) with check (is_admin(auth.uid()));
create policy "answers staff" on answer_options for all using (is_staff(auth.uid())) with check (is_admin(auth.uid()));

-- Profile: own row; role and category changes only by admin (enforced by trigger below)
create policy "profile own read" on profiles for select using (id = auth.uid() or is_staff(auth.uid()));
create policy "profile own insert" on profiles for insert with check (id = auth.uid() and role = 'candidate');
create policy "profile own update" on profiles for update using (id = auth.uid() or is_admin(auth.uid()));

create or replace function protect_profile_fields() returns trigger language plpgsql security definer set search_path = public as $$
begin
  if not is_admin(auth.uid()) and auth.role() <> 'service_role' then
    if new.role is distinct from old.role then raise exception 'role is admin-managed'; end if;
    if old.category_id is not null and new.category_id is distinct from old.category_id
       and exists (select 1 from enrollments where user_id = old.id) then
      raise exception 'category is locked after payment';
    end if;
  end if;
  return new;
end; $$;
create trigger profiles_protect before update on profiles for each row execute function protect_profile_fields();

create policy "kyc own read" on kyc_submissions for select using (user_id = auth.uid() or is_staff(auth.uid()));
create policy "kyc own insert" on kyc_submissions for insert with check (user_id = auth.uid() and status = 'pending');
create policy "kyc staff update" on kyc_submissions for update using (is_staff(auth.uid()));

create policy "enrollment own read" on enrollments for select using (user_id = auth.uid() or is_staff(auth.uid()));
create policy "payments own read" on payments for select using (user_id = auth.uid() or is_staff(auth.uid()));
create policy "refund own" on refund_requests for select using (user_id = auth.uid() or is_staff(auth.uid()));
create policy "refund own insert" on refund_requests for insert with check (user_id = auth.uid());
create policy "refund admin" on refund_requests for update using (is_admin(auth.uid()));
-- stripe_events: no policies = service role only

create policy "progress own" on chapter_progress for all using (user_id = auth.uid()) with check (user_id = auth.uid() and courses_unlocked(auth.uid()));
create policy "attempts own read" on attempts for select using (user_id = auth.uid() or is_staff(auth.uid()));
create policy "attempt_answers own read" on attempt_answers for select using (exists (select 1 from attempts a where a.id = attempt_id and (a.user_id = auth.uid() or is_staff(auth.uid()))));
create policy "mastery own read" on mastery for select using (user_id = auth.uid() or is_staff(auth.uid()));
create policy "readiness own read" on readiness for select using (user_id = auth.uid() or is_staff(auth.uid()));
create policy "exam own read" on exam_sessions for select using (user_id = auth.uid() or is_staff(auth.uid()));
create policy "exam answers own read" on exam_answers for select using (exists (select 1 from exam_sessions s where s.id = session_id and s.status = 'finished' and (s.user_id = auth.uid() or is_staff(auth.uid()))));
create policy "security own read" on security_events for select using (exists (select 1 from exam_sessions s where s.id = session_id and (s.user_id = auth.uid() or is_staff(auth.uid()))));
create policy "certificates own read" on certificates for select using (user_id = auth.uid() or is_staff(auth.uid()));
create policy "certificates admin" on certificates for update using (is_admin(auth.uid()));
create policy "audit staff read" on audit_log for select using (is_admin(auth.uid()));

-- Public verification without exposing the table: minimal projection by code
create or replace function verify_certificate(code text)
returns table (public_code text, holder_name text, category_code text, score int, total int, issued_at timestamptz, label text, valid boolean)
language sql stable security definer set search_path = public as $$
  select c.public_code,
         -- privacy: "Andrei P." rather than full name
         split_part(c.holder_name, ' ', 1) || ' ' || left(split_part(c.holder_name, ' ', 2), 1) || '.',
         c.category_code, c.score, c.total, c.issued_at, c.label_snapshot,
         c.status in ('queued', 'held', 'sent')
  from certificates c where c.public_code = upper(code);
$$;
grant execute on function verify_certificate(text) to anon, authenticated;

-- ---------------------------------------------------------------------------
-- Storage: private, per-user folders
-- ---------------------------------------------------------------------------
insert into storage.buckets (id, name, public) values ('kyc', 'kyc', false) on conflict do nothing;
insert into storage.buckets (id, name, public) values ('certificates', 'certificates', false) on conflict do nothing;
insert into storage.buckets (id, name, public) values ('audio', 'audio', false) on conflict do nothing;

create policy "kyc upload own folder" on storage.objects for insert
  with check (bucket_id = 'kyc' and (storage.foldername(name))[1] = auth.uid()::text);
create policy "kyc staff read" on storage.objects for select
  using (bucket_id = 'kyc' and is_staff(auth.uid()));
create policy "certificates own read" on storage.objects for select
  using (bucket_id = 'certificates' and ((storage.foldername(name))[1] = auth.uid()::text or is_staff(auth.uid())));
create policy "audio paid read" on storage.objects for select
  using (bucket_id = 'audio' and (courses_unlocked(auth.uid()) or is_staff(auth.uid())));
