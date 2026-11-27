export interface SeedCategory {
  id: string;
  code: string;
  slug: string;
  name_ro: string;
  short_ro: string;
  description_ro: string;
  min_age: number;
  fee_ron: number;
  fee_eur: number;
  min_first_installment_ron: number;
  min_first_installment_eur: number;
  max_installments: number;
  exam_question_count: number;
  exam_pass_mark: number;
  seconds_per_question: number;
  readiness_threshold: number;
  sort_order: number;
  active: boolean;
  vehicles_ro: string[];
}

export interface SeedLessonBlock {
  id: string;
  sort_order: number;
  kind: "heading" | "text" | "image" | "rule" | "example" | "warning";
  body_ro: string;
  media_slug?: string;
  legal_ref?: string;
}

export interface SeedChapter {
  id: string;
  slug: string;
  title_ro: string;
  summary_ro: string;
  key_points_ro: string[];
  cover_media_slug: string;
  audio_path: string | null; // human recording path when uploaded, e.g. /audio/semne.mp3
  audio_kind: "human" | "tts";
  audio_script_ro: string;
  minutes: number;
  sort_order: number;
  category_codes: string[];
  blocks: SeedLessonBlock[];
}

export interface SeedQuestionOption {
  label: "A" | "B" | "C" | "D";
  body_ro: string;
  is_correct: boolean;
}

export interface SeedQuestion {
  id: string;
  chapter_id: string;
  chapter_slug: string;
  difficulty: 1 | 2 | 3 | 4 | 5;
  stem_ro: string;
  media_slug?: string;
  exam_pool: boolean;
  multi: boolean;
  explanation_ro: string;
  legal_ref: string;
  category_codes: string[];
  options: SeedQuestionOption[];
}

export const SEED_CATEGORIES: SeedCategory[] = [
  {
    id: "cat-am",
    code: "AM",
    slug: "am",
    name_ro: "Categoria AM — Mopede",
    short_ro: "Mopede cu două sau trei roți și cvadricicluri ușoare.",
    description_ro:
      "Acoperă vehiculele ușoare cu viteză maximă prin construcție între 25 și 45 km/h și capacitate cilindrică de cel mult 50 cm³ (sau putere electrică de până la 4 kW). Pregătirea pune accent pe indicatoare, vizibilitate și poziționarea corectă pe carosabil.",
    min_age: 16,
    fee_ron: 175000,
    fee_eur: 35000,
    min_first_installment_ron: 75000,
    min_first_installment_eur: 15000,
    max_installments: 2,
    exam_question_count: 20,
    exam_pass_mark: 17,
    seconds_per_question: 60,
    readiness_threshold: 80,
    sort_order: 1,
    active: true,
    vehicles_ro: ["Mopede cu 2 sau 3 roți (max. 45 km/h)", "Cvadricicluri ușoare (max. 425 kg masă proprie)"],
  },
  {
    id: "cat-a1",
    code: "A1",
    slug: "a1",
    name_ro: "Categoria A1 — Motociclete ușoare",
    short_ro: "Motociclete de până la 125 cm³ și 11 kW.",
    description_ro:
      "Destinată motocicletelor ușoare cu cilindree maximă de 125 cm³, putere de cel mult 11 kW și raport putere/masă de până la 0,1 kW/kg, precum și triciclurilor cu motor de până la 15 kW.",
    min_age: 16,
    fee_ron: 325000,
    fee_eur: 65000,
    min_first_installment_ron: 125000,
    min_first_installment_eur: 25000,
    max_installments: 2,
    exam_question_count: 20,
    exam_pass_mark: 17,
    seconds_per_question: 60,
    readiness_threshold: 80,
    sort_order: 2,
    active: true,
    vehicles_ro: ["Motociclete ≤ 125 cm³, ≤ 11 kW", "Tricicluri cu motor ≤ 15 kW"],
  },
  {
    id: "cat-a2",
    code: "A2",
    slug: "a2",
    name_ro: "Categoria A2 — Motociclete medii",
    short_ro: "Motociclete cu putere de cel mult 35 kW.",
    description_ro:
      "Include motocicletele cu putere maximă de 35 kW și raport putere/masă de până la 0,2 kW/kg, care nu derivă dintr-un vehicul având mai mult de dublul puterii sale.",
    min_age: 18,
    fee_ron: 425000,
    fee_eur: 85000,
    min_first_installment_ron: 150000,
    min_first_installment_eur: 30000,
    max_installments: 3,
    exam_question_count: 20,
    exam_pass_mark: 17,
    seconds_per_question: 60,
    readiness_threshold: 80,
    sort_order: 3,
    active: true,
    vehicles_ro: ["Motociclete ≤ 35 kW (raport ≤ 0,2 kW/kg)"],
  },
  {
    id: "cat-a",
    code: "A",
    slug: "a",
    name_ro: "Categoria A — Motociclete",
    short_ro: "Motociclete fără limită de putere și tricicluri peste 15 kW.",
    description_ro:
      "Acoperă toate motocicletele cu sau fără ataș și triciclurile cu putere de peste 15 kW. Include reguli specifice de frânare, abordare a curbelor și conduită preventivă pe două roți.",
    min_age: 24,
    fee_ron: 490000,
    fee_eur: 98000,
    min_first_installment_ron: 175000,
    min_first_installment_eur: 35000,
    max_installments: 3,
    exam_question_count: 20,
    exam_pass_mark: 17,
    seconds_per_question: 60,
    readiness_threshold: 80,
    sort_order: 4,
    active: true,
    vehicles_ro: ["Motociclete de orice putere", "Tricicluri cu motor > 15 kW"],
  },
  {
    id: "cat-b1",
    code: "B1",
    slug: "b1",
    name_ro: "Categoria B1 — Cvadricicluri",
    short_ro: "Cvadricicluri cu masă proprie de până la 450 kg (600 kg marfă).",
    description_ro:
      "Permite pregătirea pentru cvadricicluri grele cu motor, cu accent pe legislația urbană, prioritate în intersecții și semnalizare.",
    min_age: 16,
    fee_ron: 295000,
    fee_eur: 59000,
    min_first_installment_ron: 125000,
    min_first_installment_eur: 25000,
    max_installments: 2,
    exam_question_count: 26,
    exam_pass_mark: 22,
    seconds_per_question: 60,
    readiness_threshold: 80,
    sort_order: 5,
    active: true,
    vehicles_ro: ["Cvadricicluri grele ≤ 450 kg (transport persoane)", "Cvadricicluri ≤ 600 kg (transport marfă)"],
  },
  {
    id: "cat-b",
    code: "B",
    slug: "b",
    name_ro: "Categoria B — Autoturisme",
    short_ro: "Autovehicule cu masă totală maximă autorizată de până la 3.500 kg.",
    description_ro:
      "Cea mai frecventă categorie: autoturisme și autoutilitare ușoare cu cel mult 8 locuri pe scaune în afara conducătorului, inclusiv cu remorcă ușoară de până la 750 kg.",
    min_age: 18,
    fee_ron: 575000,
    fee_eur: 115000,
    min_first_installment_ron: 200000,
    min_first_installment_eur: 40000,
    max_installments: 3,
    exam_question_count: 26,
    exam_pass_mark: 22,
    seconds_per_question: 60,
    readiness_threshold: 80,
    sort_order: 6,
    active: true,
    vehicles_ro: [
      "Autovehicule ≤ 3.500 kg și ≤ 8+1 locuri",
      "Ansamblu cu remorcă ≤ 750 kg (sau > 750 kg dacă ansamblul ≤ 3.500 kg)",
    ],
  },
  {
    id: "cat-be",
    code: "BE",
    slug: "be",
    name_ro: "Categoria BE — Autoturism cu remorcă",
    short_ro: "Ansamblu format din vehicul categoria B și remorcă între 750 și 3.500 kg.",
    description_ro:
      "Adaugă regulile de cuplare, repartizare a încărcăturii, distanțe de frânare și limite de viteză specifice ansamblurilor cu remorcă grea.",
    min_age: 18,
    fee_ron: 340000,
    fee_eur: 68000,
    min_first_installment_ron: 140000,
    min_first_installment_eur: 28000,
    max_installments: 2,
    exam_question_count: 26,
    exam_pass_mark: 22,
    seconds_per_question: 60,
    readiness_threshold: 80,
    sort_order: 7,
    active: true,
    vehicles_ro: ["Vehicul tractor cat. B + remorcă ≤ 3.500 kg"],
  },
  {
    id: "cat-c1",
    code: "C1",
    slug: "c1",
    name_ro: "Categoria C1 — Camioane medii",
    short_ro: "Autovehicule între 3.500 kg și 7.500 kg, cu cel mult 8+1 locuri.",
    description_ro:
      "Categoria intermediară pentru transport de marfă și distribuție cu vehicule între 3,5 și 7,5 tone, inclusiv o remorcă ușoară de până la 750 kg.",
    min_age: 18,
    fee_ron: 675000,
    fee_eur: 135000,
    min_first_installment_ron: 240000,
    min_first_installment_eur: 48000,
    max_installments: 3,
    exam_question_count: 26,
    exam_pass_mark: 22,
    seconds_per_question: 60,
    readiness_threshold: 80,
    sort_order: 8,
    active: true,
    vehicles_ro: ["Autovehicule 3.500–7.500 kg", "Remorcă ușoară ≤ 750 kg"],
  },
  {
    id: "cat-c1e",
    code: "C1E",
    slug: "c1e",
    name_ro: "Categoria C1E — Camion mediu cu remorcă",
    short_ro: "Ansamblu format din vehicul C1 și remorcă > 750 kg (total ≤ 12.000 kg).",
    description_ro:
      "Include conducerea ansamblurilor medii de până la 12 tone masă totală maximă autorizată, manevrele cu remorcă cu proțap și siguranța încărcăturii.",
    min_age: 18,
    fee_ron: 525000,
    fee_eur: 105000,
    min_first_installment_ron: 200000,
    min_first_installment_eur: 40000,
    max_installments: 3,
    exam_question_count: 26,
    exam_pass_mark: 22,
    seconds_per_question: 60,
    readiness_threshold: 80,
    sort_order: 9,
    active: true,
    vehicles_ro: ["Vehicul cat. C1 + remorcă > 750 kg (ansamblu ≤ 12.000 kg)"],
  },
  {
    id: "cat-c",
    code: "C",
    slug: "c",
    name_ro: "Categoria C — Camioane grele",
    short_ro: "Autovehicule de marfă peste 3.500 kg, fără remorcă grea.",
    description_ro:
      "Legislație rutieră, limite de viteză diferențiate, mase și dimensiuni maxime admise, timp de conducere și odihnă, precum și semnalizarea vehiculelor grele.",
    min_age: 21,
    fee_ron: 825000,
    fee_eur: 165000,
    min_first_installment_ron: 300000,
    min_first_installment_eur: 60000,
    max_installments: 3,
    exam_question_count: 26,
    exam_pass_mark: 22,
    seconds_per_question: 60,
    readiness_threshold: 80,
    sort_order: 10,
    active: true,
    vehicles_ro: ["Autovehicule > 3.500 kg, ≤ 8+1 locuri", "Remorcă ușoară ≤ 750 kg"],
  },
  {
    id: "cat-ce",
    code: "CE",
    slug: "ce",
    name_ro: "Categoria CE — Ansambluri grele",
    short_ro: "Vehicul categoria C cu remorcă sau semiremorcă peste 750 kg.",
    description_ro:
      "Conducerea ansamblurilor de vehicule grele: traiectorie în viraje și sensuri giratorii, distanțe de oprire, stabilitate la vânt lateral și reguli pe autostradă.",
    min_age: 21,
    fee_ron: 725000,
    fee_eur: 145000,
    min_first_installment_ron: 260000,
    min_first_installment_eur: 52000,
    max_installments: 3,
    exam_question_count: 26,
    exam_pass_mark: 22,
    seconds_per_question: 60,
    readiness_threshold: 80,
    sort_order: 11,
    active: true,
    vehicles_ro: ["Camion cat. C + remorcă/semiremorcă > 750 kg"],
  },
  {
    id: "cat-d1",
    code: "D1",
    slug: "d1",
    name_ro: "Categoria D1 — Microbuze",
    short_ro: "Microbuze pentru 9–16 pasageri și lungime maximă de 8 metri.",
    description_ro:
      "Transport comercial sau privat de persoane cu microbuze de până la 16+1 locuri și lungime de cel mult 8 metri, cu reguli specifice stațiilor și îmbarcării.",
    min_age: 21,
    fee_ron: 775000,
    fee_eur: 155000,
    min_first_installment_ron: 275000,
    min_first_installment_eur: 55000,
    max_installments: 3,
    exam_question_count: 26,
    exam_pass_mark: 22,
    seconds_per_question: 60,
    readiness_threshold: 80,
    sort_order: 12,
    active: true,
    vehicles_ro: ["Microbuze cu 9–16 locuri pe scaune (lungime ≤ 8 m)", "Remorcă ușoară ≤ 750 kg"],
  },
  {
    id: "cat-d1e",
    code: "D1E",
    slug: "d1e",
    name_ro: "Categoria D1E — Microbuz cu remorcă",
    short_ro: "Ansamblu format din microbuz D1 și remorcă de bagaje peste 750 kg.",
    description_ro:
      "Destinată transportului de pasageri cu remorcă pentru echipamente sau bagaje de peste 750 kg, cu accent pe frânare, timpi de condus și gabarit.",
    min_age: 21,
    fee_ron: 590000,
    fee_eur: 118000,
    min_first_installment_ron: 225000,
    min_first_installment_eur: 45000,
    max_installments: 3,
    exam_question_count: 26,
    exam_pass_mark: 22,
    seconds_per_question: 60,
    readiness_threshold: 80,
    sort_order: 13,
    active: true,
    vehicles_ro: ["Microbuz cat. D1 + remorcă > 750 kg"],
  },
  {
    id: "cat-d",
    code: "D",
    slug: "d",
    name_ro: "Categoria D — Autobuze",
    short_ro: "Autovehicule pentru transportul persoanelor cu peste 8 locuri pe scaune.",
    description_ro:
      "Siguranța pasagerilor, staționarea în stații, prioritatea la ieșirea autobuzelor din alveole în localități și reguli stricte privind alcoolul și oboseala.",
    min_age: 24,
    fee_ron: 975000,
    fee_eur: 195000,
    min_first_installment_ron: 350000,
    min_first_installment_eur: 70000,
    max_installments: 3,
    exam_question_count: 26,
    exam_pass_mark: 22,
    seconds_per_question: 60,
    readiness_threshold: 80,
    sort_order: 14,
    active: true,
    vehicles_ro: ["Autobuze și autocare > 8+1 locuri", "Remorcă ușoară ≤ 750 kg"],
  },
  {
    id: "cat-de",
    code: "DE",
    slug: "de",
    name_ro: "Categoria DE — Autobuz cu remorcă",
    short_ro: "Ansamblu format din autobuz sau autocar categoria D și remorcă > 750 kg.",
    description_ro:
      "Operarea autocarelor și autobuzelor cu remorcă de bagaje peste 750 kg: manevre la intrarea în terminale, distanțe de oprire și legislație europeană de transport.",
    min_age: 24,
    fee_ron: 745000,
    fee_eur: 149000,
    min_first_installment_ron: 270000,
    min_first_installment_eur: 54000,
    max_installments: 3,
    exam_question_count: 26,
    exam_pass_mark: 22,
    seconds_per_question: 60,
    readiness_threshold: 80,
    sort_order: 15,
    active: true,
    vehicles_ro: ["Autobuz / autocar cat. D + remorcă > 750 kg"],
  },
];

export const SEED_CHAPTERS: SeedChapter[] = [
  {
    id: "ch-semne",
    slug: "semne-de-circulatie",
    title_ro: "Semne de circulație și marcaje rutiere",
    summary_ro:
      "Ierarhia semnalizării rutiere, categoriile de indicatoare din România și semnificația marcajelor longitudinale și transversale.",
    key_points_ro: [
      "Ordinea de prioritate: semnalele polițistului > semnale luminoase/temporare > indicatoare > marcaje > reguli generale.",
      "Forma și culoarea indicatoarelor: triunghi cu chenar roșu (avertizare), cerc roșu (interzicere/restricție), cerc albastru (obligare).",
      "Linia continuă simplă sau dublă nu poate fi încălcată sau depășită de niciun vehicul.",
    ],
    cover_media_slug: "cedeaza-popa-tatu",
    audio_path: null,
    audio_kind: "tts",
    audio_script_ro:
      "Capitolul 1: Semne de circulație și marcaje rutiere. În România, semnalizarea rutieră respectă o ierarhie strictă. Pe primul loc se află semnalele și indicațiile polițistului rutier, urmate de semnalele speciale de avertizare ale vehiculelor prioritare, semnalizarea temporară de lucrări, semafoarele, indicatoarele rutiere și, în final, marcajele de pe carosabil. Indicatoarele de avertizare au formă triunghiulară cu chenar roșu; cele de interzicere sunt rotunde cu chenar roșu; cele de obligare sunt rotunde cu fond albastru.",
    minutes: 18,
    sort_order: 1,
    category_codes: ["AM", "A1", "A2", "A", "B1", "B", "BE", "C1", "C1E", "C", "CE", "D1", "D1E", "D", "DE"],
    blocks: [
      {
        id: "b-1-1",
        sort_order: 1,
        kind: "heading",
        body_ro: "1. Ordinea de prioritate a mijloacelor de semnalizare",
      },
      {
        id: "b-1-2",
        sort_order: 2,
        kind: "rule",
        body_ro:
          "Participanții la trafic trebuie să respecte regulile de circulație în următoarea ordine de prioritate: 1) semnalele polițistului rutier; 2) semnalele luminoase și sonore ale autovehiculelor cu regim prioritar; 3) semnalizarea temporară care modifică regimul normal; 4) semnalele luminoase (semafoarele); 5) indicatoarele; 6) marcajele; 7) regulile generale de circulație.",
        legal_ref: "OUG 195/2002, art. 31",
      },
      {
        id: "b-1-3",
        sort_order: 3,
        kind: "image",
        body_ro:
          "În situația din imagine, pe același stâlp sunt montate indicatorul „Cedează trecerea” (triunghi cu vârful în jos) și „Interzis virajul la stânga”. În spate se observă semaforul și marcajul trecerii pentru pietoni.",
        media_slug: "cedeaza-popa-tatu",
      },
      {
        id: "b-1-4",
        sort_order: 4,
        kind: "text",
        body_ro:
          "Semnalizarea temporară amplasată pe fond galben (lucrări pe carosabil, restricții provizorii) are prioritate față de indicatoarele permanente montate în aceeași zonă. La întâlnirea panourilor galbene de șantier, reducerea vitezei și respectarea benzilor delimitate temporar sunt obligatorii.",
      },
      {
        id: "b-1-5",
        sort_order: 5,
        kind: "image",
        body_ro:
          "Exemplu real de semnalizare multiplă în mediul urban: acces interzis vehiculelor cu tracțiune animală (sus) și „Oprirea interzisă” (jos, cerc albastru cu chenar roșu și două diagonale roșii), însoțit de panou adițional.",
        media_slug: "oprire-interzisa-bistrita",
      },
      {
        id: "b-1-6",
        sort_order: 6,
        kind: "image",
        body_ro:
          "Marcajele rutiere din imagine arată trecerea pentru pietoni, delimitarea benzii rezervate transportului public (BUS) și linia continuă care interzice încălcarea ei la schimbarea benzii.",
        media_slug: "marcaje-apold",
      },
      {
        id: "b-1-7",
        sort_order: 7,
        kind: "warning",
        body_ro:
          "Atenție la diferența dintre „Oprirea interzisă” (X roșu pe fond albastru — interzice atât oprirea, cât și staționarea) și „Staționarea interzisă” (o singură bară diagonală roșie — permite oprirea de cel mult 5 minute).",
        legal_ref: "HG 1391/2006, art. 141–143",
      },
    ],
  },
  {
    id: "ch-prioritati",
    slug: "prioritati",
    title_ro: "Reguli de prioritate și intersecții",
    summary_ro:
      "Cum se acordă prioritatea în intersecțiile dirijate, nedirijate, în sensul giratoriu și la întâlnirea indicatorului „Oprire” sau „Cedează trecerea”.",
    key_points_ro: [
      "La indicatorul „Oprire” (STOP) oprirea este obligatorie în locul cu vizibilitate maximă, fără a depăși colțul intersecției.",
      "În intersecțiile cu sens giratoriu au prioritate vehiculele care circulă deja în interiorul sensului.",
      "În intersecțiile nedirijate se aplică prioritatea de dreapta; tramvaiul în mers are prioritate față de vehiculele care circulă pe același drum.",
    ],
    cover_media_slug: "stop-axente-sever",
    audio_path: null,
    audio_kind: "tts",
    audio_script_ro:
      "Capitolul 2: Reguli de prioritate și intersecții. La întâlnirea indicatorului Oprire, conducătorul auto trebuie să oprească complet roțile, chiar dacă drumul transversal pare liber, și să acorde prioritate vehiculelor de pe drumul prioritar. La Cedează trecerea, oprirea este necesară doar dacă circulă vehicule cărora trebuie să le acordați prioritate. În sensul giratoriu, vehiculele aflate deja în interiorul intersecției au prioritate față de cele care urmează să pătrundă.",
    minutes: 20,
    sort_order: 2,
    category_codes: ["AM", "A1", "A2", "A", "B1", "B", "BE", "C1", "C1E", "C", "CE", "D1", "D1E", "D", "DE"],
    blocks: [
      {
        id: "b-2-1",
        sort_order: 1,
        kind: "heading",
        body_ro: "1. Oprire (STOP) vs. Cedează trecerea",
      },
      {
        id: "b-2-2",
        sort_order: 2,
        kind: "image",
        body_ro:
          "Indicatorul octogonal „Oprire” (STOP) într-o intersecție reală din România. Observați marcajul transversal și linia de vizibilitate către drumul principal.",
        media_slug: "stop-axente-sever",
      },
      {
        id: "b-2-3",
        sort_order: 3,
        kind: "rule",
        body_ro:
          "La întâlnirea indicatorului „Oprire”, conducătorul de vehicul este obligat să oprească în locul cu vizibilitate maximă, fără a depăși colțul intersecției, și să acorde prioritate tuturor vehiculelor care circulă pe drumul prioritar. La „Cedează trecerea”, conducătorul reduce viteza și oprește doar dacă este necesar pentru a acorda prioritate.",
        legal_ref: "HG 1391/2006, art. 57–59",
      },
      {
        id: "b-2-4",
        sort_order: 4,
        kind: "image",
        body_ro:
          "Sens giratoriu cu mai multe benzi. Vehiculele care circulă în interiorul sensului au prioritate. La părăsirea sensului giratoriu de pe o bandă interioară, trebuie să acordați prioritate vehiculelor care circulă pe banda exterioară.",
        media_slug: "sens-giratoriu-timisoara",
      },
      {
        id: "b-2-5",
        sort_order: 5,
        kind: "example",
        body_ro:
          "La virajul la stânga într-o intersecție dirijată fără semafoare dedicate, acordați prioritate vehiculelor care vin din sens opus și continuă mersul înainte sau virează la dreapta.",
      },
    ],
  },
  {
    id: "ch-viteza",
    slug: "viteza-si-conditii-meteo",
    title_ro: "Viteză, vizibilitate și condiții meteo",
    summary_ro:
      "Limitele legale de viteză pe categorii de drumuri și vehicule, adaptarea vitezei la ploaie, polei sau ceață și obligațiile la trecerea pe lângă copii ori șantiere.",
    key_points_ro: [
      "Pentru categoria B: 50 km/h în localitate, 90 km/h pe drumuri naționale/județene, 100 km/h pe drumuri europene (E), 120 km/h pe drum expres, 130 km/h pe autostradă.",
      "Conducătorii cu vechime mai mică de 1 an au limita maximă cu 20 km/h mai mică în afara localităților.",
      "La semnalizarea „Copii” sau pe carosabil alunecos, reducerea vitezei este obligatorie preventiv.",
    ],
    cover_media_slug: "intrare-brasov-dn1",
    audio_path: null,
    audio_kind: "tts",
    audio_script_ro:
      "Capitolul 3: Viteză, vizibilitate și condiții meteo. Pentru autoturismele din categoria B, limita maximă legală în localitate este de 50 km/h, dacă un indicator nu stabilește altfel, de exemplu 80 km/h pe anumite tronsoane. În afara localităților, limita este de 90 km/h pe drumuri naționale, 100 km/h pe drumuri europene, 120 km/h pe drum expres și 130 km/h pe autostradă. Conducătorii cu mai puțin de un an experiență circulă în afara localităților cu 20 km/h sub limita maximă admisă.",
    minutes: 18,
    sort_order: 3,
    category_codes: ["AM", "A1", "A2", "A", "B1", "B", "BE", "C1", "C1E", "C", "CE", "D1", "D1E", "D", "DE"],
    blocks: [
      {
        id: "b-3-1",
        sort_order: 1,
        kind: "heading",
        body_ro: "1. Limite legale de viteză în România",
      },
      {
        id: "b-3-2",
        sort_order: 2,
        kind: "rule",
        body_ro:
          "În localități limita generală este 50 km/h (poate fi ridicată la max. 80 km/h pentru categoriile A și B prin indicator, sau coborâtă la 30 km/h în zone speciale). În afara localităților pentru categoria B: 130 km/h pe autostrăzi, 120 km/h pe drumuri expres, 100 km/h pe drumuri naționale europene (E), 90 km/h pe celelalte categorii de drumuri.",
        legal_ref: "OUG 195/2002, art. 49",
      },
      {
        id: "b-3-3",
        sort_order: 3,
        kind: "image",
        body_ro:
          "Panouri reale la intrarea în Brașov pe DN1: ieșirea din localitatea anterioară, sfârșitul restricțiilor de 50 km/h și depășire interzisă, urmată imediat de limitarea de 80 km/h în localitate și 60 km/h pentru lucrări.",
        media_slug: "intrare-brasov-dn1",
      },
      {
        id: "b-3-4",
        sort_order: 4,
        kind: "image",
        body_ro:
          "Carosabil umed după ploaie și restricții temporare: apa de pe asfalt crește riscul de acvaplanare și mărește considerabil distanța de frânare.",
        media_slug: "bucuresti-ploaie",
      },
      {
        id: "b-3-5",
        sort_order: 5,
        kind: "image",
        body_ro:
          "Indicatorul de avertizare „Copii” impune prudență sporită și reducerea vitezei până la limita evitării oricărui pericol, în special lângă școli și parcuri.",
        media_slug: "copii-fagaras",
      },
      {
        id: "b-3-6",
        sort_order: 6,
        kind: "warning",
        body_ro:
          "Conducătorii de autovehicule cu vechime mai mică de 1 an de la obținerea permisului au obligația să aplice semnul distinctiv (discul galben cu semnul exclamării) și să circule în afara localităților cu o viteză cu 20 km/h mai mică decât limita maximă admisă pentru categoria respectivă.",
        legal_ref: "OUG 195/2002, art. 50 alin. (4)",
      },
    ],
  },
  {
    id: "ch-distante",
    slug: "distante-de-siguranta",
    title_ro: "Distanțe de siguranță, depășirea și oprirea",
    summary_ro:
      "Păstrarea distanței față de vehiculul din față, condițiile de siguranță pentru depășire și locurile unde oprirea și staționarea sunt interzise.",
    key_points_ro: [
      "Regula celor 2 secunde pe asfalt uscat (minim 4 secunde pe ploaie sau polei).",
      "Depășirea este interzisă în intersecțiile nedirijate, pe trecerile de pietoni, în curbele cu vizibilitate redusă și pe poduri.",
      "Este interzisă oprirea la mai puțin de 25 m înainte și după trecerile de pietoni și colțurile intersecțiilor.",
    ],
    cover_media_slug: "lucrari-transfagarasan",
    audio_path: null,
    audio_kind: "tts",
    audio_script_ro:
      "Capitolul 4: Distanțe de siguranță, depășirea și oprirea. Distanța față de vehiculul care circulă în față trebuie să permită oprirea în siguranță în orice situație. O regulă practică este menținerea unui interval de cel puțin două secunde pe carosabil uscat și cel puțin patru secunde pe carosabil ud. Depășirea este permisă numai după asigurare temeinică și semnalizare, și este interzisă în intersecții nedirijate, în curbe fără vizibilitate, pe treceri pentru pietoni și la treceri la nivel cu calea ferată.",
    minutes: 16,
    sort_order: 4,
    category_codes: ["AM", "A1", "A2", "A", "B1", "B", "BE", "C1", "C1E", "C", "CE", "D1", "D1E", "D", "DE"],
    blocks: [
      {
        id: "b-4-1",
        sort_order: 1,
        kind: "heading",
        body_ro: "1. Distanța de reacție și distanța de frânare",
      },
      {
        id: "b-4-2",
        sort_order: 2,
        kind: "rule",
        body_ro:
          "Conducătorul unui vehicul care circulă în spatele altuia are obligația de a păstra o distanță suficientă față de acesta, pentru evitarea coliziunii în cazul reducerii bruște a vitezei sau a opririi neprevăzute.",
        legal_ref: "OUG 195/2002, art. 51",
      },
      {
        id: "b-4-3",
        sort_order: 3,
        kind: "image",
        body_ro:
          "În zonele montane sau cu drum alunecos și lucrări (ca în imagine), distanța de frânare se dublează. Mențineți o distanță mare și folosiți frâna de motor la coborâri.",
        media_slug: "cadere-pietre-dn10",
      },
      {
        id: "b-4-4",
        sort_order: 4,
        kind: "image",
        body_ro:
          "Panou „Pericol de accidente — lucrări și semafoare la 400 m”. La apropierea de șantier este interzisă depășirea coloanei oprite la semaforul temporar.",
        media_slug: "lucrari-transfagarasan",
      },
      {
        id: "b-4-5",
        sort_order: 5,
        kind: "warning",
        body_ro:
          "Se interzice oprirea voluntară pe trecerile pentru pietoni ori la mai puțin de 25 m înainte și după acestea, în intersecții și la mai puțin de 25 m de colțul intersecției, pe poduri, sub pasaje și în curbe cu vizibilitate sub 50 m.",
        legal_ref: "HG 1391/2006, art. 142",
      },
    ],
  },
  {
    id: "ch-autostrazi",
    slug: "autostrazi-si-drumuri-expres",
    title_ro: "Circulația pe autostrăzi și drumuri naționale",
    summary_ro:
      "Accesul, folosirea benzilor de accelerare și decelerare, interdicțiile pe autostradă și conduita pe drumurile montane sau naționale.",
    key_points_ro: [
      "Pe autostradă este interzisă întoarcerea, mersul înapoi, oprirea pe banda de urgență fără motiv întemeiat și accesul vehiculelor care nu pot depăși 50 km/h.",
      "Banda de accelerare se folosește pentru a atinge viteza fluxului și a ceda trecerea vehiculelor de pe banda 1.",
      "Lumini de întâlnire sau de zi (DRL) obligatorii permanent pe toate drumurile publice.",
    ],
    cover_media_slug: "autostrada-sibiu",
    audio_path: null,
    audio_kind: "tts",
    audio_script_ro:
      "Capitolul 5: Circulația pe autostrăzi și drumuri naționale. Pe autostrăzi nu au acces pietonii, bicicliștii, mopedele sau vehiculele care nu pot atinge prin construcție 50 km/h. La intrare, accelerați pe banda de accelerare și acordați prioritate vehiculelor aflate pe banda întâi. Întoarcerea, mersul înapoi și traversarea spațiului median sunt strict interzise.",
    minutes: 14,
    sort_order: 5,
    category_codes: ["A1", "A2", "A", "B1", "B", "BE", "C1", "C1E", "C", "CE", "D1", "D1E", "D", "DE"],
    blocks: [
      {
        id: "b-5-1",
        sort_order: 1,
        kind: "heading",
        body_ro: "1. Reguli specifice pe autostradă",
      },
      {
        id: "b-5-2",
        sort_order: 2,
        kind: "image",
        body_ro:
          "Autostradă în România: banda de urgență din dreapta (separată prin linie continuă), banda de accelerare/decelerare și panourile verzi de orientare.",
        media_slug: "autostrada-sibiu",
      },
      {
        id: "b-5-3",
        sort_order: 3,
        kind: "rule",
        body_ro:
          "Pe autostrăzi și drumuri expres sunt interzise: circulația vehiculelor cu tracțiune animală, a bicicletelor, mopedelor și a autovehiculelor care nu pot depăși 50 km/h; oprirea sau staționarea în alte locuri decât cele special amenajate; întoarcerea, mersul înapoi și pătrunderea pe zona mediană.",
        legal_ref: "OUG 195/2002, art. 74",
      },
      {
        id: "b-5-4",
        sort_order: 4,
        kind: "image",
        body_ro:
          "Pe drumurile montane cu serpentine (precum Transfăgărășan sau DN7A), coborârea se face într-o treaptă inferioară de viteză pentru a preveni supraîncălzirea frânelor.",
        media_slug: "transfagarasan",
      },
    ],
  },
  {
    id: "ch-prim-ajutor",
    slug: "prim-ajutor-si-conduita",
    title_ro: "Prim ajutor, conduită preventivă și obligații legale",
    summary_ro:
      "Măsurile imediate la locul unui accident, evaluarea victimelor, trusa medicală obligatorie, alcoolul la volan și utilizarea telefonului.",
    key_points_ro: [
      "Ordinea intervenției la accident: securizarea locului (triunghiuri, vestă, oprire motor) > apel 112 > evaluarea și ajutorul victimelor.",
      "Nu se scoate casca motociclistului accidentat decât dacă există pericol iminent sau blocaj respirator extrem; imobilizarea coloanei este prioritară.",
      "Este interzisă conducerea sub influența alcoolului sau a substanțelor psihoactive, precum și folosirea telefonului ținut în mână.",
    ],
    cover_media_slug: "drum-dn7a",
    audio_path: null,
    audio_kind: "tts",
    audio_script_ro:
      "Capitolul 6: Prim ajutor și conduită preventivă. În cazul unui accident rutier cu victime, nu părăsiți locul faptei și nu modificați poziția vehiculelor până la sosirea poliției. Securizați zona cu triunghiurile reflectorizante, apelați 112 comunicând exact locul și numărul victimelor, opriți contactul vehiculelor implicate și nu deplasați răniții decât dacă există pericol de incendiu sau explozie.",
    minutes: 15,
    sort_order: 6,
    category_codes: ["AM", "A1", "A2", "A", "B1", "B", "BE", "C1", "C1E", "C", "CE", "D1", "D1E", "D", "DE"],
    blocks: [
      {
        id: "b-6-1",
        sort_order: 1,
        kind: "heading",
        body_ro: "1. Securizarea locului și apelul de urgență 112",
      },
      {
        id: "b-6-2",
        sort_order: 2,
        kind: "rule",
        body_ro:
          "În caz de accident cu victime, conducătorul are obligația să oprească imediat, să anunțe poliția și serviciul de urgență 112, să nu modifice starea locului și să nu părăsească locul accidentului fără încuviințarea poliției.",
        legal_ref: "OUG 195/2002, art. 77",
      },
      {
        id: "b-6-3",
        sort_order: 3,
        kind: "text",
        body_ro:
          "Triunghiurile reflectorizante se amplasează în fața și în spatele vehiculului avariat, la o distanță de cel puțin 30 m (sau 100 m pe autostradă). Echipamentul obligatoriu din autovehicul include: trusă medicală omologată în termen de valabilitate, două triunghiuri reflectorizante și stingător de incendiu verificat.",
      },
      {
        id: "b-6-4",
        sort_order: 4,
        kind: "warning",
        body_ro:
          "În timpul mersului este interzisă folosirea telefonului mobil fără dispozitiv tip „mâini libere” (hands-free). Conducerea sub influența alcoolului constituie contravenție (până la 0,40 mg/l alcool pur în aerul expirat) sau infracțiune (peste acest prag).",
        legal_ref: "OUG 195/2002, art. 36 & art. 102",
      },
    ],
  },
];

export const SEED_QUESTIONS: SeedQuestion[] = [
  // Chapter 1: Semne de circulatie (6 questions)
  {
    id: "q-semne-1",
    chapter_id: "ch-semne",
    chapter_slug: "semne-de-circulatie",
    difficulty: 1,
    stem_ro: "Ce semnifică indicatorul rotund cu fond albastru, chenar roșu și două linii diagonale roșii în formă de X?",
    media_slug: "oprire-interzisa-bistrita",
    exam_pool: false,
    multi: false,
    explanation_ro:
      "Indicatorul „Oprirea interzisă” interzice atât oprirea voluntară, cât și staționarea vehiculelor în zona sa de acțiune.",
    legal_ref: "HG 1391/2006, Anexa 2",
    category_codes: ["AM", "A1", "A2", "A", "B1", "B", "BE", "C1", "C1E", "C", "CE", "D1", "D1E", "D", "DE"],
    options: [
      { label: "A", body_ro: "Staționarea interzisă (oprirea sub 5 minute este permisă)", is_correct: false },
      { label: "B", body_ro: "Oprirea interzisă (interzice atât oprirea, cât și staționarea)", is_correct: true },
      { label: "C", body_ro: "Accesul interzis tuturor vehiculelor", is_correct: false },
    ],
  },
  {
    id: "q-semne-2",
    chapter_id: "ch-semne",
    chapter_slug: "semne-de-circulatie",
    difficulty: 2,
    stem_ro: "Care mijloc de semnalizare are prioritate absolută atunci când indicațiile din trafic se contrazic?",
    exam_pool: false,
    multi: false,
    explanation_ro:
      "Semnalele și indicațiile polițistului rutier primează față de semafoare, semnalizare temporară, indicatoare și marcaje.",
    legal_ref: "OUG 195/2002, art. 31",
    category_codes: ["AM", "A1", "A2", "A", "B1", "B", "BE", "C1", "C1E", "C", "CE", "D1", "D1E", "D", "DE"],
    options: [
      { label: "A", body_ro: "Semaforul aflat în funcțiune", is_correct: false },
      { label: "B", body_ro: "Semnalele polițistului rutier", is_correct: true },
      { label: "C", body_ro: "Indicatoarele de prioritate permanente", is_correct: false },
    ],
  },
  {
    id: "q-semne-3",
    chapter_id: "ch-semne",
    chapter_slug: "semne-de-circulatie",
    difficulty: 3,
    stem_ro: "În intersecția din imagine, ce obligații ai la întâlnirea celor două indicatoare montate pe același stâlp?",
    media_slug: "cedeaza-popa-tatu",
    exam_pool: false,
    multi: false,
    explanation_ro:
      "Triunghiul cu vârful în jos impune cedarea trecerii vehiculelor de pe drumul prioritar (când semaforul este stins sau pe galben intermitent), iar indicatorul rotund interzice virajul la stânga.",
    legal_ref: "HG 1391/2006, Anexa 2",
    category_codes: ["AM", "A1", "A2", "A", "B1", "B", "BE", "C1", "C1E", "C", "CE", "D1", "D1E", "D", "DE"],
    options: [
      { label: "A", body_ro: "Acordarea priorității (dacă semaforul nu funcționează) și interzicerea virajului la stânga", is_correct: true },
      { label: "B", body_ro: "Oprire obligatorie și viraj obligatoriu la stânga", is_correct: false },
      { label: "C", body_ro: "Drum cu prioritate și interzicerea depășirii", is_correct: false },
    ],
  },
  {
    id: "q-semne-4",
    chapter_id: "ch-semne",
    chapter_slug: "semne-de-circulatie",
    difficulty: 3,
    stem_ro: "Ce indică marcajul longitudinal continuu simplu sau dublu aplicat pe axul drumului?",
    media_slug: "marcaje-apold",
    exam_pool: true,
    multi: false,
    explanation_ro:
      "Linia continuă interzice încălcarea sau depășirea ei de către vehicule, delimitând sensurile sau benzile de circulație.",
    legal_ref: "HG 1391/2006, art. 77",
    category_codes: ["AM", "A1", "A2", "A", "B1", "B", "BE", "C1", "C1E", "C", "CE", "D1", "D1E", "D", "DE"],
    options: [
      { label: "A", body_ro: "Poate fi încălcată doar la virajul la stânga", is_correct: false },
      { label: "B", body_ro: "Interzice încălcarea sau depășirea sa", is_correct: true },
      { label: "C", body_ro: "Delimitează obligatoriu pista pentru biciclete", is_correct: false },
    ],
  },
  {
    id: "q-semne-5",
    chapter_id: "ch-semne",
    chapter_slug: "semne-de-circulatie",
    difficulty: 4,
    stem_ro: "Care afirmații sunt corecte privind semnalizarea temporară pe fond galben?",
    media_slug: "lucrari-transfagarasan",
    exam_pool: true,
    multi: true,
    explanation_ro:
      "Semnalizarea temporară pe fond galben modifică regimul normal al circulației și are prioritate față de indicatoarele permanente din acel sector.",
    legal_ref: "OUG 195/2002, art. 31",
    category_codes: ["AM", "A1", "A2", "A", "B1", "B", "BE", "C1", "C1E", "C", "CE", "D1", "D1E", "D", "DE"],
    options: [
      { label: "A", body_ro: "Are prioritate față de indicatoarele permanente", is_correct: true },
      { label: "B", body_ro: "Are caracter exclusiv informativ", is_correct: false },
      { label: "C", body_ro: "Modifică regimul normal de circulație pe durata lucrărilor", is_correct: true },
    ],
  },
  {
    id: "q-semne-6",
    chapter_id: "ch-semne",
    chapter_slug: "semne-de-circulatie",
    difficulty: 2,
    stem_ro: "Ce obligație impune indicatorul alb cu o bandă neagră diagonală și numărul 50 tăiat?",
    media_slug: "intrare-brasov-dn1",
    exam_pool: true,
    multi: false,
    explanation_ro:
      "Indicatorul „Sfârșitul limitării de viteză” anulează restricția anterioară de 50 km/h; de aici se aplică limita generală a sectorului de drum sau următorul indicator.",
    legal_ref: "HG 1391/2006, Anexa 2",
    category_codes: ["AM", "A1", "A2", "A", "B1", "B", "BE", "C1", "C1E", "C", "CE", "D1", "D1E", "D", "DE"],
    options: [
      { label: "A", body_ro: "Impune o viteză minimă obligatorie de 50 km/h", is_correct: false },
      { label: "B", body_ro: "Anulează limitarea anterioară de viteză la 50 km/h", is_correct: true },
      { label: "C", body_ro: "Interzice accesul vehiculelor peste 50 tone", is_correct: false },
    ],
  },

  // Chapter 2: Prioritati (6 questions)
  {
    id: "q-prio-1",
    chapter_id: "ch-prioritati",
    chapter_slug: "prioritati",
    difficulty: 1,
    stem_ro: "Cum procedezi la întâlnirea indicatorului „Oprire” (STOP) când drumul transversal pare complet liber?",
    media_slug: "stop-axente-sever",
    exam_pool: false,
    multi: false,
    explanation_ro:
      "La indicatorul „Oprire” oprirea completă este obligatorie în locul cu vizibilitate maximă, indiferent dacă se apropie sau nu alte vehicule.",
    legal_ref: "HG 1391/2006, art. 57",
    category_codes: ["AM", "A1", "A2", "A", "B1", "B", "BE", "C1", "C1E", "C", "CE", "D1", "D1E", "D", "DE"],
    options: [
      { label: "A", body_ro: "Încetinești fără să oprești și intri în intersecție", is_correct: false },
      { label: "B", body_ro: "Oprești complet roțile, te asiguri și acorzi prioritate", is_correct: true },
      { label: "C", body_ro: "Oprești doar pe timp de noapte", is_correct: false },
    ],
  },
  {
    id: "q-prio-2",
    chapter_id: "ch-prioritati",
    chapter_slug: "prioritati",
    difficulty: 2,
    stem_ro: "Cine are prioritate într-o intersecție cu sens giratoriu?",
    media_slug: "sens-giratoriu-timisoara",
    exam_pool: false,
    multi: false,
    explanation_ro:
      "În intersecțiile cu sens giratoriu au prioritate vehiculele care circulă deja în interiorul acestuia.",
    legal_ref: "OUG 195/2002, art. 57 alin. (4)",
    category_codes: ["AM", "A1", "A2", "A", "B1", "B", "BE", "C1", "C1E", "C", "CE", "D1", "D1E", "D", "DE"],
    options: [
      { label: "A", body_ro: "Vehiculele care pătrund în sensul giratoriu din dreapta", is_correct: false },
      { label: "B", body_ro: "Vehiculele care circulă în interiorul sensului giratoriu", is_correct: true },
      { label: "C", body_ro: "Vehiculele cu masă mai mare", is_correct: false },
    ],
  },
  {
    id: "q-prio-3",
    chapter_id: "ch-prioritati",
    chapter_slug: "prioritati",
    difficulty: 3,
    stem_ro: "Ce trebuie să faci înainte de a părăsi un sens giratoriu cu mai multe benzi dacă te afli pe banda interioară?",
    media_slug: "sens-giratoriu-timisoara",
    exam_pool: true,
    multi: false,
    explanation_ro:
      "Schimbarea benzilor în interiorul sensului giratoriu necesită semnalizare și acordarea priorității vehiculelor care circulă pe banda pe care intenționezi să intri.",
    legal_ref: "HG 1391/2006, art. 107",
    category_codes: ["AM", "A1", "A2", "A", "B1", "B", "BE", "C1", "C1E", "C", "CE", "D1", "D1E", "D", "DE"],
    options: [
      { label: "A", body_ro: "Ieși direct, deoarece ești deja în sensul giratoriu", is_correct: false },
      { label: "B", body_ro: "Semnalizezi dreapta, te asiguri și acorzi prioritate vehiculelor de pe banda exterioară", is_correct: true },
      { label: "C", body_ro: "Claxonezi pentru a opri traficul de pe banda 1", is_correct: false },
    ],
  },
  {
    id: "q-prio-4",
    chapter_id: "ch-prioritati",
    chapter_slug: "prioritati",
    difficulty: 2,
    stem_ro: "Într-o intersecție nedirijată, cărui vehicul îi acorzi prioritate?",
    exam_pool: false,
    multi: false,
    explanation_ro:
      "În intersecțiile cu circulație nedirijată se aplică regula priorității de dreapta.",
    legal_ref: "OUG 195/2002, art. 57 alin. (1)",
    category_codes: ["AM", "A1", "A2", "A", "B1", "B", "BE", "C1", "C1E", "C", "CE", "D1", "D1E", "D", "DE"],
    options: [
      { label: "A", body_ro: "Vehiculului care vine din partea stângă", is_correct: false },
      { label: "B", body_ro: "Vehiculului care vine din partea dreaptă", is_correct: true },
      { label: "C", body_ro: "Vehiculului care circulă cu viteză mai mare", is_correct: false },
    ],
  },
  {
    id: "q-prio-5",
    chapter_id: "ch-prioritati",
    chapter_slug: "prioritati",
    difficulty: 4,
    stem_ro: "Care este diferența principală dintre indicatorul „Cedează trecerea” și indicatorul „Oprire”?",
    media_slug: "cedeaza-helesteului",
    exam_pool: true,
    multi: false,
    explanation_ro:
      "La „Oprire” trebuie să oprești întotdeauna roțile înainte de a pătrunde în intersecție; la „Cedează trecerea” oprești doar dacă pe drumul prioritar circulă vehicule cărora trebuie să le cedezi trecerea.",
    legal_ref: "HG 1391/2006, art. 57–58",
    category_codes: ["AM", "A1", "A2", "A", "B1", "B", "BE", "C1", "C1E", "C", "CE", "D1", "D1E", "D", "DE"],
    options: [
      { label: "A", body_ro: "La „Cedează trecerea” oprești numai dacă se apropie vehicule pe drumul prioritar", is_correct: true },
      { label: "B", body_ro: "La „Cedează trecerea” ai prioritate dacă virezi la dreapta", is_correct: false },
      { label: "C", body_ro: "Nu există nicio diferență de obligație între ele", is_correct: false },
    ],
  },
  {
    id: "q-prio-6",
    chapter_id: "ch-prioritati",
    chapter_slug: "prioritati",
    difficulty: 5,
    stem_ro: "La ieșirea dintr-o curte sau dintr-un drum lateral neamenajat pe un drum public, ce obligație ai?",
    exam_pool: true,
    multi: false,
    explanation_ro:
      "Vehiculele care ies din curți, garaje, ganguri sau drumuri laterale fără prioritate acordă prioritate tuturor vehiculelor și pietonilor care circulă pe drumul public.",
    legal_ref: "OUG 195/2002, art. 58",
    category_codes: ["AM", "A1", "A2", "A", "B1", "B", "BE", "C1", "C1E", "C", "CE", "D1", "D1E", "D", "DE"],
    options: [
      { label: "A", body_ro: "Acorzi prioritate doar vehiculelor din dreapta", is_correct: false },
      { label: "B", body_ro: "Acorzi prioritate tuturor vehiculelor și pietonilor de pe drumul public", is_correct: true },
      { label: "C", body_ro: "Semnalizezi și intri imediat pe banda 1", is_correct: false },
    ],
  },

  // Chapter 3: Viteza si conditii meteo (6 questions)
  {
    id: "q-vit-1",
    chapter_id: "ch-viteza",
    chapter_slug: "viteza-si-conditii-meteo",
    difficulty: 1,
    stem_ro: "Care este limita maximă legală de viteză în localități pentru autoturisme, în lipsa altor indicatoare?",
    exam_pool: false,
    multi: false,
    explanation_ro:
      "Limita generală de viteză în localități este de 50 km/h, dacă administratorul drumului nu a stabilit altă limită prin indicatoare.",
    legal_ref: "OUG 195/2002, art. 49",
    category_codes: ["AM", "A1", "A2", "A", "B1", "B", "BE", "C1", "C1E", "C", "CE", "D1", "D1E", "D", "DE"],
    options: [
      { label: "A", body_ro: "50 km/h", is_correct: true },
      { label: "B", body_ro: "60 km/h", is_correct: false },
      { label: "C", body_ro: "70 km/h", is_correct: false },
    ],
  },
  {
    id: "q-vit-2",
    chapter_id: "ch-viteza",
    chapter_slug: "viteza-si-conditii-meteo",
    difficulty: 2,
    stem_ro: "Care sunt limitele maxime de viteză pentru categoria B pe drum expres și pe autostradă?",
    exam_pool: false,
    multi: false,
    explanation_ro:
      "Conform OUG 195/2002 art. 49 actualizat, pentru categoriile A și B limita este 120 km/h pe drumuri expres și 130 km/h pe autostrăzi.",
    legal_ref: "OUG 195/2002, art. 49 alin. (4)",
    category_codes: ["A1", "A2", "A", "B1", "B"],
    options: [
      { label: "A", body_ro: "100 km/h pe drum expres și 120 km/h pe autostradă", is_correct: false },
      { label: "B", body_ro: "120 km/h pe drum expres și 130 km/h pe autostradă", is_correct: true },
      { label: "C", body_ro: "110 km/h pe ambele tipuri de drumuri", is_correct: false },
    ],
  },
  {
    id: "q-vit-3",
    chapter_id: "ch-viteza",
    chapter_slug: "viteza-si-conditii-meteo",
    difficulty: 3,
    stem_ro: "Cu ce viteză maximă poate circula pe autostradă un conducător categoria B care are permisul de 6 luni?",
    exam_pool: true,
    multi: false,
    explanation_ro:
      "Conducătorii cu vechime mai mică de 1 an trebuie să reducă limita maximă admisă cu 20 km/h în afara localităților: 130 − 20 = 110 km/h.",
    legal_ref: "OUG 195/2002, art. 50 alin. (4)",
    category_codes: ["A1", "A2", "A", "B1", "B"],
    options: [
      { label: "A", body_ro: "130 km/h", is_correct: false },
      { label: "B", body_ro: "110 km/h", is_correct: true },
      { label: "C", body_ro: "90 km/h", is_correct: false },
    ],
  },
  {
    id: "q-vit-4",
    chapter_id: "ch-viteza",
    chapter_slug: "viteza-si-conditii-meteo",
    difficulty: 2,
    stem_ro: "Ce măsuri sunt obligatorii pe drumul din imagine, acoperit cu apă după ploaie și cu lucrări semnalizate?",
    media_slug: "bucuresti-ploaie",
    exam_pool: false,
    multi: true,
    explanation_ro:
      "Carosabilul ud și zona de lucrări impun respectarea limitării de 40 km/h, mărirea distanței față de vehiculul din față și evitarea manevrelor bruște.",
    legal_ref: "HG 1391/2006, art. 123",
    category_codes: ["AM", "A1", "A2", "A", "B1", "B", "BE", "C1", "C1E", "C", "CE", "D1", "D1E", "D", "DE"],
    options: [
      { label: "A", body_ro: "Respectarea limitării de viteză de 40 km/h", is_correct: true },
      { label: "B", body_ro: "Mărirea distanței față de vehiculul din față", is_correct: true },
      { label: "C", body_ro: "Folosirea luminilor de avarie pe toată durata ploii", is_correct: false },
    ],
  },
  {
    id: "q-vit-5",
    chapter_id: "ch-viteza",
    chapter_slug: "viteza-si-conditii-meteo",
    difficulty: 3,
    stem_ro: "Ce viteză maximă este permisă la trecerea pe lângă indicatorul galben din Brașov, imediat după indicatorul de localitate?",
    media_slug: "intrare-brasov-dn1",
    exam_pool: true,
    multi: false,
    explanation_ro:
      "Panoul de localitate cu limită de 80 km/h stabilește 80 km/h în localitate, însă imediat după acesta este montat indicatorul de lucrări cu limitare la 60 km/h, care devine obligatoriu.",
    legal_ref: "OUG 195/2002, art. 31 & art. 49",
    category_codes: ["AM", "A1", "A2", "A", "B1", "B", "BE", "C1", "C1E", "C", "CE", "D1", "D1E", "D", "DE"],
    options: [
      { label: "A", body_ro: "90 km/h", is_correct: false },
      { label: "B", body_ro: "80 km/h pe sectorul de intrare, apoi 60 km/h la indicatorul de lucrări", is_correct: true },
      { label: "C", body_ro: "50 km/h pe toată lungimea orașului", is_correct: false },
    ],
  },
  {
    id: "q-vit-6",
    chapter_id: "ch-viteza",
    chapter_slug: "viteza-si-conditii-meteo",
    difficulty: 4,
    stem_ro: "Când ești obligat să reduci viteza până la limita evitării oricărui pericol la întâlnirea indicatorului „Copii”?",
    media_slug: "copii-fagaras",
    exam_pool: true,
    multi: false,
    explanation_ro:
      "Indicatorul „Copii” obligă la prudență și reducerea vitezei până la cel mult 30 km/h în localități (50 km/h în afara lor) în intervalul orar stabilit sau ori de câte ori sunt copii în zonă.",
    legal_ref: "HG 1391/2006, art. 123 lit. i)",
    category_codes: ["AM", "A1", "A2", "A", "B1", "B", "BE", "C1", "C1E", "C", "CE", "D1", "D1E", "D", "DE"],
    options: [
      { label: "A", body_ro: "Între orele 07:00 și 22:00 sau ori de câte ori sunt copii în apropierea carosabilului", is_correct: true },
      { label: "B", body_ro: "Doar când există o trecere de pietoni semnalizată", is_correct: false },
      { label: "C", body_ro: "Numai în timpul iernii", is_correct: false },
    ],
  },

  // Chapter 4: Distante de siguranta, depasire, oprire (6 questions)
  {
    id: "q-dist-1",
    chapter_id: "ch-distante",
    chapter_slug: "distante-de-siguranta",
    difficulty: 1,
    stem_ro: "Ce distanță minimă trebuie lăsată față de o trecere pentru pietoni la oprirea voluntară a vehiculului?",
    exam_pool: false,
    multi: false,
    explanation_ro:
      "Oprirea voluntară este interzisă pe trecerea pentru pietoni și la mai puțin de 25 m înainte și după aceasta, pentru a nu bloca vizibilitatea.",
    legal_ref: "HG 1391/2006, art. 142 lit. e)",
    category_codes: ["AM", "A1", "A2", "A", "B1", "B", "BE", "C1", "C1E", "C", "CE", "D1", "D1E", "D", "DE"],
    options: [
      { label: "A", body_ro: "5 metri", is_correct: false },
      { label: "B", body_ro: "15 metri", is_correct: false },
      { label: "C", body_ro: "25 metri", is_correct: true },
    ],
  },
  {
    id: "q-dist-2",
    chapter_id: "ch-distante",
    chapter_slug: "distante-de-siguranta",
    difficulty: 2,
    stem_ro: "Ce avertizare transmite panoul din imagine pe un drum de munte?",
    media_slug: "lucrari-transfagarasan",
    exam_pool: false,
    multi: false,
    explanation_ro:
      "Panoul avertizează asupra unui sector cu lucrări pe drum și semaforizare temporară la 400 m, cu risc ridicat de accidente.",
    legal_ref: "HG 1391/2006, Anexa 2",
    category_codes: ["AM", "A1", "A2", "A", "B1", "B", "BE", "C1", "C1E", "C", "CE", "D1", "D1E", "D", "DE"],
    options: [
      { label: "A", body_ro: "Lucrări și semaforizare temporară la 400 m", is_correct: true },
      { label: "B", body_ro: "Drum închis definitiv după 400 m", is_correct: false },
      { label: "C", body_ro: "Trecere la nivel cu calea ferată la 400 m", is_correct: false },
    ],
  },
  {
    id: "q-dist-3",
    chapter_id: "ch-distante",
    chapter_slug: "distante-de-siguranta",
    difficulty: 3,
    stem_ro: "În care dintre situațiile următoare este interzisă depășirea?",
    exam_pool: true,
    multi: true,
    explanation_ro:
      "Depășirea este interzisă în intersecțiile cu circulație nedirijată, pe trecerile pentru pietoni și în curbele cu vizibilitate sub 50 m.",
    legal_ref: "HG 1391/2006, art. 120",
    category_codes: ["AM", "A1", "A2", "A", "B1", "B", "BE", "C1", "C1E", "C", "CE", "D1", "D1E", "D", "DE"],
    options: [
      { label: "A", body_ro: "În intersecțiile cu circulație nedirijată", is_correct: true },
      { label: "B", body_ro: "Pe trecerile pentru pietoni semnalizate", is_correct: true },
      { label: "C", body_ro: "Pe drumurile naționale cu linie discontinuă și vizibilitate bună", is_correct: false },
    ],
  },
  {
    id: "q-dist-4",
    chapter_id: "ch-distante",
    chapter_slug: "distante-de-siguranta",
    difficulty: 2,
    stem_ro: "Cum procedezi la întâlnirea indicatorului din imagine, pe un sector cu alunecări sau carosabil umed?",
    media_slug: "cadere-pietre-dn10",
    exam_pool: true,
    multi: false,
    explanation_ro:
      "Indicatorul „Drum alunecos” și balizele de lucrări impun reducerea vitezei, mărirea distanței de siguranță și evitarea frânărilor bruște.",
    legal_ref: "HG 1391/2006, art. 123",
    category_codes: ["AM", "A1", "A2", "A", "B1", "B", "BE", "C1", "C1E", "C", "CE", "D1", "D1E", "D", "DE"],
    options: [
      { label: "A", body_ro: "Accelerezi ușor pentru a trece mai repede de zonă", is_correct: false },
      { label: "B", body_ro: "Reduci viteza și mărești distanța față de vehiculul din față", is_correct: true },
      { label: "C", body_ro: "Circuli cât mai aproape de marginea din dreapta și oprești", is_correct: false },
    ],
  },
  {
    id: "q-dist-5",
    chapter_id: "ch-distante",
    chapter_slug: "distante-de-siguranta",
    difficulty: 4,
    stem_ro: "Ce trebuie să verifici obligatoriu înainte de a începe o depășire?",
    exam_pool: false,
    multi: true,
    explanation_ro:
      "Conducătorul trebuie să se asigure că cel din față nu a semnalizat intenția de depășire/viraj, cel din spate nu a început depășirea și există spațiu și vizibilitate suficiente pentru revenire.",
    legal_ref: "HG 1391/2006, art. 118",
    category_codes: ["AM", "A1", "A2", "A", "B1", "B", "BE", "C1", "C1E", "C", "CE", "D1", "D1E", "D", "DE"],
    options: [
      { label: "A", body_ro: "Vehiculul din spate nu a început deja manevra de depășire", is_correct: true },
      { label: "B", body_ro: "Există vizibilitate și spațiu suficient pentru revenirea pe bandă fără a stânjeni", is_correct: true },
      { label: "C", body_ro: "Este obligatoriu să claxonezi de fiecare dată în localitate", is_correct: false },
    ],
  },
  {
    id: "q-dist-6",
    chapter_id: "ch-distante",
    chapter_slug: "distante-de-siguranta",
    difficulty: 5,
    stem_ro: "La ce distanță de colțul intersecției este interzisă oprirea voluntară a vehiculului?",
    exam_pool: true,
    multi: false,
    explanation_ro:
      "Oprirea este interzisă în intersecții, inclusiv cele cu circulație în sens giratoriu, precum și în zona de preselecție ori la mai puțin de 25 m de colțul intersecției.",
    legal_ref: "HG 1391/2006, art. 142 lit. f)",
    category_codes: ["AM", "A1", "A2", "A", "B1", "B", "BE", "C1", "C1E", "C", "CE", "D1", "D1E", "D", "DE"],
    options: [
      { label: "A", body_ro: "La mai puțin de 10 metri", is_correct: false },
      { label: "B", body_ro: "La mai puțin de 25 metri", is_correct: true },
      { label: "C", body_ro: "La mai puțin de 50 metri", is_correct: false },
    ],
  },

  // Chapter 5: Autostrazi si drumuri nationale (6 questions)
  {
    id: "q-auto-1",
    chapter_id: "ch-autostrazi",
    chapter_slug: "autostrazi-si-drumuri-expres",
    difficulty: 1,
    stem_ro: "Care manevre sunt interzise pe autostradă?",
    media_slug: "autostrada-sibiu",
    exam_pool: false,
    multi: true,
    explanation_ro:
      "Pe autostradă sunt interzise întoarcerea, mersul înapoi, traversarea spațiului median și circulația pe banda de urgență în condiții normale.",
    legal_ref: "OUG 195/2002, art. 74",
    category_codes: ["A1", "A2", "A", "B1", "B", "BE", "C1", "C1E", "C", "CE", "D1", "D1E", "D", "DE"],
    options: [
      { label: "A", body_ro: "Întoarcerea și mersul înapoi", is_correct: true },
      { label: "B", body_ro: "Circulația pe banda de urgență pentru depășirea coloanei", is_correct: true },
      { label: "C", body_ro: "Depășirea pe banda 2 când banda 1 este ocupată", is_correct: false },
    ],
  },
  {
    id: "q-auto-2",
    chapter_id: "ch-autostrazi",
    chapter_slug: "autostrazi-si-drumuri-expres",
    difficulty: 2,
    stem_ro: "Cum folosești corect banda de accelerare la intrarea pe autostradă?",
    media_slug: "autostrada-sibiu",
    exam_pool: true,
    multi: false,
    explanation_ro:
      "Pe banda de accelerare adaptezi viteza la cea a traficului de pe autostradă, semnalizezi stânga și acorzi prioritate vehiculelor care circulă pe banda 1.",
    legal_ref: "HG 1391/2006, art. 169",
    category_codes: ["A1", "A2", "A", "B1", "B", "BE", "C1", "C1E", "C", "CE", "D1", "D1E", "D", "DE"],
    options: [
      { label: "A", body_ro: "Oprești la începutul benzii de accelerare până nu mai vine nicio mașină", is_correct: false },
      { label: "B", body_ro: "Accelerezi pe banda dedicată și pătrunzi pe banda 1 acordând prioritate", is_correct: true },
      { label: "C", body_ro: "Intri direct pe banda 2 pentru a evita camioanele", is_correct: false },
    ],
  },
  {
    id: "q-auto-3",
    chapter_id: "ch-autostrazi",
    chapter_slug: "autostrazi-si-drumuri-expres",
    difficulty: 3,
    stem_ro: "Când ai voie să folosești luminile de întâlnire sau de zi în afara localităților?",
    exam_pool: false,
    multi: false,
    explanation_ro:
      "Conform modificărilor la OUG 195/2002, pe toate categoriile de drumuri publice (inclusiv în localități), luminile de întâlnire sau de circulație diurnă trebuie să fie aprinse permanent în timpul mersului.",
    legal_ref: "OUG 195/2002, art. 44 alin. (2)",
    category_codes: ["AM", "A1", "A2", "A", "B1", "B", "BE", "C1", "C1E", "C", "CE", "D1", "D1E", "D", "DE"],
    options: [
      { label: "A", body_ro: "Permanent, pe toate categoriile de drumuri publice", is_correct: true },
      { label: "B", body_ro: "Doar pe autostrăzi și pe timp de noapte", is_correct: false },
      { label: "C", body_ro: "Numai când plouă sau este ceață", is_correct: false },
    ],
  },
  {
    id: "q-auto-4",
    chapter_id: "ch-autostrazi",
    chapter_slug: "autostrazi-si-drumuri-expres",
    difficulty: 3,
    stem_ro: "Cum este recomandat să cobori o pantă lungă cu serpentine, precum cea din imagine?",
    media_slug: "transfagarasan",
    exam_pool: true,
    multi: false,
    explanation_ro:
      "La coborârea pantelor lungi, utilizarea frânei de motor într-o treaptă inferioară previne supraîncălzirea și pierderea eficienței frânelor de serviciu.",
    legal_ref: "Conduită preventivă",
    category_codes: ["A1", "A2", "A", "B1", "B", "BE", "C1", "C1E", "C", "CE", "D1", "D1E", "D", "DE"],
    options: [
      { label: "A", body_ro: "Cu schimbătorul la punctul mort, apăsând continuu pedala de frână", is_correct: false },
      { label: "B", body_ro: "Într-o treaptă inferioară de viteză, folosind frâna de motor", is_correct: true },
      { label: "C", body_ro: "Cu motorul oprit pentru economie de carburant", is_correct: false },
    ],
  },
  {
    id: "q-auto-5",
    chapter_id: "ch-autostrazi",
    chapter_slug: "autostrazi-si-drumuri-expres",
    difficulty: 4,
    stem_ro: "Ce vehicule nu au dreptul să circule pe autostradă?",
    exam_pool: true,
    multi: false,
    explanation_ro:
      "Pe autostrăzi este interzis accesul autovehiculelor care, prin construcție sau din alte cauze, nu pot depăși viteza de 50 km/h, precum și al mopedelor, bicicletelor și vehiculelor cu tracțiune animală.",
    legal_ref: "OUG 195/2002, art. 74",
    category_codes: ["AM", "A1", "A2", "A", "B1", "B", "BE", "C1", "C1E", "C", "CE", "D1", "D1E", "D", "DE"],
    options: [
      { label: "A", body_ro: "Autoturismele cu remorcă ușoară", is_correct: false },
      { label: "B", body_ro: "Mopedele și vehiculele care nu pot depăși 50 km/h", is_correct: true },
      { label: "C", body_ro: "Motocicletele de peste 125 cm³", is_correct: false },
    ],
  },
  {
    id: "q-auto-6",
    chapter_id: "ch-autostrazi",
    chapter_slug: "autostrazi-si-drumuri-expres",
    difficulty: 5,
    stem_ro: "Dacă ai ratat ieșirea de pe autostradă, cum procedezi legal?",
    exam_pool: true,
    multi: false,
    explanation_ro:
      "Întoarcerea și mersul înapoi sunt strict interzise. Trebuie să continui deplasarea până la următorul nod rutier (ieșire).",
    legal_ref: "OUG 195/2002, art. 74",
    category_codes: ["A1", "A2", "A", "B1", "B", "BE", "C1", "C1E", "C", "CE", "D1", "D1E", "D", "DE"],
    options: [
      { label: "A", body_ro: "Dai cu spatele pe banda de urgență până la bretea", is_correct: false },
      { label: "B", body_ro: "Continui până la următoarea ieșire de pe autostradă", is_correct: true },
      { label: "C", body_ro: "Traversezi spațiul median pe la trecerea de serviciu", is_correct: false },
    ],
  },

  // Chapter 6: Prim ajutor si conduita (6 questions)
  {
    id: "q-pa-1",
    chapter_id: "ch-prim-ajutor",
    chapter_slug: "prim-ajutor-si-conduita",
    difficulty: 1,
    stem_ro: "Care este primul pas la sosirea la locul unui accident rutier cu victime?",
    exam_pool: false,
    multi: false,
    explanation_ro:
      "Prioritară este siguranța salvatorului și a victimelor: semnalizarea zonei, oprirea motorului și apelul la 112 înainte de orice manevră medicală.",
    legal_ref: "OUG 195/2002, art. 77",
    category_codes: ["AM", "A1", "A2", "A", "B1", "B", "BE", "C1", "C1E", "C", "CE", "D1", "D1E", "D", "DE"],
    options: [
      { label: "A", body_ro: "Securizarea locului accidentului și apelarea serviciului 112", is_correct: true },
      { label: "B", body_ro: "Mutarea imediată a tuturor victimelor pe trotuar", is_correct: false },
      { label: "C", body_ro: "Oferirea de apă sau calmante victimelor", is_correct: false },
    ],
  },
  {
    id: "q-pa-2",
    chapter_id: "ch-prim-ajutor",
    chapter_slug: "prim-ajutor-si-conduita",
    difficulty: 2,
    stem_ro: "Ce obiecte sunt obligatorii în dotarea fiecărui autoturism?",
    exam_pool: false,
    multi: true,
    explanation_ro:
      "Autovehiculele trebuie dotate cu trusă medicală de prim ajutor, două triunghiuri reflectorizante și un stingător de incendiu, omologate și în termen.",
    legal_ref: "OUG 195/2002, art. 8",
    category_codes: ["B1", "B", "BE", "C1", "C1E", "C", "CE", "D1", "D1E", "D", "DE"],
    options: [
      { label: "A", body_ro: "Trusă medicală omologată în termen de valabilitate", is_correct: true },
      { label: "B", body_ro: "Două triunghiuri reflectorizante și stingător verificat", is_correct: true },
      { label: "C", body_ro: "Lanțuri antiderapante pe timp de vară", is_correct: false },
    ],
  },
  {
    id: "q-pa-3",
    chapter_id: "ch-prim-ajutor",
    chapter_slug: "prim-ajutor-si-conduita",
    difficulty: 3,
    stem_ro: "Cum procedezi în cazul unei victime inconștiente care respiră normal și nu are suspiciune de traumatism de coloană?",
    exam_pool: true,
    multi: false,
    explanation_ro:
      "Poziția laterală de siguranță menține căile aeriene libere și previne aspirarea secrețiilor.",
    legal_ref: "Protocol prim ajutor rutier",
    category_codes: ["AM", "A1", "A2", "A", "B1", "B", "BE", "C1", "C1E", "C", "CE", "D1", "D1E", "D", "DE"],
    options: [
      { label: "A", body_ro: "O așezi în poziția laterală de siguranță", is_correct: true },
      { label: "B", body_ro: "Începi imediat compresiile toracice", is_correct: false },
      { label: "C", body_ro: "O așezi în șezut cu capul aplecat înainte", is_correct: false },
    ],
  },
  {
    id: "q-pa-4",
    chapter_id: "ch-prim-ajutor",
    chapter_slug: "prim-ajutor-si-conduita",
    difficulty: 3,
    stem_ro: "Când este permisă folosirea telefonului mobil de către conducătorul auto în timpul mersului?",
    exam_pool: true,
    multi: false,
    explanation_ro:
      "Este interzisă ținerea în mână sau folosirea telefonului în timpul mersului fără un sistem de tip „mâini libere” (hands-free).",
    legal_ref: "OUG 195/2002, art. 36 alin. (3)",
    category_codes: ["AM", "A1", "A2", "A", "B1", "B", "BE", "C1", "C1E", "C", "CE", "D1", "D1E", "D", "DE"],
    options: [
      { label: "A", body_ro: "Oricând dacă circuli cu sub 30 km/h", is_correct: false },
      { label: "B", body_ro: "Numai cu dispozitiv de tip „mâini libere” (hands-free)", is_correct: true },
      { label: "C", body_ro: "Doar pe autostradă", is_correct: false },
    ],
  },
  {
    id: "q-pa-5",
    chapter_id: "ch-prim-ajutor",
    chapter_slug: "prim-ajutor-si-conduita",
    difficulty: 4,
    stem_ro: "Cum se oprește o hemoragie externă abundentă la un membru al victimei?",
    exam_pool: true,
    multi: false,
    explanation_ro:
      "Primul gest eficient și sigur este compresia directă pe plagă cu pansament steril sau material curat; garoul se folosește doar ca ultimă soluție în amputații sau hemoragii ce nu pot fi controlate prin compresie.",
    legal_ref: "Protocol prim ajutor rutier",
    category_codes: ["AM", "A1", "A2", "A", "B1", "B", "BE", "C1", "C1E", "C", "CE", "D1", "D1E", "D", "DE"],
    options: [
      { label: "A", body_ro: "Prin compresie directă pe rană cu pansament curat", is_correct: true },
      { label: "B", body_ro: "Prin aplicarea imediată a unui garou fără pansament", is_correct: false },
      { label: "C", body_ro: "Prin spălarea rănii cu apă rece de la râu", is_correct: false },
    ],
  },
  {
    id: "q-pa-6",
    chapter_id: "ch-prim-ajutor",
    chapter_slug: "prim-ajutor-si-conduita",
    difficulty: 5,
    stem_ro: "La ce distanță în spatele vehiculului imobilizat pe autostradă se amplasează triunghiul reflectorizant?",
    exam_pool: true,
    multi: false,
    explanation_ro:
      "Pe drumurile obișnuite triunghiurile se așază la cel puțin 30 m, iar pe autostrăzi la cel puțin 100 m pentru a oferi timp de reacție la viteze mari.",
    legal_ref: "HG 1391/2006, art. 156",
    category_codes: ["A1", "A2", "A", "B1", "B", "BE", "C1", "C1E", "C", "CE", "D1", "D1E", "D", "DE"],
    options: [
      { label: "A", body_ro: "Cel puțin 15 metri", is_correct: false },
      { label: "B", body_ro: "Cel puțin 30 metri", is_correct: false },
      { label: "C", body_ro: "Cel puțin 100 metri", is_correct: true },
    ],
  },

  // Category-specific & advanced questions (AM, A1/A2/A, BE, C/CE, D)
  {
    id: "q-spec-am-1",
    chapter_id: "ch-viteza",
    chapter_slug: "viteza-si-conditii-meteo",
    difficulty: 2,
    stem_ro: "Care este viteza maximă prin construcție a unui moped încadrat în categoria AM?",
    exam_pool: true,
    multi: false,
    explanation_ro:
      "Mopedele din categoria AM au viteza maximă prin construcție mai mare de 25 km/h, dar care nu depășește 45 km/h, și cilindree de cel mult 50 cm³ (sau putere electrică ≤ 4 kW).",
    legal_ref: "OUG 195/2002, art. 6 pct. 21",
    category_codes: ["AM", "A1", "A2", "A", "B1", "B"],
    options: [
      { label: "A", body_ro: "Cel mult 45 km/h", is_correct: true },
      { label: "B", body_ro: "Cel mult 60 km/h", is_correct: false },
      { label: "C", body_ro: "Cel mult 70 km/h", is_correct: false },
    ],
  },
  {
    id: "q-spec-moto-1",
    chapter_id: "ch-prim-ajutor",
    chapter_slug: "prim-ajutor-si-conduita",
    difficulty: 3,
    stem_ro: "Cum procedezi cu casca de protecție a unui motociclist rănit în urma unui accident rutier?",
    exam_pool: true,
    multi: false,
    explanation_ro:
      "Casca unui motociclist accidentat nu se scoate de către persoane neinstruite, deoarece există risc major de agravare a leziunilor coloanei cervicale; excepție face doar stopul cardio-respirator când este indispensabilă eliberarea căilor aeriene.",
    legal_ref: "Protocol prim ajutor rutier",
    category_codes: ["AM", "A1", "A2", "A", "B"],
    options: [
      { label: "A", body_ro: "O scoți imediat prin tracțiune rapidă pentru a-l răcori", is_correct: false },
      { label: "B", body_ro: "Nu o scoți decât în caz de stop respirator sau pericol iminent, menținând axul cap-gât-trunchi", is_correct: true },
      { label: "C", body_ro: "O rotești stânga-dreapta pentru a verifica mobilitatea gâtului", is_correct: false },
    ],
  },
  {
    id: "q-spec-moto-2",
    chapter_id: "ch-distante",
    chapter_slug: "distante-de-siguranta",
    difficulty: 3,
    stem_ro: "Ce zonă a benzii de circulație oferă motociclistului vizibilitate optimă și aderență mai bună pe un drum uscat?",
    exam_pool: false,
    multi: false,
    explanation_ro:
      "Treimea centrală a benzii poate prezenta urme de ulei lăsate de autovehicule; poziționarea ușor spre stânga centrului benzii oferă unghi bun în oglinzile vehiculului din față și aderență superioară.",
    legal_ref: "Conduită preventivă moto",
    category_codes: ["AM", "A1", "A2", "A"],
    options: [
      { label: "A", body_ro: "Chiar pe marcajul continuu de la marginea acostamentului", is_correct: false },
      { label: "B", body_ro: "Ușor în stânga axului propriei benzi, evitând dâra centrală de ulei și marcajele alunecoase", is_correct: true },
      { label: "C", body_ro: "În unghiul mort din dreapta spate al camioanelor", is_correct: false },
    ],
  },
  {
    id: "q-spec-be-1",
    chapter_id: "ch-viteza",
    chapter_slug: "viteza-si-conditii-meteo",
    difficulty: 3,
    stem_ro: "Cu cât este mai mică limita maximă de viteză în afara localităților pentru un ansamblu de vehicule cu remorcă (categoria BE / CE)?",
    exam_pool: true,
    multi: false,
    explanation_ro:
      "Viteza maximă admisă în afara localităților pentru autovehiculele care tractează remorci sau semiremorci este cu 10 km/h mai mică decât viteza maximă admisă pentru categoria din care face parte autovehiculul trăgător.",
    legal_ref: "OUG 195/2002, art. 50 alin. (2)",
    category_codes: ["B", "BE", "C1", "C1E", "C", "CE", "D1E", "DE"],
    options: [
      { label: "A", body_ro: "Cu 10 km/h mai mică decât cea a autovehiculului trăgător", is_correct: true },
      { label: "B", body_ro: "Cu 30 km/h mai mică pe toate drumurile", is_correct: false },
      { label: "C", body_ro: "Limita rămâne identică cu cea a autoturismului fără remorcă", is_correct: false },
    ],
  },
  {
    id: "q-spec-be-2",
    chapter_id: "ch-distante",
    chapter_slug: "distante-de-siguranta",
    difficulty: 4,
    stem_ro: "Cum trebuie repartizată încărcătura într-o remorcă din categoria BE pentru a preveni balansul lateral (efectul de pendul)?",
    exam_pool: true,
    multi: false,
    explanation_ro:
      "Centrul de greutate trebuie menținut cât mai jos și deasupra axei (sau ușor în fața axei remorcii), respectând apăsarea verticală admisă pe cupla de remorcare.",
    legal_ref: "HG 1391/2006, art. 148–153",
    category_codes: ["B", "BE", "C1", "C1E", "C", "CE", "D1E", "DE"],
    options: [
      { label: "A", body_ro: "Toată greutatea în partea din spate a remorcii", is_correct: false },
      { label: "B", body_ro: "Centrul de greutate jos, deasupra axei și cu apăsare corectă pe cârligul de remorcare", is_correct: true },
      { label: "C", body_ro: "Încărcătura concentrată doar pe o singură latură", is_correct: false },
    ],
  },
  {
    id: "q-spec-c-1",
    chapter_id: "ch-viteza",
    chapter_slug: "viteza-si-conditii-meteo",
    difficulty: 3,
    stem_ro: "Care este viteza maximă legală pe autostradă în România pentru camioanele din categoriile C și CE?",
    media_slug: "nadlac-frontiera",
    exam_pool: true,
    multi: false,
    explanation_ro:
      "Pentru autovehiculele din categoriile C, CE și D, viteza maximă admisă pe autostrăzi este de 110 km/h (100 km/h pe drum expres, 90 km/h pe drumuri europene E și 80 km/h pe celelalte drumuri din afara localităților).",
    legal_ref: "OUG 195/2002, art. 50 alin. (1) lit. b)",
    category_codes: ["C1", "C1E", "C", "CE", "D1", "D1E", "D", "DE"],
    options: [
      { label: "A", body_ro: "130 km/h", is_correct: false },
      { label: "B", body_ro: "110 km/h", is_correct: true },
      { label: "C", body_ro: "90 km/h", is_correct: false },
    ],
  },
  {
    id: "q-spec-c-2",
    chapter_id: "ch-prim-ajutor",
    chapter_slug: "prim-ajutor-si-conduita",
    difficulty: 4,
    stem_ro: "După o perioadă de conducere de 4 ore și 30 de minute, ce pauză neîntreruptă este obligatorie pentru conducătorul unui camion (cat. C / CE) sau autobuz (cat. D)?",
    exam_pool: true,
    multi: false,
    explanation_ro:
      "Conform Regulamentului (CE) nr. 561/2006, după o perioadă de conducere de 4 ore și jumătate, conducătorul trebuie să ia o pauză neîntreruptă de cel puțin 45 de minute (sau fracționată: minimum 15 minute urmate de minimum 30 de minute).",
    legal_ref: "Regulamentul (CE) 561/2006, art. 7",
    category_codes: ["C1", "C1E", "C", "CE", "D1", "D1E", "D", "DE"],
    options: [
      { label: "A", body_ro: "Cel puțin 45 de minute (sau 15 min + 30 min în interiorul perioadei)", is_correct: true },
      { label: "B", body_ro: "Cel puțin 15 minute la fiecare 6 ore", is_correct: false },
      { label: "C", body_ro: "Pauza este opțională dacă drumul este liber", is_correct: false },
    ],
  },
  {
    id: "q-spec-c-3",
    chapter_id: "ch-autostrazi",
    chapter_slug: "autostrazi-si-drumuri-expres",
    difficulty: 3,
    stem_ro: "Pe o autostradă cu cel puțin 3 benzi pe sens, pe ce benzi au voie să circule autovehiculele cu masa totală maximă autorizată mai mare de 3,5 tone (cat. C, CE)?",
    exam_pool: true,
    multi: false,
    explanation_ro:
      "Autovehiculele cu masa mai mare de 3,5 tone sau lungimea peste 7 metri pot folosi doar primele două benzi din partea dreaptă a autostrăzii și nu au voie pe banda a 3-a (cea de lângă axul median).",
    legal_ref: "HG 1391/2006, art. 102",
    category_codes: ["C1", "C1E", "C", "CE", "D1", "D1E", "D", "DE"],
    options: [
      { label: "A", body_ro: "Pe oricare dintre cele 3 benzi", is_correct: false },
      { label: "B", body_ro: "Numai pe primele două benzi de lângă marginea din dreapta a părții carosabile", is_correct: true },
      { label: "C", body_ro: "Exclusiv pe banda de urgență", is_correct: false },
    ],
  },
  {
    id: "q-spec-d-1",
    chapter_id: "ch-prioritati",
    chapter_slug: "prioritati",
    difficulty: 3,
    stem_ro: "Ce obligație au conducătorii celorlalte vehicule în localități atunci când un autobuz (cat. D) semnalizează ieșirea dintr-o stație prevăzută cu alveolă?",
    media_slug: "marcaje-apold",
    exam_pool: true,
    multi: false,
    explanation_ro:
      "În localități, conducătorii de vehicule sunt obligați să reducă viteza și, la nevoie, să oprească pentru a permite reintrarea în trafic a autobuzelor sau troleibuzelor care semnalizează plecarea din stațiile cu alveolă.",
    legal_ref: "HG 1391/2006, art. 131",
    category_codes: ["B", "BE", "C1", "C1E", "C", "CE", "D1", "D1E", "D", "DE"],
    options: [
      { label: "A", body_ro: "Să accelereze pentru a trece înaintea autobuzului", is_correct: false },
      { label: "B", body_ro: "Să reducă viteza și, la nevoie, să oprească pentru a-i permite reintrarea în trafic", is_correct: true },
      { label: "C", body_ro: "Nu au nicio obligație, autobuzul pierde întotdeauna prioritatea", is_correct: false },
    ],
  },
  {
    id: "q-spec-d-2",
    chapter_id: "ch-distante",
    chapter_slug: "distante-de-siguranta",
    difficulty: 3,
    stem_ro: "Ce reguli se aplică conducătorului unui autobuz (cat. D) în timpul transportului de persoane?",
    exam_pool: true,
    multi: true,
    explanation_ro:
      "Ușile autobuzului se deschid numai după oprirea completă în stație, iar pornirea din stație se face doar după închiderea ușilor și asigurarea că pasagerii au urcat/coborât în siguranță.",
    legal_ref: "HG 1391/2006, art. 148",
    category_codes: ["D1", "D1E", "D", "DE"],
    options: [
      { label: "A", body_ro: "Să deschidă ușile numai după oprirea completă în stație", is_correct: true },
      { label: "B", body_ro: "Să pornească din stație numai după închiderea ușilor și asigurarea călătorilor", is_correct: true },
      { label: "C", body_ro: "Să transporte mai mulți pasageri decât numărul maxim înscris în certificatul de înmatriculare", is_correct: false },
    ],
  },
];

export const SIGNS_TO_PHOTOGRAPH = [
  {
    name: "Drum cu prioritate (romb galben)",
    why: "Necesită fotografie reală pe o stradă din România, în locul desenelor vectoriale.",
  },
  {
    name: "Sens giratoriu (indicator albastru rotund)",
    why: "Avem fotografia intersecției giratorii din Timișoara; fotografia de aproape a indicatorului rotund albastru completează capitolul.",
  },
  {
    name: "Trecere pentru pietoni (indicator pătrat albastru)",
    why: "Util pentru lecția 1 și întrebările privind prioritatea pietonilor.",
  },
  {
    name: "Depășirea interzisă",
    why: "Fotografie frontală clară a indicatorului rotund cu două autoturisme.",
  },
  {
    name: "Trecere la nivel cu calea ferată fără bariere (crucea Sfântului Andrei)",
    why: "Pentru capitolul de priorități și oprire obligatorie.",
  },
];
