---
name: application-development
description: Spec-driven application development connecting Chat, Git, Codex and UAT. Use for greenfield and controlled-change software work, preparing executable outcome-based Codex tasks, catching contradictory instructions, and preserving multi-session recovery when quotas expire unexpectedly. Also governs design foundations and data lifecycles.
---

# Application Development

## Verze a vlastnictví

Aktuální verze masteru: **1.13.0**.

Používej SemVer:
- PATCH – oprava metodiky bez změny očekávaného workflow.
- MINOR – nová zpětně kompatibilní schopnost nebo pravidlo.
- MAJOR – změna architektury, odpovědností nebo kompatibility metodiky.

Autor, vlastník masteru a odborný správce: **Ladislav Goc**.  
Copyright © 2026 Ladislav Goc. Všechna práva vyhrazena.

Tento skill je licencovatelný master. Vlastní použití autora je `author-development` deployment. Uplatňuj současně principy `master-deployment`, pokud je tento skill použit k tvorbě přenositelného produktu, skillu, agenta nebo zákaznické aplikace.

## Účel

Vytvořit spolehlivou vazbu mezi prostředím, kde vzniká a schvaluje se zadání, a prostředím, kde se programuje. Nepředpokládat, že Codex automaticky vidí chat, Project Sources, rozhodnutí nebo kontext z jiné části ChatGPT. Přenést do Git repozitáře pouze řízený a jednoznačný implementační kontext a učinit jej pro Codex závazným.

Základní model:

```text
CHAT / PROJECT SOURCES
  analýza → rozhodnutí → specifikace → testování uživatelem
                 │
                 ▼
GIT GOVERNANCE LAYER
  AGENTS.md + spec/ + precedence + source map
                 │
                 ▼
CODEX
  implementace → testy → checkpoint / handoff → commit
                 │
                 ▼
CHAT / UŽIVATEL
  akceptační průchod → bug / nový požadavek / schválení
```

## Nejdůležitější pravidla

**Existující kód je důkaz aktuální implementace, nikoli důkaz zamýšleného chování.**

**Git repozitář je trvalý stav vývoje; konkrétní Codex session, účet nebo workspace je nahraditelný pracovník.**

Nikdy neodvozuj funkční požadavek pouze ze starého kódu, migrace, prototypu, README, screenshotu nebo historické implementace, pokud není výslovně převzat do aktuálního autoritativního zadání.

## 1. Nejprve určit režim

Rozliš:

- **GREENFIELD** – nový projekt bez významné existující implementace.
- **MID-CYCLE ADOPTION** – projekt už běží a metodika se zavádí dodatečně.
- **CONTROLLED CHANGE** – governance už existuje a řeší se další změna.

Při MID-CYCLE ADOPTION nikdy nezačínej reorganizací nebo mazáním. Nejdříve zmapuj zdroje, aktuální Git stav, rozpracované změny, dokumentaci a způsob spuštění aplikace. Zachovej možnost návratu.

## 2. Auditovat zdroje před předáním Codexu

Pokud jsou dostupné Project Sources, přílohy, dokumentace nebo repozitář, roztřiď je do kategorií:

1. **AUTHORITATIVE REQUIREMENTS** – schválené funkční zadání a novější schválené změny.
2. **STRUCTURAL COMPANION** – ER model, schéma, API kontrakt nebo jiný strojově čitelný model, jehož autorita je přesně vymezena.
3. **DEVELOPER CONTEXT** – aktuální lokální README, build/test/run postup a bezpečný handoff.
4. **IMPLEMENTATION STATE** – zdrojový kód, migrace, seed data, compose soubory; nejsou zdrojem požadavků.
5. **TRANSIENT EVIDENCE** – screenshoty, jednorázové výpisy, testovací exporty, Git bundle, dočasné handoffy.
6. **LEGACY / EXCLUDE** – staré specifikace, prototypy a materiály, které Codex pro aktuální změnu nepotřebuje.

Do Codex context layer nekopíruj mechanicky všechny Sources. Přenes pouze to, co Codex potřebuje pro správnou implementaci. Výchozí princip: **méně zdrojů, jasnější autorita**.

Pro detailní postup a doporučenou strukturu načti `references/methodology.md`.

## 3. Udržovat Git governance layer

Pro projekt, který používá Codex k implementaci, preferuj v kořeni repozitáře:

```text
AGENTS.md
spec/
  README.md
  current/
    <authoritative specification>
    <approved supplements>
    <structural companion models>
dev/
  CODEX_HANDOFF.md   # pokud projekt používá multi-session / multi-workspace Codex
```

`spec/README.md` musí určit:
- které soubory jsou autoritativní;
- jejich pořadí precedence;
- co je pouze technický companion;
- co není zdrojem požadavků;
- jak se schvaluje nová změna.

Kořenový `AGENTS.md` musí Codexu uložit minimálně:
- před změnou chování přečíst relevantní `spec/`;
- neodvozovat požadavky z existujícího kódu;
- při konfliktu dát přednost autoritativní specifikaci;
- neměnit autoritativní specifikaci bez výslovného pokynu;
- při nejasnosti nebo chybějícím požadavku zastavit implementaci a nahlásit problém;
- před implementací klasifikovat změnu;
- po implementaci spustit relevantní testy a vytvořit ucelený commit, pokud uživatel neurčí jinak.

`dev/CODEX_HANDOFF.md` je **DEVELOPER CONTEXT / IMPLEMENTATION STATE**, nikdy zdroj funkčních požadavků. Je-li použit, verzuj jej v Gitu a udržuj pouze jeden aktuální soubor; historii poskytuje Git.

Použij šablony v `references/methodology.md`, ale přizpůsob je konkrétnímu projektu.

## 3a. Zrcadlení metodických skillů do executor prostředí

Nepředpokládej, že Coding AI / Codex automaticky vidí ChatGPT Skills, jejich katalog nebo jejich interní soubory. Pokud aktuální workflow vyžaduje metodický skill, který executor prostředí neumí přímo načíst, vytvoř v Git repozitáři **řízené lokální zrcadlo pouze potřebných metodických skillů**.

Preferovaná struktura:

```text
ai/
  skills/
    <skill-name>/
      SKILL.md
      references/
        ...
```

Pravidla:
- zrcadli pouze skilly skutečně potřebné pro execution workflow; nekopíruj mechanicky celý ChatGPT skill katalog;
- lokální zrcadlo je **EXECUTION METHODOLOGY / DEVELOPER CONTEXT**, nikoli zdroj produktových požadavků;
- produktové požadavky zůstávají pouze v autoritativní project-spec vrstvě podle `spec/README.md`;
- u každého zrcadleného skillu eviduj název, verzi/protocol revision a původ (master skill), aby bylo zřejmé, jaká metodika je v repozitáři použita;
- při aktualizaci master skillu aktualizuj zrcadlo řízeně a samostatně; neprováděj tichou změnu během implementace business feature;
- pokud executor umí skill načíst nativně, preferuj nativní zdroj; lokální mirror používej jako explicitní fallback / portable context layer;
- secrets, zákaznická data ani deployment-specific citlivé hodnoty do mirroru nepatří;
- `AGENTS.md` musí jasně rozlišit `spec/current/**` (CO má produkt dělat) od `ai/skills/**` (JAK má executor pracovat).

Doporučený projektový invariant:

```text
spec/current/** = authoritative product behavior
ai/skills/**    = execution methodology / developer context
code            = implementation state / evidence
handoff         = current continuation state
```

Pokud prompt odkazuje na metodický skill, který executor nevidí, nesmí tvrdit, že ho použil. Buď:
1. načte odpovídající lokální mirror z `ai/skills/`, nebo
2. task označí jako metodicky blokovaný a požádá o zpřístupnění instrukcí.

Pro formální handoffy mezi orchestrátorem a Codexem zrcadli společně i všechny přímo závislé metodické skilly/protokoly, například `ai-meta-handoff`, pokud je požadován `Application Development` workflow.

## 4. Klasifikovat každou funkční změnu

Před předáním Codexu zařaď změnu právě do jedné hlavní kategorie:

### BUG_AGAINST_SPEC
Kód neodpovídá již schválenému zadání.

Požaduj:
- identifikaci relevantní části specifikace;
- opravu implementace, ne přepis specifikace podle kódu;
- regresní test odpovídající chybě.

### APPROVED_SPEC_CHANGE
Uživatel schválil novou nebo změněnou funkci a ta je nejprve zapsána do řízené specifikace nebo schváleného doplňku.

Požaduj:
- identifikaci novějšího schváleného požadavku;
- implementaci právě tohoto rozsahu;
- aktualizaci testů.

### REQUIREMENT_NOT_FOUND
Požadované chování není v autoritativních zdrojích dostatečně určeno.

Neprogramuj domněnku. Vrať rozhodnutí do Chatu/specifikační fáze.

### IMPLEMENTATION_ONLY
Refaktor, build, tooling, test infrastruktura nebo jiná změna bez změny funkčního chování.

Ověř, že opravdu nemění požadované chování, a drž změnu oddělenou od funkčních změn.

## 5. Oddělit role Chat a Codex

### Chat / Sources
Používej pro:
- funkční analýzu a rozhodování;
- diskusi variant;
- práci s autoritativním zadáním;
- zapisování schválených změn;
- uživatelské akceptační testování;
- přípravu přesného handoffu pro Codex.

### Codex
Používej pro:
- rozsáhlejší úpravy kódu;
- refaktory;
- migrace;
- testy;
- programátorské opravy;
- vytvoření commitů a technického handoffu.

Nedovol Codexu nahrazovat produktové rozhodnutí, které není ve specifikaci.

## 6. Bezpečný Git postup

Před větší změnou:
- ověř kořen repozitáře, branch a `git status`;
- pokud je working tree dirty, nejprve zjisti, komu změny patří a co obsahují;
- nikdy automaticky neprováděj reset/restore/checkout rozpracované práce;
- odděl governance commit od implementačních commitů;
- nemíchej nesouvisející změny do jednoho commitu;
- eviduj build/test stav před a po změně.

Při práci s uživatelem, který chce postupovat po jednotlivých příkazech, dávej **jeden bezpečný Bash příkaz na krok** a čekej na výsledek.

## 7. Multi-session / multi-account / multi-workspace Codex continuity

Použij tento režim, pokud dlouhá implementace může přesáhnout jednu Codex session, uživatel může přepnout účet/workspace nebo quota může přerušit běh.

### 7.1 Persistentní handoff

Použij verzovaný `dev/CODEX_HANDOFF.md`. Udržuj v něm minimálně:

- čas poslední aktualizace;
- repo root, branch a poslední ověřený HEAD;
- aktivní autoritativní task / addendum;
- stav `IN_PROGRESS` / `READY_FOR_UAT` / `BLOCKED`;
- completed;
- in progress;
- not started;
- untested / tests pending;
- changed files;
- migrations added;
- tests already passed;
- known blockers / decisions;
- working-tree warnings;
- přesný další krok;
- safe continuation instruction.

Neukládej do handoffu hesla, API keys, e-maily účtů ani jiné secrets. Identita workspace/accountu může být zmíněna pouze jako neškodná provozní poznámka, pokud je to užitečné.

### 7.2 Quota-aware režim

Pokud Codex zná zbývající procenta relevantních limitů, řiď se tvrdými prahy pro **každý** relevantní limit, zejména 5-hour a weekly quota:

- **> 20 %**: normální práce;
- **20 % až > 10 %**: `CHECKPOINT_AWARE` – nezačínej zbytečně široký nový blok, po významném posunu aktualizuj handoff;
- **<= 10 %**: `MANDATORY_HANDOFF` – nezahajuj nový významný feature block, migraci nebo široký refaktor. Prioritou je stabilizace a předání.

Quota exhaustion je očekávaná hranice session, nikoli chyba.

V `MANDATORY_HANDOFF`:
1. dokonči pouze bezpečně dokončitelný atomický krok;
2. nespouštěj nový široký zásah;
3. aktualizuj `dev/CODEX_HANDOFF.md`;
4. ověř repo root, branch, HEAD, `git status` a změněné soubory;
5. označ completed / in progress / not started / untested;
6. uveď přesný next step;
7. vytvoř `NEXT CODEX PROMPT` pro další session/workspace;
8. necommituj pouze proto, že quota dochází; commituj jen hotový a testovaný logický celek, pokud to workflow dovoluje.

### 7.3 Převzetí jiným Codexem

Nový Codex musí před pokračováním:
1. přečíst `AGENTS.md`, `spec/README.md`, relevantní `spec/current/` a `dev/CODEX_HANDOFF.md`;
2. ověřit repo root, branch, HEAD a `git status`;
3. porovnat handoff se skutečným working tree;
4. nahlásit nesoulad před pokračováním;
5. pokračovat až po ověření skutečného stavu.

**Handoff je navigační pomůcka, nikoli důkaz repository state. Git working tree je skutečnost o implementaci; `spec/current/` je autorita o zamýšleném chování.**

### 7.4 Povinný výstup končící session

Při handoffu vrať uživateli:
- stručný session summary;
- stav quota triggeru;
- zda byl `dev/CODEX_HANDOFF.md` aktualizován;
- přesný `NEXT CODEX PROMPT`, který lze vložit v jiné Codex session, účtu nebo workspace.

### 7.5 Checkpoint-based continuation a context efficiency

Po bezpečně ověřeném checkpointu používej princip **verify once → work narrowly → verify at coherent boundary**. Bezpečnost nesmí vést k mechanickému opakovanému čtení celé historie projektu nebo opakování drahých kontrol bez změny vstupů.

Při převzetí checkpointu vždy ověř minimálně repo root, branch, exact HEAD, `git status`, staging, aktivní autoritativní task/revizi a soulad aktuálního handoffu se skutečným working tree. Pokud se governance nebo autoritativní task od posledního checkpointu nezměnily, nepovažuj úplné opakované čtení všech starších specifikací za výchozí postup.

Po úspěšném takeoveru:
- čti celý aktuální autoritativní task a pouze relevantní části dalších autoritativních dokumentů; starší dokument otevři v plném rozsahu jen při konkrétní závislosti, konfliktu, nejasnosti nebo explicitním odkazu;
- handoff a implementační report používej jako navigační current-state vrstvu; nečti opakovaně historické checkpointy vložené pod aktuální stav, pokud je Git historie zachovává;
- neprováděj znovu repository-wide scan, když current handoff přesně určuje soubory/komponenty aktuálního bloku; rozšiř kontrolu až při nesouladu nebo chybě;
- neopakuj již PASSnuté testy, buildy, manifesty a drahé integrační kontroly, pokud aktuální změna nemění jejich vstupy, závislosti nebo bezpečnostní předpoklady; vždy však spusť testy přímo dotčeného bloku a povinné závěrečné regrese;
- drahé preservation/fingerprint/health kontroly proveď minimálně při takeoveru, na konci koherentního bloku a před deploymentem/destruktivním krokem; mezi těmito body používej lehčí kontrolu, pokud se chráněný stav nemohl změnit;
- u velkých generovaných sad proveď automatickou validaci celého korpusu a nákladnou vizuální/manual kontrolu na deterministickém reprezentativním matrixu pokrývajícím všechny layout/scenario family; při anomálii rozšiř vizuální kontrolu na postižené případy;
- pokud se objeví změněný HEAD, neočekávaný dirty stav, konflikt specifikací, selhání invariantu, neplatný checkpoint, změna relevantního schématu nebo `REQUIREMENT_NOT_FOUND`, přepni zpět do široké verifikace a nepokračuj z předpokladů.

`dev/CODEX_HANDOFF.md` a implementační report udržuj jako **current-state-first** dokumenty. Neakumuluj do jejich aktivní části celé předchozí handoffy. Historii poskytuje Git. Pokud je starší historie ponechána ve stejném souboru, aktuální prefix musí jednoznačně označit, co je aktivní, a continuation prompt má výslovně zakázat opakované čtení historické části bez důvodu.

Tato optimalizace nikdy nesnižuje autoritu `spec/current/`, Git safety, UAT ochranu, destructive-operation gates ani povinné finální testy.

## 8. Mid-cycle adoption

Pokud je metodika nasazována uprostřed vývoje:

1. Zastav další velké změny, ale nemaž rozpracovanou práci.
2. Zjisti Git stav a aktuální způsob spuštění/testování.
3. Zmapuj dostupné Sources a dokumenty.
4. Vyber pouze aktuální autoritativní a potřebné technické zdroje.
5. Vytvoř `spec/README.md`, `spec/current/` a kořenový `AGENTS.md`.
6. Přenes vybrané dokumenty do repozitáře nebo vytvoř jejich řízené textové ekvivalenty.
7. Ověř, že Codex dokáže správně zopakovat precedence bez změny kódu.
8. Commitni governance layer samostatně.
9. Teprve potom pokračuj v programování.

První Codex handoff po zavedení metodiky má být kontrolní. Neomezuj se na obecné shrnutí: vyžádej **úplný manifest všech souborů v `spec/current/`**, potvrzení jejich čitelnosti a explicitní precedence. Codex musí pro každý soubor uvést jeho roli a případné podmínky, za kterých může mít přednost před jiným zdrojem.

Vyžaduj závěrečný stav:
- `GOVERNANCE STATUS: PASS` pouze tehdy, když jsou všechny požadované autoritativní soubory dostupné a precedence je jednoznačná;
- `GOVERNANCE STATUS: BLOCKED`, pokud některý soubor nelze úplně nebo spolehlivě přečíst nebo pokud je precedence nejasná.

Pokud je stav `BLOCKED`, funkční implementaci nezačínej. Codex nesmí nahradit nečitelný baseline existujícím kódem, historickou dokumentací ani dílčím doplňkem. Pokud odpověď nesedí, neopravuj kód; oprav governance layer a kontrolu zopakuj.

## 9. Handoff pro Codex

Každé zadání Codexu má být krátké, ale musí obsahovat:

- klasifikaci změny;
- relevantní autoritativní zdroj/sekci;
- požadovaný výsledek;
- hranice změny;
- povinné testy;
- instrukci nezasahovat mimo scope;
- quota-aware continuation pravidla u delších tasků;
- požadavek na commit a stručný handoff, pokud je commit součástí workflow;
- povinnost samostatného `CODEX IMPLEMENTATION META REPORT` podle protokolu `ai-meta-handoff` připnutého pro daný task (v0.4 pro nově zahajované úkoly) pro ruční přenos do manager procesu.

Pro dlouhé tasky přidej povinnost založit/aktualizovat `dev/CODEX_HANDOFF.md` a použít prahy z §7.

## 9a. Mandatory independent reverse translation before Codex execution

For every formal behavior-changing task, call `ai-meta-handoff` to produce HUMAN + META instructions. A separate reconstruction step receives **META only**, creates `HUMAN_RECONSTRUCTED`, and the manager compares its meaning, restrictions, prohibitions and acceptance tests with the approved HUMAN DEFINITION. Record a per-requirement comparison and a `PASS/BLOCKED` gate according to the `ai-meta-handoff` protocol v0.2. If blocked, do not send the affected task to Codex. The approved HUMAN definition remains authoritative. For purely mechanical low-risk work without a formal handoff, note why this gate is not used.

## 9b. Required Codex completion report and manual return

At the end of each coding task, demand **two separate outputs**:

1. A short, human-readable completion summary.
2. A **standalone, complete, copy-ready** fenced YAML block clearly headed `CODEX IMPLEMENTATION META REPORT`, `EXECUTOR_TO_ORCHESTRATOR`, following the current `ai-meta-handoff` result schema. Include task ID, exact approved source ref and revision, each requirement's implementation status, files/components changed, relevant Git refs, migrations, tests with PASS/FAIL/NOT_RUN and evidence, blockers, deviations and unimplemented work. Use `manager_review_status: NOT_REVIEWED` and `manual_transfer_required: true`.

The user manually copies **the complete META block** from Codex to the Chat / manager/master process. Do not assume Codex and manager share a chat, account, files, or automatic synchronization. Codex must not declare the task accepted or manager-reviewed. If a session ends early, report a clearly labelled partial META handoff and leave task open.

The manager compares received META to the authoritative HUMAN DEFINITION, **reconstructing the claimed implemented behavior from META alone** before comparison. Then check available code/diff/commit/test evidence independently, separating reported results from verified evidence. Record per-requirement MATCH/PARTIAL/DEVIATION/UNVERIFIED/BLOCKED and closure gate CLOSED/WAIT_FOR_UAT/RETURN_TO_CODEX/BLOCKED. No closure solely because Codex states 'done' or automated tests passed: relevant UAT and human acceptance remain required. If META block is incomplete, missing or from the wrong task/revision, request correction; do not guess or silently close.

## 10. Návrat po implementaci

Po Codex handoffu nepovažuj změnu za ověřenou jen proto, že build prošel.

Rozlišuj:
- **implemented** – Codex změnil kód;
- **technically tested** – prošly automatické/build testy;
- **user-tested** – uživatel provedl scénář;
- **accepted** – výsledek odpovídá schválenému zadání.

Při uživatelském testu:
- rozpor s existujícím zadáním → `BUG_AGAINST_SPEC`;
- nový nápad nebo změna workflow → nejprve upravit specifikaci → `APPROVED_SPEC_CHANGE`;
- nejasnost → `REQUIREMENT_NOT_FOUND` a diskutovat před programováním.

## 11. Nezaměňovat dokumenty za stejné autority

Hlavní specifikace, změnový doplněk, ER model, README, handoff, kód a screenshot nejsou rovnocenné. Vždy explicitně popiš jejich roli a precedence. Pokud projekt už má vlastní pravidla autority, respektuj je a zapiš je do governance layer beze změny významu.

## Povinný výstup při nasazení metodiky

Podle rozsahu stručně zachyť:

1. režim: GREENFIELD / MID-CYCLE ADOPTION / CONTROLLED CHANGE;
2. autoritativní zdroje a precedence;
3. co se z Codex context layer vylučuje;
4. Git governance strukturu;
5. aktuální Git/working-tree rizika;
6. klasifikaci nejbližší změny;
7. testovací a akceptační postup;
8. nejbližší konkrétní krok;
9. u dlouhé práce continuity/handoff režim a quota thresholds.

Nevytvářej paralelní dokumentaci bez praktické role. Aktualizuj existující source of truth, pokud už existuje.

## Sebekontrola skillu

Při změně tohoto skillu:
- použij SemVer;
- zachovej Ladislava Goce jako autora, vlastníka masteru a odborného správce;
- eviduj změny v `CHANGELOG.md`;
- testuj minimálně greenfield, mid-cycle a controlled-change scénář;
- při mid-cycle testu ověř úplný `spec/current/` manifest, čitelnost všech souborů a správný `PASS/BLOCKED` gate;
- při continuity testu ověř, že jiná session/workspace umí pokračovat pouze z Gitu + handoff promptu bez původního chatu;
- při checkpoint-efficiency testu ověř, že continuation po validním checkpointu nečte mechanicky celou historii, ale zachová takeover verification, relevantní autoritu, cílené testy a závěrečné safety gates;
- ověř oddělený Codex META completion report, ruční přenos, rekonstrukci z META-only, porovnání vůči HUMAN DEFINITION a blokování uzavření bez evidence/UAT;
- nepřidávej konkrétní zákaznická data do masteru;
- používej `master-deployment` pro pravidla přenositelnosti, licencování a deploymentů.


## 12. Mandatory v0.3 semantic-gate deployment and measurement (since v1.6.0)

Keep all previous rules in §§1–11, including the full manifest, Git precedence, quota-aware continuation, mandatory independent v0.2 round trip, separate executor META report and evidence-based manager closure. The following additions strengthen, not replace, those requirements.

1. For a new formal behavior-changing task use `ai-meta-handoff` v0.4 as a version-pinned methodology dependency. **Do not silently switch protocol versions inside an active task.** Historical v0.2 evidence remains valid for its already-running work; newly admitted tasks must obtain the v0.4 gate (with unchanged v0.3 semantics).
2. Prepare approved HUMAN + canonical META with task ID, source revision, requirement IDs and acceptance criteria. Perform truly independent **META_ONLY** reconstruction with a separate worker; the manager compares it requirement-by-requirement to original HUMAN, including negative requirements. Never confuse independent reconstruction with self-review by the same agent.
3. Record review with `round_trip.gate: PASS/BLOCKED` and one research measurement event per attempt. Any material loss, extra behavior, unavailable independent worker, changed META/source or missing evidence means BLOCKED. If BLOCKED, no affected functional implementation starts. Continue only unrelated approved independent work.
4. Run the deterministic structural validator supplied with the versioned `ai-meta-handoff` mirror, e.g.: `python3 ai/skills/ai-meta-handoff/scripts/validate_handoff.py --bundle ai/handoffs/<TASK>/reviewed-bundle.json --task <TASK> --source-revision <REV>`. It verifies gate-record structure and payload binding only. A `STRUCTURAL_PASS` **does not** replace semantic approval; an AI-generated `PASS` string alone is insufficient proof of independence or correctness.
5. Codex's `AGENTS.md` must require preflight before code changes; optional protected-branch CI must run it again before merge. Preflight in an ordinary Codex instruction is a *procedural* gate; only a guarded launcher or enforced CI/branch policy provides an independent technical barrier. Do not claim local enforcement if these protections are absent.
6. Keep the existing `EXECUTOR_TO_ORCHESTRATOR` completion report and manager-side META-only reconstruction + HUMAN comparison and separate code/test/UAT verification. Never let executor self-close. Return status `WAIT_FOR_UAT`, `RETURN_TO_CODEX`, or `BLOCKED` when appropriate.
7. Store attempt-level measurements and defect taxonomy according to `ai-meta-handoff/references/measurement.md`; keep observed metrics separate from not-available data. Controlled comparison with ordinary handoffs is required before quantitative claims of superiority. Do not optimize for tokens alone or introduce AI-native syntax (phase B) before phase A validation.
8. For a strictly nonbehavioral, low-risk mechanical task, a *documented narrowly scoped* exemption may follow existing §9a, with clear rationale and evidence. It is never allowed for a formal functional feature, destructive action or spec change.
9. Treat this methodology as a portable `master-deployment` product. Maintain version/pin, tests, license, source of truth and anonymous cross-project learnings in the master; actual task content and client secrets stay in their deployments. Change the methodology mirror in a separate governance commit; avoid altering the running MEMALA task during adoption.

See `references/semantic-gate-deployment.md` for template, rollout and example safety tests.


## 13. Risk-based proportional delivery and approved UI Design Freeze (since v1.7.0)

Use `references/risk-ux-contract.md` for the binding L1/L2/L3 impact classification, tier-scaled tests, UI Design Master / Design Freeze, and documented L1 mechanical exemption. Keep §12 mandatory semantic gate for every formal behavior-changing task. Do not retroactively reclassify already completed work or silently repin in-flight tasks.


## 14. Pilot Rapid UAT – volitelný režim (since v1.8.0)

Pro explicitně schválený pilotní projekt používej volitelný režim **Rapid UAT** popsaný v `references/pilot-rapid-uat.md`. Cílem je zkrátit iterace, které uživatel stejně ověřuje na skutečném workflow. U čistě vizuálních L1 změn není samostatná syntetická databáze ani rozsáhlý syntetický scénář výchozím požadavkem; obvykle stačí build, scoped commit, bezpečný app-only deployment a skutečný UAT. U změn ukládání, autorizace, destruktivních operací nebo migrací zachovej odpovídající izolované kontroly bez ohledu na malý počet řádků. Režim nesnižuje ochranu živých dat, Git/rollback povinnosti ani formální sémantické brány z §12; skutečný UAT nikdy nevydávej za ekvivalent transakčního testu.


## 15. Pilot Rapid Delivery + UI Freeze + lean handoff (since v1.9.0)

Pro schválené piloty používej pravidla v `references/rapid-delivery-handoff.md`. Jejich účelem je **skutečně zkrátit celý cyklus**, nejen syntetické testy:

- Rozliš `RAPID_OPERATIONAL` pro mechanické L1 a úzce ohraničené L1 úpravy prezentace/interakce bez změny API, persistence, autorizace nebo pracovních stavů; `FORMAL_CONTROLLED` pro L2/L3 a komplexní či nejasné změny. Zařazení nikdy neurčuj pouze podle malého diffu.
- V `RAPID_OPERATIONAL` použij stručný HUMAN kontrakt v zadání, změnový diff, kompilaci/komponentní smoke, scoped commit, app-only deploy a vlastníkem provedený UAT. Nepouštěj syntetickou databázi ani formalizovanou nezávislou META-only rekonstrukci; režim musí být výslovně schválen a vymezen, nesmí být vydáván za úspěšně provedený formal gate.
- `FORMAL_CONTROLLED` používá stávající plné v0.4 formal gate a cílené kontroly podle rizika. Pilotní režim není výjimkou pro významové změny obchodních procesů, ukládání, práv, databáze či integrovaných služeb.
- Každý UI zásah musí zachovat projektový schválený Design Freeze: vycházet z existujících komponent a stylů, nepřidávat nové vizuální idiomy; případnou odchylku vyžádat schválení. Výchozí UI se nesmí považovat za požadavkový zdroj mimo schválený designový kontrakt.
- Handoff a report v Rapid režimu se řídí `ai-meta-handoff` operational profile, pokud je dostupný. **Povinně vrať dvě samostatné části závěrečné odpovědi:** stručný HUMAN report a samostatný **úplný kopírovatelný fenced YAML blok `CODEX IMPLEMENTATION META REPORT` (`EXECUTOR_TO_ORCHESTRATOR`)**, s minimálně task ID, impact/profile, skutečným výsledkem, změněnými soubory, testy, Git refs, deploy revizí, UAT, blockers, `manager_review_status: NOT_REVIEWED` a `manual_transfer_required: true`. V Rapid režimu je META stručnější, **nikdy však volitelná**, nelze ji nahradit pouze odkazem na JSON/YAML soubor ani HUMAN summary. Nevyžaduj nezávislý formal META-only round-trip pro oprávněný L1 Rapid; neuváděj falešný gate PASS. Neopisuj původní specifikace ani staré reporty.
- Na každém zahájení Codex session ověř dostupnost a verze skutečných souborů metodických skillů (nativní nebo `ai/skills/` v repozitáři). `AGENTS.md` má přikazovat jejich načtení. Není-li relevantní skill dostupný, nepředstírej načtení ani nevymýšlej jeho obsah; vyžádej úplný zdroj.
- Při dostupnosti kvóty používej 20 % / 10 % checkpoint prahy; je-li kvóta nedostupná, výslovně ji označ `NOT_AVAILABLE` a checkpoint před delší prací ukládej bez odhadování. Nikdy neslibuj, že Codex vidí stav kreditů.

Tato volitelná provozní cesta **nemění** wire protokol formálních handoffů ani nevyjímá formální úkoly z bezpečnostních bran. Rozhodnutí, proč task splnil podmínky lehkého režimu, musí být dohledatelné.


## 16. Foundation Gate, jednotný design a životní cyklus dat (od v1.10.0)

Závazně používej `references/foundation-lifecycle.md` při **každém** GREENFIELD zahájení aplikace a při následných CONTROLLED CHANGE/MID-CYCLE úkolech, které přidávají UI, persistentní či dočasné datové objekty, fronty, exporty, logy nebo soubory. Jde o pravidla **metodiky**, nikoli o novou autoritu nad schválenou produktovou specifikací.

- **Design System First:** Po schválení koncepce a před první produkční funkční obrazovkou založ schválený, verzovaný application-wide Design Foundation: design tokeny/barvy/typografii/rozestupy/breakpointy, společné komponenty, styly, layout a navigační kontrakt, accessibility a responzivitu. Vizuální rozhodnutí a scope schvaluje vlastník. Žádné nové stránky nesmějí samovolně vytvářet paralelní systém CSS, barvy nebo komponenty.
- **Frozen Design by default:** Schválený základ je závazný i bez opakování v každém promptu. Lokální UI změny pouze znovu používají společný systém. Globální změny designu vyžadují výslovný souhlas, aktualizaci verzovaného designového kontraktu a přiměřenou regresi dotčených obrazovek; povolené lokální výjimky zdokumentuj. Freeze neznamená zákaz schváleného vývoje designu.
- **Data Lifecycle by Design (princip života a smrti):** Před přidáním jakýchkoliv dat definuj účel, vlastníka/tenanta, rozsah a typ, dobu uchování nebo událost zániku, vazby a ochrany, mechanismus cleanupu a důkaz funkčnosti. Bez výslovně zdůvodněné výjimky nepřipouštěj bezbřehé hromadění technických dat, logů, cache, blobů, souborů, exportů, front, auditů a jejich kopií. Zohledni backupy, replicas, skutečné uvolnění místa i zásady minimalizace dat.
- **Retence není odhad:** Konkrétní lhůty odvozuj ze schválené specifikace, provozní potřeby a aplikovatelných povinností; **30 dní není celoprojektová univerzální doba**. Neodstraňuj účetní či právně chráněné záznamy, nevyřešené operace, nezbytné anti-duplicate identifikátory ani data pod retention hold; nevyžaduj však dlouhodobý archiv bez definované hodnoty.
- **Foundation/Change Gate:** Bez schváleného designového základu (u UI aplikace) nebo dokončené lifecycle klasifikace příslušných nových dat označ zasaženou implementaci `BLOCKED / FOUNDATION_INCOMPLETE`. U mid-cycle projektu nejprve proveď audit a zaveď chybějící základy bez automatického redesignu, destruktivního cleanupu či migrace.
- **Handoff a testování:** Každé zadání Codexu přenáší odkazy na verzovaný designový kontrakt i lifecycle manifest pro dotčené entity; acceptance kontroluje vizuální konzistenci, retenční hranice, bezpečné výjimky a skutečně fungující úklid. Ponech všechna dřívější pravidla Git/spec precedence, bezpečnosti, risk-tier, semantic gate, UAT, pilotních výjimek i nezávislého schvalování.


## 17. Outcome Assurance + Interruption-Safe Execution (v1.11.0)

Read `references/outcome-and-recoverability.md` whenever preparing an executor task, performing a Codex handoff, planning a destructive/deployment operation, or resuming work after an unexpected quota/tool interruption. This section strengthens, not replaces, §§1–16, the current source-of-truth rules, AI Meta Handoff gates, protection of data and owner UAT. Do not retroactively reinterpret task-pinned protocols.

**A. Before execution: outcome admission.** Record a concise HUMAN outcome contract: user-observable finish line, authoritative source and verified target, acceptance tests, protected invariants, primary path, any explicitly owner-approved safe fallback, and stop conditions. Check *feasibility and contradictions before spending an execution cycle*. The executor must not be tasked with an impossible combination such as deleting all records while preserving some legally protected originals. When a fallback is not approved, mark `BLOCKED` rather than granting implicit permission. Distinguish implementation, deployment and owner acceptance. An executor report cannot substitute for the owner's requested result.

**B. Before work: continuity contract.** At task admission put the task/revision, current phase, verified Git state and next safe action in the existing `dev/CODEX_HANDOFF.md`; keep it current-state-first. Save a recoverable pre-operation checkpoint before each significant long-running, costly or irreversible block and refresh after each coherent block. Continue honoring known 20%/10% quota thresholds, but when quota is `NOT_AVAILABLE`, assume an abrupt stop can occur at any call. Never leave continuity dependent on a *final* assistant response.

**C. Independent checkpoint mechanism.** The portable `scripts/recovery_checkpoint.py` can atomically save private Git-state manifests under `.git/application-development/`. It does not stage/commit/modify work or capture business file contents. This is an optional local tool, not an installed watchdog. A separately approved and tested local scheduler/launcher must invoke it independently of Codex for a claim of `EXTERNAL_CHECKPOINT_ACTIVE`. A script present on disk is **not** evidence of active protection. A Git manifest and `dev/CODEX_HANDOFF.md` carry complementary roles: machine-observable state versus semantic task intent. Neither alone proves external side effects were completed.

**D. Receiving-session protocol.** When Codex stops without a handoff, a new Codex must verify the active spec, task intent, Git HEAD/dirty/staging/untracked and running operations. Inspect saved checkpoint if available; stale/missing checkpoint requires recovery, not reset. Reconcile in-flight edits and external operations safely, preserve unrelated work, update the handoff and continue from the smallest safe action. The owner must not need access to the exhausted session to generate a new prompt. Do not claim zero-loss or guaranteed exactly-once behavior for abruptly stopped external operations.

**E. Tests and installation.** Run `scripts/test_recovery_checkpoint.py`, an interruption simulation with a new Codex session, an outcome-conflict test and a separately verified local scheduler trial. Use `references/rollout-verification.md` to update the author deployment and Codex mirror, prove real Skill loading/version/hash and mark `VERIFIED` only after evidence. Preserve 1.10.1 as rollback and keep in-flight project work pinned to its existing method until a controlled upgrade.

**F. Minimal overhead.** Do not build another report bureaucracy: reuse the one active handoff, existing Git and meaningful test evidence. Use local deterministic snapshots instead of repeated AI summaries; preserve all formal L2/L3/retention and semantic gates where applicable.


## 18. Pilot RAPID_FUNCTIONAL – závazné upřesnění od v1.12.0

U projektů s výslovně schváleným vývojovým režimem (MEMALA je kandidát po promítnutí do Git governance) povol nový profil **RAPID_FUNCTIONAL**. Před přijetím úkolu čti `references/rapid-functional-development.md`. Tento profil je alternativní větev k pravidlům v §§9–17, nikoli jejich administrativní nadstavba. Pro jeho úzce vymezené nízkorizikové opravy výslovně **není** vyžadována povinná nezávislá META-only rekonstrukce, structurální validátor, dvojitý HUMAN/META report, full-manifest scan v každé relaci, nové formální approval po každém buildu/deployi ani opakované checkpointování beze změny rizika. Jeden lidský outcome kontrakt a krátký Git/UAT report stačí. Formální kontroly pokračují pro `FORMAL_CONTROLLED` úlohy; chráněná data, spec precedence a autentizace se nikdy nepovažují za vypnuté. Konfliktní starší bezpodmínečné formulace §§9a, 9b, 12–17 mají v tomto explicitně zvoleném profilu přednostně nahrazený pouze uvedený procesní rozsah.


## 19. HUMAN + META bez automatické byrokracie (v1.13.0)

Tato sekce má přednost před staršími bezpodmínečnými formulacemi v §§9–18, pokud svazují samotnou přítomnost META se schvalováním nebo naopak pro Rapid META zakazují. **Přesnost předání a míra kontrol jsou dvě nezávislé dimenze.**

- Pro zadávání mezi řídicí AI a Codexem používej **jediný společný HUMAN + META handoff** také v `RAPID_UI`/`RAPID_OPERATIONAL` a `RAPID_FUNCTIONAL`. META je stručné zpřesnění cílů, scope, zákazů, zachovávaných invariantů a akceptace, nikoli nové povolení či další proces.
- Nevyžaduj automaticky nezávislou META-only rekonstrukci, strukturální validator, nové approval, plný manifest audit ani vícenásobné reporty jen kvůli tomu, že byl připojen META YAML.
- `RAPID_*`: cílený test podle změněné funkce, commit/deploy a **jeden stručný HUMAN + META výsledek** (status, relevantní checks, commit, runtime, UAT, blocker). Výslovně nahrazuje v Rapid staré pravidlo „pouze HUMAN report“, aniž by obnovovalo formální gate.
- `FORMAL_CONTROLLED`: zachovej nezbytné nezávislé bezpečnostní kontroly pro opravdu rizikové hranice (chráněná data, identita, tenant, destruktivní DB, produkce). Formal gate a audit uplatni v rozsahu skutečného rizika a aktivního protocol pinu, ne automaticky na všechny neohrožené části práce. Neopakuj platné dokončené kroky bez změny podkladů.
- **HUMAN zůstává autoritativní; META pouze strojově zpřesňuje.** Nesoulad META/HUMAN oprav v návrhu, ale nevytvářej z něj další produktové schvalovací kolo, pokud je vůle vlastníka jednoznačná.
- Použij `ai-meta-handoff` v0.7.0 a jeho `references/precision-without-bureaucracy.md`. Záznam aktuálně běžících úkolů neměň retroaktivně bez souhlasu vlastníka; nové zadání může explicitně převzít aktualizovaný komunikační standard, přičemž bezpečnostní invarianty zůstávají.
