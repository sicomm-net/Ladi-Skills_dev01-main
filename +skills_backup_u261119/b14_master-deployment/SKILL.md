---
name: master-deployment
description: Navrhuj, vyvíjej, dokumentuj, testuj a aktualizuj přenositelné a licencovatelné AI produkty podle architektury Master → Deployment. Používej při tvorbě nebo podstatné změně skillu, GPT, agenta, automatizace či jiného opakovaně nasaditelného AI řešení, zejména když uživatel zmiňuje master, zákaznickou instanci, deployment, licenci, autorství, přenos k zákazníkovi, opakované nasazení, verzování, aktualizace nebo využití řešení pro více zákazníků. Používej také tehdy, když Ladislav Goc vyvíjí nový AI produkt pro vlastní použití; vlastní použití považuj za licencovaný deployment autora. Skill je soukromým vývojovým standardem autora a není určen k automatickému řízení práce zákazníků.
---

# Master–Deployment

## Verze a správa

Aktuální verze skillu je **1.4.0**.

Používej SemVer:

- **PATCH** – oprava bez změny očekávaného chování.
- **MINOR** – nová zpětně kompatibilní schopnost nebo pravidlo.
- **MAJOR** – změna architektury, odpovědností nebo kompatibility.

**Autor, vlastník masteru a odborný správce:** Ladislav Goc  
Copyright © 2026 Ladislav Goc. Všechna práva vyhrazena.

Tento skill je masterem a jeho instalace u autora je licencovaným vývojovým deploymentem autora. Každý další deployment vyžaduje samostatné oprávnění autora. Oficiální změny a aktualizace provádí autor. Neupravenou zákaznickou instanci technicky vlastní zákazník, pokud deployment dokumentace nebo smlouva nestanoví jinak; autorství obecné logiky tím nepřechází.

## Účel

Vytvářej AI řešení jako spravovatelné produkty, nikoli jako jednorázové konverzační konfigurace. Odděluj stabilní, opakovaně použitelný master od každého konkrétního deploymentu. Zachovej přenositelnost, autorství, licencovatelnost, kontrolované aktualizace, ochranu zákaznických dat a možnost zobecňovat zkušenosti do dalších verzí masteru.

Uplatňuj tento skill společně s odbornými a realizačními skilly. Nenahrazuj jím doménovou správnost, technickou dokumentaci použité platformy ani právní posouzení licenční smlouvy.

## Základní model

Každý produkt považuj od počátku za licencovatelný:

```text
MASTER
  ├── licence autora → vývojový deployment autora
  ├── licence → deployment zákazníka A
  └── licence → deployment zákazníka B
```

Rozlišuj:

- **Master** – obecná logika, workflow, datový model, pravidla, šablony, testy, konfigurační model a deployment postup.
- **Deployment** – konkrétní instalace masteru pro držitele licence.
- **Zákaznická konfigurace** – údaje, volby, integrace, oprávnění a odchylky platné jen pro daný deployment.
- **Zákaznická instance** – technická realizace deploymentu v prostředí zákazníka.
- **Zpětné zobecnění** – anonymizované, obecně použitelné poučení zapracované do nové verze masteru.

Vlastní použití autora nepovažuj za výjimku. Eviduj autora současně jako držitele licence a označ deployment například jako `author-development`.

## Povinný pracovní postup

### 1. Určit produkt a fázi

Nejprve určit účel a uživatele produktu, jeho typ, fázi, očekávanou míru autonomie, lidské kontrolní body, hranice aktuální verze a odložené funkce.

Rozlišovat fáze: záměr, experiment, prototyp, master ve vývoji, pilot, produkční deployment a aktualizace. U experimentu nevynucovat kompletní produkční dokumentaci, ale zaznamenat, co musí být doplněno před pilotem. U zákaznického pilotu nebo produkčního deploymentu uplatnit celý standard.

### 2. Vymezit master

Do masteru zahrnout pouze stabilní a opakovaně použitelné prvky:

- procesní a rozhodovací logiku;
- datový a stavový model;
- obecná pravidla a bezpečnostní hranice;
- vstupní a výstupní schémata;
- univerzální šablony a konfigurační rozhraní;
- testovací scénáře a očekávané výsledky;
- instalační a aktualizační postup.

Neukládat do masteru zákaznické doklady, osobní údaje, přístupové údaje, identifikovatelné konverzace ani konfiguraci konkrétního zákazníka.

### 3. Vymezit deployment

Pro každý deployment určit minimálně:

- držitele licence a technického vlastníka instance;
- oprávněné uživatele, editory a správce;
- verzi masteru a revizi deploymentu;
- zákaznickou konfiguraci a schválené odchylky;
- prostředí, integrace a potřebná oprávnění;
- rozsah podpory, aktualizací a údržby;
- testovací a akceptační stav;
- postup návratu k předchozí ověřené verzi;
- podmínky ukončení nebo předání správy.

### 4. Oddělit vlastnictví a autorství

Vždy samostatně uvádět autora a vlastníka masteru, držitele licence, technického vlastníka zákaznické instance, vlastníka zákaznických dat, odborného správce a osoby oprávněné provádět změny.

Nevydávat technické vlastnictví instance za převod autorství masteru. Nevydávat obecný licenční rámec skillu za úplné právní posouzení konkrétní smlouvy.

### 5. Verzovat

Verzovat master podle SemVer. Zákaznický deployment označovat tak, aby bylo zřejmé, z jaké verze masteru vychází, například `1.2.0-CUSTOMER01.3`.

Evidovat verzi masteru, revizi deploymentu, datum a autora změny, důvod a rozsah změny, kompatibilitu, provedené testy, stav nasazení a možnost návratu. Nepoužívat historii chatu jako jediný změnový záznam.

### 6. Udržovat zdroj pravdy

Nepovažovat konfiguraci v uživatelském rozhraní GPT, agenta nebo skillu za jediný zdroj produktu. Udržovat reprodukovatelný master balíček přiměřený typu produktu, typicky obsahující:

- hlavní instrukce nebo zdrojové soubory;
- workflow, datový model a konfigurační schéma;
- testy a očekávané výsledky;
- deployment a akceptační checklist;
- autorství a licenční informace;
- záznam verzí a změn.

Nevytvářet dokumenty bez praktické role. Přizpůsobit názvy a formáty platformě a složitosti produktu.

### 6a. Rozlišovat kontext, paměť a řízené učení

Nevydávat práci s kontextem aktuální relace za trvalé učení produktu. Rozlišovat:

- dočasný stav jedné relace nebo dávky;
- sdílenou deploymentovou konfiguraci a registry;
- schválený zákaznický precedent;
- obecnou změnu nové verze masteru.

Nezavádět ukládání precedentů, adaptivních pravidel ani jiné chování přenášené mezi uživateli nebo relacemi, dokud deployment nemá společné úložiště dostupné oprávněným uživatelům, určeného vlastníka dat, řízení oprávnění, audit změn, verzování a schvalovací postup.

Do té doby používat rozhodnutí pouze v rozsahu aktuální relace nebo dávky a případnou budoucí persistenci evidovat jako odloženou funkci. Nepředstírat sdílení ani trvalou paměť, které technické prostředí neposkytuje.

Po zavedení sdíleného úložiště ukládat nové pravidlo pouze řízeným postupem: návrh → odborné schválení → zápis do sdíleného registru → verze a audit → použití v dalších případech. Rozlišovat pravidlo klienta, pravidlo organizace a zobecnění vhodné do masteru; zákaznický precedent nepřenášet do jiného deploymentu.

### 7. Testovat po vrstvách

Rozdělit ověření na:

1. test masteru na anonymizovaných nebo vlastních datech;
2. test zákaznické konfigurace;
3. pilot v bezpečném nebo virtuálním prostředí;
4. akceptaci zákazníkem;
5. produkční nasazení;
6. následné sledování a ladění.

Definovat předem měřitelné podmínky úspěchu, chybové případy, lidské schvalovací body a zakázané akce. Neoznačit deployment za ověřený bez odpovídajících testů.

### 8. Řídit změny a aktualizace

U každé změny určit, zda jde o opravu pouze jednoho deploymentu, novou zákaznickou odchylku, obecné zlepšení vhodné do masteru nebo bezpečnostní či kompatibilitní změnu vyžadující aktualizaci více deploymentů.

Nejdříve zobecnit a anonymizovat vhodné poučení, poté je zapracovat do nové verze masteru a otestovat. Až následně je nasazovat do zákaznických instancí. Neměnit všechny deploymenty automaticky bez posouzení kompatibility a oprávnění.

### 9. Chránit data a know-how

Do masteru nebo jiného deploymentu nepřenášet bez výslovného oprávnění:

- zákaznická data a dokumenty;
- osobní nebo identifikační údaje;
- seznamy klientů, dodavatelů nebo zaměstnanců;
- přístupové údaje a tajné hodnoty;
- interní konfiguraci a zákaznické know-how;
- identifikovatelné příklady, konverzace nebo výsledky.

Přenášet pouze zobecněná pravidla, anonymizované chybové scénáře a obecně použitelné zlepšení. Pokud nelze informace bezpečně zobecnit, ponechat je pouze v příslušném deploymentu.

### 10. Připravit předání

Před zákaznickým pilotem nebo produkčním nasazením potvrdit úplnost deployment balíčku, vlastnictví a oprávnění, držitele licence, oddělení dat, verzi a kompatibilitu, testy a akceptaci, lidské kontrolní body, aktualizační a návratový postup a odpovědnost za podporu.

## Rozhodovací pravidla

- Preferovat jeden konfigurovatelný master před samostatnými kopiemi obecné logiky.
- Připustit zákaznickou odchylku pouze tehdy, když ji nelze bezpečně vyřešit konfigurací nebo změnou masteru.
- Nezvětšovat produkt o budoucí automatizaci, která není potřebná pro aktuální ověřovaný krok.
- Zachovat člověka ve schvalovacím bodě, pokud je výsledek odborně, finančně, právně nebo provozně významný.
- Rozlišovat připravený podklad, testovaný výsledek, nasazenou změnu a ověřený provoz.
- Nevracet zákaznickou opravu do masteru mechanickým kopírováním.
- Zachovat možnost reprodukovat konkrétní deployment z evidované verze masteru a konfigurace.
- Nezaměňovat kontext relace za trvalé učení; persistenci pravidel aktivovat až po zavedení řízeného sdíleného úložiště.

## Uživatelské rozhraní a interní model

Při návrhu aplikace, Site, GPT, agenta nebo jiného uživatelského rozhraní důsledně oddělovat interní datový a stavový model od textů určených uživateli:

- zachovat stabilní interní kódy pro automatizaci, audit, diagnostiku, export a integrace;
- běžnému uživateli nezobrazovat názvy proměnných, enumů, stavových kódů, technická ID ani serializovaná data, pokud je výslovně nepotřebuje k diagnostice;
- každý viditelný stav převést přes centrální mapování na lidský název, stručné vysvětlení a konkrétní další krok v jazyce uživatele;
- neskládat uživatelské hlášení přímým spojením interního kódu a běžného textu;
- technické hodnoty zpřístupnit pouze v jasně označeném auditu nebo diagnostickém režimu;
- odlišovat datovou chybu, odbornou kontrolu, neblokující varování, probíhající operaci a dokončený stav také vizuálně a procesně;
- hromadný stav zobrazit jednou za dávku, pokud nevyžaduje odlišnou akci u jednotlivých položek;
- do akceptačních testů zahrnout kontrolu, že běžná obrazovka neobsahuje nepřeložené interní kódy a že každé hlášení sděluje uživateli proveditelný další krok.

Interní kód nikdy neodstraňovat jen kvůli prezentaci. Opravit prezentační vrstvu; auditní a integrační význam zachovat.

### Uživatelský záměr a stavové přechody

Navrhovat ovládání podle cíle uživatele, nikoli podle interních kroků systému:

- pro běžnou úspěšnou cestu nabídnout jednu hlavní akci, která atomicky uloží změny, přijme nezměněné návrhy, provede validaci, schválí položku a odvodí její další stav;
- nevystavovat několik tlačítek pro technické mezistavy, pokud nepředstavují samostatná a pro uživatele významná rozhodnutí;
- stavové a odvozené hodnoty, například zahrnutí do exportu, exportní trasu nebo stav workflow, nechat řídit systémem a běžně je nedovolit ručně přepisovat;
- samotným otevřením, zobrazením nebo procházením položky neměnit její stav; změnu provést až výslovnou akcí uživatele;
- samostatně nabídnout pouze skutečné alternativy, například uložit koncept, vyřadit položku, zrušit ji nebo odložit rozhodnutí;
- při neúspěchu neprovést částečný stavový přechod, ponechat formulář otevřený a lidsky uvést přesně to, co je nutné doplnit;
- během delší operace zobrazit průběh nebo alespoň jednoznačný stav práce, zablokovat duplicitní spuštění a zajistit idempotentní zpracování opakovaného požadavku;
- do akceptačních testů zahrnout běžný úspěšný scénář dokončený jedinou hlavní akcí bez opakovaného zadávání nebo potvrzování stejné informace.

Text hlavní akce má popisovat její uživatelský výsledek, například `Schválit a zahrnout do exportu`, nikoli interní operaci typu `Nastavit stav APPROVED`.

## Povinný výstup při návrhu nebo změně produktu

Podle fáze stručně zachytit:

1. **Produkt a účel** – co se vyvíjí, pro koho a s jakou mírou autonomie.
2. **Fázi** – experiment, prototyp, pilot, produkce nebo aktualizace.
3. **Master** – obecná logika a stabilní části.
4. **Deployment** – držitel licence, instance, konfigurace a odchylky.
5. **Vlastnictví a správa** – autor, vlastníci, správce a oprávnění.
6. **Verzi** – master a revize deploymentu.
7. **Zdroj pravdy** – kde jsou reprodukovatelné podklady.
8. **Testování** – stav, akceptační kritéria a lidské kontrolní body.
9. **Ochranu dat** – co zůstává pouze u zákazníka.
10. **Změny pro master** – co lze po anonymizaci zobecnit.
11. **Další krok** – nejbližší konkrétní rozhodnutí nebo realizace.

Nevytvářet vždy rozsáhlý report. Udržet výstup přiměřený fázi a riziku. Pokud již projektová dokumentace existuje, aktualizovat ji místo vytváření paralelního zdroje.

## Sebekontrola tohoto skillu

Při změně tohoto skillu uplatnit jeho vlastní pravidla:

- zachovat Ladislava Goce jako autora, vlastníka masteru a odborného správce;
- verzovat změnu podle SemVer;
- udržovat master oddělený od případných zákaznických deploymentů;
- nepřenášet zákaznické konfigurace nebo data do masteru;
- před vydáním změnu validovat a ověřit na realistických vývojových scénářích;
- evidovat, která verze masteru je nasazena v každém deploymentu.


## 1.4.0 – Proporcionální experimentální vývoj a pilot

Ve vlastní autorově development instanci rozliš mezi `DEVELOPMENT`, `PILOT_WITH_REAL_DATA` a `PRODUCTION`. Pro krátký vývojový cyklus nepožaduj plný zákaznický deployment balíček, opakovanou licenci/checklist ani revizi celého masteru při každém bugfixu. Stačí Git commit/verze, jednoznačný vlastník a target, cílený test a UAT. Nové obecně použitelné poučení lze sepsat později při řízené aktualizaci masteru; není bránou pro opravu produktu. Identifikovaná spotřební testovací data v prokazatelně vývojovém prostředí lze na základě předem schváleného rozsahu likvidovat bez dodatečných záloh; zachovej oddělení skutečných klientských dat, tenantů a zákonných retenčních povinností. Toto upřesnění má při aktivním DEVELOPMENT režimu přednost před obecnou dokumentační povinností výše, nikoli před ochranou dat či autorskými právy.
