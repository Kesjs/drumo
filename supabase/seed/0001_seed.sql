-- Drumo seed data for Supabase Postgres (categories calibrated to European market)
insert into categories (
  code, slug, name_ro, short_ro, description_ro, min_age,
  fee_ron, fee_eur, min_first_installment_ron, min_first_installment_eur,
  max_installments, exam_question_count, exam_pass_mark, seconds_per_question, readiness_threshold, sort_order
) values
  ('AM', 'am', 'Categoria AM — Mopede', 'Mopede cu două sau trei roți și cvadricicluri ușoare.', 'Vehicule ușoare 25-45 km/h, max. 50 cm³ sau 4 kW.', 16, 75000, 15000, 30000, 6000, 2, 20, 17, 60, 80, 1),
  ('A1', 'a1', 'Categoria A1 — Motociclete ușoare', 'Motociclete de până la 125 cm³ și 11 kW.', 'Motociclete ≤ 125 cm³ și tricicluri ≤ 15 kW.', 16, 95000, 19000, 38000, 7500, 2, 20, 17, 60, 80, 2),
  ('A2', 'a2', 'Categoria A2 — Motociclete medii', 'Motociclete cu putere de cel mult 35 kW.', 'Motociclete ≤ 35 kW și raport putere/masă ≤ 0,2 kW/kg.', 18, 105000, 21000, 42000, 8500, 3, 20, 17, 60, 80, 3),
  ('A',  'a',  'Categoria A — Motociclete', 'Motociclete fără limită de putere și tricicluri peste 15 kW.', 'Toate motocicletele cu sau fără ataș.', 24, 120000, 24000, 48000, 9500, 3, 20, 17, 60, 80, 4),
  ('B1', 'b1', 'Categoria B1 — Cvadricicluri', 'Cvadricicluri cu masă proprie de până la 450 kg.', 'Cvadricicluri grele cu motor.', 16, 99000, 20000, 40000, 8000, 2, 26, 22, 60, 80, 5),
  ('B',  'b',  'Categoria B — Autoturisme', 'Autovehicule cu masă totală maximă autorizată de până la 3.500 kg.', 'Autoturisme ≤ 3.500 kg și ≤ 8+1 locuri.', 18, 145000, 29000, 55000, 11000, 3, 26, 22, 60, 80, 6),
  ('BE', 'be', 'Categoria BE — Autoturism cu remorcă', 'Ansamblu vehicul cat. B + remorcă 750-3.500 kg.', 'Cuplare, repartizare sarcină și frânare.', 18, 90000, 18000, 38000, 7500, 2, 26, 22, 60, 80, 7),
  ('C',  'c',  'Categoria C — Camioane', 'Autovehicule de marfă peste 3.500 kg.', 'Vehicule grele și reglementări specifice.', 21, 195000, 39000, 75000, 15000, 3, 26, 22, 60, 80, 8),
  ('CE', 'ce', 'Categoria CE — Ansambluri grele', 'Vehicul cat. C cu remorcă/semiremorcă > 750 kg.', 'Ansambluri articulate și stabilitate.', 21, 135000, 27000, 55000, 11000, 2, 26, 22, 60, 80, 9),
  ('D',  'd',  'Categoria D — Autobuze', 'Autovehicule de transport persoane peste 8+1 locuri.', 'Siguranța pasagerilor și circulația urbană.', 24, 210000, 42000, 80000, 16000, 3, 26, 22, 60, 80, 10)
on conflict (code) do update set
  fee_ron = excluded.fee_ron,
  fee_eur = excluded.fee_eur,
  min_first_installment_ron = excluded.min_first_installment_ron,
  min_first_installment_eur = excluded.min_first_installment_eur,
  max_installments = excluded.max_installments;
