-- PermiStart seed data for Supabase Postgres (all 15 European harmonized categories, Directive 2006/126/EC)
insert into categories (
  code, slug, name_ro, short_ro, description_ro, min_age,
  fee_ron, fee_eur, min_first_installment_ron, min_first_installment_eur,
  max_installments, exam_question_count, exam_pass_mark, seconds_per_question, readiness_threshold, sort_order
) values
  ('AM',  'am',  'Categoria AM — Mopede', 'Mopede cu două sau trei roți și cvadricicluri ușoare.', 'Vehicule ușoare 25-45 km/h, max. 50 cm³ sau 4 kW.', 16, 175000, 35000, 75000, 15000, 2, 20, 17, 60, 80, 1),
  ('A1',  'a1',  'Categoria A1 — Motociclete ușoare', 'Motociclete de până la 125 cm³ și 11 kW.', 'Motociclete ≤ 125 cm³ și tricicluri ≤ 15 kW.', 16, 325000, 65000, 125000, 25000, 2, 20, 17, 60, 80, 2),
  ('A2',  'a2',  'Categoria A2 — Motociclete medii', 'Motociclete cu putere de cel mult 35 kW.', 'Motociclete ≤ 35 kW și raport putere/masă ≤ 0,2 kW/kg.', 18, 425000, 85000, 150000, 30000, 3, 20, 17, 60, 80, 3),
  ('A',   'a',   'Categoria A — Motociclete', 'Motociclete fără limită de putere și tricicluri peste 15 kW.', 'Toate motocicletele cu sau fără ataș.', 24, 490000, 98000, 175000, 35000, 3, 20, 17, 60, 80, 4),
  ('B1',  'b1',  'Categoria B1 — Cvadricicluri', 'Cvadricicluri cu masă proprie de până la 450 kg.', 'Cvadricicluri grele cu motor.', 16, 295000, 59000, 125000, 25000, 2, 26, 22, 60, 80, 5),
  ('B',   'b',   'Categoria B — Autoturisme', 'Autovehicule cu masă totală maximă autorizată de până la 3.500 kg.', 'Autoturisme ≤ 3.500 kg și ≤ 8+1 locuri.', 18, 575000, 115000, 200000, 40000, 3, 26, 22, 60, 80, 6),
  ('BE',  'be',  'Categoria BE — Autoturism cu remorcă', 'Ansamblu vehicul cat. B + remorcă 750-3.500 kg.', 'Cuplare, repartizare sarcină și frânare.', 18, 340000, 68000, 140000, 28000, 2, 26, 22, 60, 80, 7),
  ('C1',  'c1',  'Categoria C1 — Camioane medii', 'Autovehicule între 3.500 kg și 7.500 kg, fără transport persoane.', 'Transport marfă mediu (≤ 7,5 t), limite de viteză și mase.', 18, 675000, 135000, 240000, 48000, 3, 26, 22, 60, 80, 8),
  ('C1E', 'c1e', 'Categoria C1E — Camion mediu cu remorcă', 'Ansamblu format din vehicul cat. C1 + remorcă > 750 kg (≤ 12.000 kg).', 'Ansambluri medii cu remorcă până la 12 tone.', 18, 525000, 105000, 200000, 40000, 3, 26, 22, 60, 80, 9),
  ('C',   'c',   'Categoria C — Camioane grele', 'Autovehicule de marfă peste 3.500 kg.', 'Vehicule grele și reglementări specifice.', 21, 825000, 165000, 300000, 60000, 3, 26, 22, 60, 80, 10),
  ('CE',  'ce',  'Categoria CE — Ansambluri grele', 'Vehicul cat. C cu remorcă/semiremorcă > 750 kg.', 'Ansambluri articulate și stabilitate.', 21, 725000, 145000, 260000, 52000, 3, 26, 22, 60, 80, 11),
  ('D1',  'd1',  'Categoria D1 — Microbuze', 'Autovehicule pentru 9–16 pasageri (lungime max. 8 m).', 'Microbuze de transport persoane până la 16+1 locuri.', 21, 775000, 155000, 275000, 55000, 3, 26, 22, 60, 80, 12),
  ('D1E', 'd1e', 'Categoria D1E — Microbuz cu remorcă', 'Ansamblu format din microbuz cat. D1 + remorcă > 750 kg.', 'Transport persoane cu remorcă de bagaje peste 750 kg.', 21, 590000, 118000, 225000, 45000, 3, 26, 22, 60, 80, 13),
  ('D',   'd',   'Categoria D — Autobuze', 'Autovehicule de transport persoane peste 8+1 locuri.', 'Siguranța pasagerilor și circulația urbană.', 24, 975000, 195000, 350000, 70000, 3, 26, 22, 60, 80, 14),
  ('DE',  'de',  'Categoria DE — Autobuz cu remorcă', 'Ansamblu format din autobuz cat. D + remorcă > 750 kg.', 'Autocare și autobuze cu remorcă grea (> 750 kg).', 24, 745000, 149000, 270000, 54000, 3, 26, 22, 60, 80, 15)
on conflict (code) do update set
  name_ro = excluded.name_ro,
  short_ro = excluded.short_ro,
  description_ro = excluded.description_ro,
  min_age = excluded.min_age,
  fee_ron = excluded.fee_ron,
  fee_eur = excluded.fee_eur,
  min_first_installment_ron = excluded.min_first_installment_ron,
  min_first_installment_eur = excluded.min_first_installment_eur,
  max_installments = excluded.max_installments,
  sort_order = excluded.sort_order;
