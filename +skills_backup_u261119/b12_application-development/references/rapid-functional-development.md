# RAPID_FUNCTIONAL – schválený experimentální vývojový profil (v1.12)

## Rozsah a rozhodnutí
Aktivuje se **výslovným trvalým opt-in vlastníka projektu** v Git governance (např. `AGENTS.md`/`spec/README.md`), s označením development runtime a testovacích dat. Projektové specifikace zůstávají autoritativní. Pokud je projekt v aktivním autorově vývoji jako MEMALA, lze v tomto profilu provádět běžné opravy již schváleného chování také při změnách extrakční logiky, workeru, transformací, UI, API nebo dat v existujícím schématu – za níže uvedených podmínek.

### Admisní podmínky
- Úkol se týká konkrétního schváleného chování nebo vlastník právě schválil jeho změnu; nový význam se zapíše do příslušné projektové specifikace nejpozději před dokončením změny.
- Dotčený provoz je prokazatelně `DEVELOPMENT`, nikoliv produkce, a skutečný rozsah práv a dat je známý.
- Nedochází ke změně autentizace, autorizace, tenant izolace, právně významného retention/auditu, změně účetních či daňových významů, nevratné manipulaci s chráněnými daty ani k nekontrolované nové migraci.
- Oprava je ohraničená a má konkrétní ověřitelný výsledek. Nejasná hranice nebo nový bezpečnostní dopad přepíná **jen dotčený blok** do `FORMAL_CONTROLLED`.

### Pracovní smyčka
1. Jednou na zahájení ověř relevantní `AGENTS.md`, aktivní zadání/specifikaci a Git root/branch/HEAD/dirty; převezmi validní checkpoint bez opakovaného čtení celé historie.
2. Zachyť do 5–12 řádků lidský kontrakt: cíl, dotčené plochy, zakázané zásahy, cílové development prostředí, test/owner UAT. Nepožaduj druhé schválení stejného kontraktu.
3. Proveď autonomně implementaci. Oprav běžné technické překážky v rámci scope (např. zastaralý cleanup manifest). Nestav umělé brány ani duplicity reportů.
4. Spusť cílený build a nejmenší relevantní unit/integration/negative test pro změněnou datovou cestu; zachovej verifikaci skutečně dotčené tenant/data hranice. Nepouštěj kompletní repository suite bez věcného důvodu.
5. Commituj koherentní změnu; nasaď schválenou app-only revizi na určený Development, zkontroluj running revision a základní health; předej vlastníkovi UAT.
6. Výstup = **jediný krátký HUMAN report**, zahrnující task, actual diff/commit, targeted tests, deploy target/rev, UAT a případný skutečný blok. META YAML, nezávislá META-only rekonstrukce, validator a pokusová metrika nejsou pro tento profil vyžadovány ani vykazovány jako PASS. Git handoff udržuj pouze, pokud je potřeba mezirelační kontinuita.

### Testovací data
Vlastníkem schválené identifikované testovací importy v určené development DB jsou spotřební prostředek. Existující scoped cleanup je preferovaný; jeho automatické recovery kopie jsou povolené. Nevyžaduj dodatečný export ani dodatečné potvrzení. Před odstraněním ověř klientské IDs, tabulkové vztahy, pracovní stavy a že nejde o jiné/chráněné doklady. Je-li manifest zastaralý, oprav ho pro skutečné dotčené tabulky, s úzce cíleným dry-run/count a referenční kontrolou; žádné přímé SQL jako bypass ani globální reset. Pokud rozsah nelze prokázat, zastav **jen mazání**, ostatní opravy pokračují.

### Rozsah předem povolených operací
Editace kódu, cílené testy, build, interní restart workeru, běžná cleanup laboratorní AI audit tabulky a schválený app-only deploy do označeného Development, scoped odstranění schváleného testovacího korpusu – bez dalšího potvrzování. Nikdy to nezahrnuje produkci, cizí tenanty, tajemství, překročení poskytovatelských cenových limitů či globální destruktivní DB akce.

### Kdy je nutný FORMAL_CONTROLLED
Nová nebo změněná obchodní/účetní sémantika mimo schválené zadání, DB migrace/multitenancy/auth, nový external side effect s materiálními náklady, odstranění skutečných účetních dat, zásah do produkce, široká nebo neověřitelná operace, nebo konflikt autoritativních požadavků.

### Stávající pravidla
Tento profil **výslovně nahrazuje** starší univerzální požadavky na formální sémantickou bránu a povinný META completion report *pouze pro úkoly klasifikované RAPID_FUNCTIONAL*. `RAPID_OPERATIONAL` zůstává pro mechanické UI; `FORMAL_CONTROLLED` pro zbytek. Zachovej aktivní protocol pin již běžících úkolů, dokud jej vlastník výslovně nepřepne; nikdy nepředstírej PASS formálního gate.


## v1.13 override — HUMAN + META as a communication aid

Replace the older 'one HUMAN contract/report, no META' wording for developer AI handoffs with **one compact HUMAN + META request and one compact HUMAN + META result**, without formal META validation, independent workers or extra approval steps. This format does not change RAPID_FUNCTIONAL admission limits or risk-scaled tests. `ai-meta-handoff` v0.7 `references/precision-without-bureaucracy.md` supplies the short schema.
