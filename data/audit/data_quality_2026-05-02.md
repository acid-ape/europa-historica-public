# Europa Historica — Daten-Qualitaets-Audit

Stand: **2026-05-02**

## Zusammenfassung

| Metrik | Anzahl | Prozent |
|---|---:|---:|
| Herrscher gesamt | 2842 | 100% |
| ... mit Wikidata-ID | 2810 | 98% |
| ... mit Bild | 2378 | 83% |
| ... mit beiden | 2378 | 83% |
| **Heilbar via fetch_images.py** (QID, kein Bild) | **432** | 15% |
| **QID-Lueecke** (weder QID noch Bild) | **32** | 1% |

| Metrik | Anzahl | Prozent |
|---|---:|---:|
| Territorien gesamt | 296 | 100% |
| ... mit Wikidata-ID | 290 | 97% |
| ... mit Flag | 62 | 20% |
| ... mit Coat of Arms | 49 | 16% |
| ... mit Flag oder CoA | 70 | 23% |
| **Heilbar via backfill_flags.py** (QID, ohne Flag/CoA) | **220** | 74% |
| **Manuell** (kein QID UND ohne Flag/CoA) | **6** | 2% |

### Multi-Context-Kontexte

- 13 Multi-Context-Territorien mit insgesamt 36 Kontexten
- 32 Kontexte mit Flag/CoA (88%)
- 4 Kontexte ohne Flag/CoA

## Top-15 Territorien mit Herrschern ohne QID

| Rang | QID | Territorium | Herrscher ohne QID |
|---:|---|---|---:|
| 1 | Q139377 | Axum | 14 |
| 2 | Q582861 | Merinides | 8 |
| 3 | Q48189 | Teutonic Knights | 3 |
| 4 | Q1250763 | Emirate of Sicily | 2 |
| 5 | Q5406 | Hittites | 1 |
| 6 | Q1311990 | Serbia | 1 |
| 7 | Q49683 | Lithuania | 1 |
| 8 | Q178084 | Ilkhanate | 1 |
| 9 | Q20737645 | Timurid Emirates | 1 |

## Top-15 Territorien mit Herrschern: QID vorhanden, Bild fehlt

| Rang | QID | Territorium | Herrscher heilbar |
|---:|---|---|---:|
| 1 | Q41137 | Assyria | 47 |
| 2 | Q47690 | Babylonia | 42 |
| 3 | Q154667 | Kingdom of Georgia | 37 |
| 4 | Q170174 | Papal States | 30 |
| 5 | Q1311990 | Serbia | 19 |
| 6 | Q131491 | Nothumbria | 17 |
| 7 | Q20 | Norway | 16 |
| 8 | Q858841 | Croatia | 13 |
| 9 | Q5406 | Hittites | 12 |
| 10 | Q431575 | Idrisid Caliphate | 12 |
| 11 | Q1250763 | Emirate of Sicily | 11 |
| 12 | Q752662 | Hafsid Caliphate | 11 |
| 13 | Q282428 | Mamluke Sultanate | 11 |
| 14 | Q72499 | Q72499 | 10 |
| 15 | Q582861 | Merinides | 10 |

## Multi-Context-Kontexte ohne Flag/CoA

| Territorium | Kontext | Context-QID |
|---|---|---|
| Q145 | Anglo-Saxon England | Q784963 |
| Q145 | Great Britain / United Kingdom | Q145 |
| Q794 | Parthian Empire | Q1986139 |
| Q794 | Sasanian Empire | Q83891 |

## Territorien ohne QID (manuelle Recherche noetig)

- `LOCAL_EASTERN_MASURIAN_CUL` — Eastern Masurian culture
- `LOCAL_MINOR_STATES` — Minor States
- `LOCAL_PLAIN-POTTERY_CULTUR` — Plain-Pottery culture
- `LOCAL_SAMBIAN-NOTHANGIAN_C` — Sambian-Nothangian culture
- `LOCAL_UNKNOWN` — Unknown territory
- `LOCAL_WESTERN_MASURIAN_CUL` — Western Masurian culture
