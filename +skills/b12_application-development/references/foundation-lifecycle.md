# Foundation Gate: Design System First + Data Lifecycle by Design (v1.10.0)

## Authority and stage boundaries

Tento kontrakt je **povinná metodika**, nikoliv produktová specifikace. Funkční požadavky a legitimní retenční povinnosti určuje schválený projektový zdroj (`spec/current/` nebo ekvivalent). Nepřepisuj specifikaci pomocí metodiky, starého kódu ani screenshotu. Neprováděj globální změny za provozu bez autorizace, odpovídajícího risk tier a ověřeného rollbacku.

**Greenfield pořadí:** schválená koncepce → funkční/datový koncept → Application Foundation → Foundation Gate `PASS` → první funkční UI implementace → controlled change. Projekt bez UI nemusí vytvářet CSS; důvod `NOT_APPLICABLE` zdokumentuj. Technický prototyp před schválenou Foundation lze použít jako zahoditelný průzkum, nikdy ne jako nepřiznaný produkční designový základ.

## A. Design System First

Před první produkční obrazovkou vytvoř a nech schválit verzovaný **Design Foundation Contract** zahrnující:

1. Názvy a umístění společných zdrojů: design tokeny (barvy, typography, spacing, radii, borders, state indicators), theme/light-dark podle zadání a breakpoints.
2. Základní společné layouty, navigaci, typografickou hierarchii, tabulky, formuláře, tlačítka, dialogy, inputy, upozornění, stavy loading/empty/error a dostupnost (focus/keyboard/contrast).
3. CSS/style ownership: kde se smějí přidávat globální tokeny a komponenty; pravidlo zákazu page-specific duplikace bez schválené výjimky; technologii přiměřenou zvolenému stacku (nemusí jít o jediný fyzický CSS soubor).
4. Owner sign-off, verzi/revizi, rozsah Freeze, referenční pohledy, povolené výjimky a schválené metody změny.

**Gate PASS** jen s dosažitelným kontraktem v Git a základními použitelnými komponentami. UI change preflight musí citovat konkrétní shared tokens/components a vysvětlit, zda jde o reuse, approved system change nebo approved exception. Globální vizuální změny proveď centrálně a s cílenou regresí všech dotčených component/layout families, ne sérií page-level patchů. Komponentní testy a reprezentativní screenshoty jsou evidence; owner UAT je samostatný acceptance krok.

## B. Data Lifecycle by Design: principiální život a smrt

Při každé nové tabulce, sloupci s akumulující historií, objektovém úložišti, blobu, příloze, cache, logu, exportu, souboru, frontě, AI artefaktu či jejich kopii založ **Lifecycle Manifest**:

| Pole | Otázka |
|---|---|
| `object` / `storage` | Co se ukládá a kde, včetně kopií / indexů? |
| `purpose` | Která schválená funkce/provozní potřeba to vyžaduje? |
| `owner_scope` | Kdo vlastní data a jaká tenant izolace platí? |
| `created_by` / `terminal_state` | Kdy vznikají a kdy přestanou být aktivní? |
| `retention_rule` / `start_event` | Jak dlouho od které měřitelné události? |
| `delete_or_anonymize` | Jak, kde a jak často se uklidí? |
| `holds_dependencies` | Právní/účetní hold, aktivní operace, integrity, idempotence? |
| `copies_and_backups` | Kdy expirují kopie a backupy podle schválené politiky? |
| `evidence_monitoring` | Jak ověřit funkci cleanupu a nárůst objemu? |

**Retenční pravidla podle druhu, ne jediné konstanty:** obchodní/účetní zdroje podle schválených a právních pravidel; aktivní konfigurace po dobu potřeby; dokončená diagnostická/provozní data krátce, pokud nejsou chráněna konkrétním důvodem. Aplikace může mít projektově schválenou lhůtu 30 dní pro uzavřené reminder delivery záznamy; **nesmí ji bez schválení automaticky použít na jiné entity**.

**Bezpečnost cleanupu:** úklid je idempotentní, dávkovaný, restartovatelný, tenant-safe, pozorovatelný, testovaný na hranicích a neodstraňuje data aktivních/UNCERTAIN/PENDING operací ani minimální dedup metadata dříve, než skončí jejich prokazatelná ochranná doba. Nezakládej duplicitní archiv mailového obsahu, pokud jej nevyžaduje schválený produktový účel; technická evidence je jiná kategorie. Skutečný mail provider nemusí uchovávat SMTP odeslání ve složce Sent, ověř integration-specific behavior.

Smazání řádku se nerovná okamžitému fyzickému uvolnění místa; plánuj údržbu DB, bloby, soubory, tmp copies, cache, log rotation, indexy a lifecycle backupů podle použité platformy. Provedení cleanupu na existujících uživatelských datech je **destruktivní operace** s odděleným schválením a rollback/recovery, ne automatický důsledek přidání tohoto Skill pravidla.

## C. Ověřovací checklist a přenos do Codexu

**GREENFIELD:** existence a owner approval Design Foundation před prvním produkčním UI; reuse pro dvě různé stránky; lifecycle manifest pro typovou DB entitu, dočasný soubor a job; explicitní výjimky pro protected records; `FOUNDATION_GATE: PASS/BLOCKED`.

**MID-CYCLE:** audit existující design token/component contract a existujících datových kategorií; seznam mezer; bezpečný doplňkový plán bez redesignu či automatického mazání; complete `spec/current/` manifest gate zůstává nedotčen.

**CONTROLLED CHANGE:** nové UI zdůvodňuje reuse existujících tokenů; změna tématu se schvaluje jako projektová global design revize, ne lokální hack; nová queue/log má retention+hold+cleanup test; již běžící task neprochází tichým repinem metodiky.

**Průkazné testy:** automatický check existence design kontraktu a lifecycle manifestu; UI testy sdílených komponent a relevantních viewportů; TTL boundary, retries, active hold, idempotence, no duplicate, tenant isolation, DB+file cleanup integrity a monitoring pro konkrétní technologie. Evidence rozlišuje `PASS`, `NOT_RUN`, `UNVERIFIED`; owner acceptance není odvozena z build pass.

**Codex handoff fields:** `methodology_revision`, `design_contract_ref + revision + freeze_scope` nebo `NOT_APPLICABLE`, `lifecycle_manifest_ref + affected_objects` nebo `NO_NEW_DATA`, `foundation_gate`, `exception_approvals`, `tests`, `owner_uat`. Odkazuj na projektové soubory, nezaváděj duplicitní zákaznickou specifikaci do masteru.
