# Brazil home office / remote classification (Oct 2026)

Reuse `companies.csv` column `home_office` (`yes` | `hybrid` | `no` | `unknown`).
Filter: **Accepts remote / HO** = `yes` or `hybrid` (combine with Country → Brazil or Near home).

## Rubric

| Value     | Meaning                                                                                           |
| --------- | ------------------------------------------------------------------------------------------------- |
| `yes`     | Regularly posts 100% remote / home-office BR roles for knowledge-work, or remote-first consulting |
| `hybrid`  | Hybrid is normal; some remote-by-role; office days expected                                       |
| `no`      | Plant, DC ops, hospital, lab campus, or careers default to onsite                                 |
| `unknown` | Insufficient public evidence                                                                      |

Evidence order: seed intent → live careers/Gupy Workplace Type → job_openings notes → leave `unknown`.

Applied by `scripts/backfill_brazil_home_office.py` (empty cells only).

## Tier A — seed intents (no new browser pass)

Source scripts: `seed_campinas_rmc_companies.py`, `seed_rmc_large_employers.py`, `seed_rmc_large_employers_gap_audit.py`, `seed_state_of_data_preferred_companies.py`.

| company_id                                                                                                                                                                                              | value   | note                                                |
| ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------- | --------------------------------------------------- |
| grupo-boticario                                                                                                                                                                                         | yes     | Seed + Gupy Oct 2026: multiple Remote Work listings |
| nubank-brasil, ifood-brasil, mercado-livre, itau-unibanco, hotmart, natura-co, sicredi, magazine-luiza                                                                                                  | hybrid  | State of Data preferred; hybrid/remote by role      |
| trouw-nutrition-campinas, ambev-tech-campinas, padtec-campinas, venturus-campinas, 3m-sumare                                                                                                            | hybrid  | Campinas RMC seed                                   |
| unimed-campinas, toyota-indaiatuba, eaton-valinhos, john-deere-indaiatuba, azul-viracopos, sotreq-valinhos, unicamp, puc-campinas                                                                       | hybrid  | RMC large employers seed                            |
| lenovo-motorola-jaguariuna, neoenergia-elektro, dpaschoal-campinas, basf-rmc                                                                                                                            | hybrid  | Gap-audit seed                                      |
| byd-brasil-campinas, sidi-campinas, oba-hortifruti-sumare, grupo-mandic-campinas                                                                                                                        | no      | Plant / campus / CD / onsite DA                     |
| honda-sumare, sanofi-medley-campinas, ems-hortolandia, organon-campinas, solvay-rhodia-paulinia, petrobras-replan-paulinia, sanasa-campinas, marelli-hortolandia, valeo-itatiba, villares-metals-sumare | no      | Plant / mill / municipal                            |
| hospital-vera-cruz-campinas                                                                                                                                                                             | unknown | Seed unknown                                        |

## Tier B — Oct 2026 careers research

### Live board checks

| company_id                                                                       | value  | source                                | snippet                                                                                                                |
| -------------------------------------------------------------------------------- | ------ | ------------------------------------- | ---------------------------------------------------------------------------------------------------------------------- |
| leega-brasil                                                                     | yes    | https://leega.gupy.io/                | Cientista de Dados Sênior / Engenheiro Analítico / Eng. Dados GCP labeled **Remote Work**; Power BI Hybrid             |
| kryptus-campinas                                                                 | yes    | https://kryptus.gupy.io/              | About: “home office chegou para ficar”; DFIR **REMOTO**; talent pools Campinas + Remote; also many PRESENCIAL Campinas |
| grupo-boticario                                                                  | yes    | https://grupoboticario.gupy.io/       | Agile Specialist, SI, Martech, SAP CO as **Remote Work**                                                               |
| eldorado-campinas                                                                | hybrid | https://institutoeldorado.gupy.io/    | Analista de dados Campinas **Hybrid**; culture mentions possibilidade de trabalho remoto                               |
| bosch-brasil / bosch-brasil-internal                                             | hybrid | SmartRecruiters BR + openings history | Hybrid ~3x/week Campinas common on tracked openings                                                                    |
| ciandt-campinas                                                                  | hybrid | ciandt.com careers + region_en        | Hybrid; metro residents often office-required                                                                          |
| msx-campinas                                                                     | hybrid | region_en “hybrid”                    | Hybrid Campinas                                                                                                        |
| porto-seguro                                                                     | hybrid | https://porto.gupy.io/ + seed notes   | Hybrid/onsite by team; SP-centric                                                                                      |
| indecx-campinas                                                                  | hybrid | Campinas HQ SaaS notes                | Hybrid/remote by role                                                                                                  |
| matera-campinas                                                                  | hybrid | InHire board + Campinas tech pattern  | Hybrid common                                                                                                          |
| daitan-campinas                                                                  | hybrid | Encora/Daitan careers                 | Hybrid/remote by client engagement                                                                                     |
| isystems-campinas                                                                | hybrid | Campinas software house               | Hybrid by role                                                                                                         |
| cpqd-campinas                                                                    | hybrid | R&D Campinas                          | Hybrid by project                                                                                                      |
| samsung-srbr-campinas                                                            | hybrid | SRBR lab                              | Hybrid/onsite mix                                                                                                      |
| huawei-campinas, tetra-pak-campinas, nxp-campinas                                | hybrid | Techno Park / national ops            | Hybrid by role                                                                                                         |
| syngenta-rmc, corteva-brasil, schneider-electric-brasil, cnh-brasil, agco-brasil | hybrid | Agri/industrial corridors             | Hybrid for knowledge-work; site-dependent                                                                              |
| agibank-campinas, cpfl-campinas                                                  | no     | Careers lean presencial / utility ops | Onsite-leaning                                                                                                         |
| ascenty-\*, scala-svcpcp01, odata-sp02, cloud-hq-paulinia, consultimer-dc        | no     | Hyperscale / DC ops                   | Site/onsite                                                                                                            |
| cnpem-campinas, cti-renato-archer-campinas                                       | no     | National lab / federal campus         | Predominantly onsite                                                                                                   |
| jacto-rmc                                                                        | no     | Pompéia industrial                    | Typically onsite                                                                                                       |

### Out of scope (this phase)

US / China / global-remote enterprise rows left empty until a later pass (`seed_global_remote_enterprises.py` never set `home_office`).

## How to filter in the UI

1. Open Target companies.
2. Country → **Brazil** (or **Near home**).
3. Home office → **Accepts remote / HO**.

Use **Remote / HO** alone when you want `yes` only (Boticário, Leega, Kryptus).

## Nova Odessa corridor (Oct 2026 add)

West RMC employers (Goodyear, Romi, Denso, KSPG, Suzano Americana, …) were seeded via
`scripts/seed_nova_odessa_corridor_companies.py`. See
[`research/nova-odessa-corridor-companies.md`](nova-odessa-corridor-companies.md).
Most plants are `home_office=no`; Romi / Suzano / Cargill are `hybrid`.
