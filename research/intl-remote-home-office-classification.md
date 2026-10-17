# International remote / HO classification (BR-first, Oct 2026)

Extends Brazil HO work. Filter: **Accepts remote / HO** = `yes` | `hybrid`.
Lens: **Brazil / LatAm hiring eligibility**, not “remote somewhere.”

## Rubric

| Value     | Meaning                                                                                                       |
| --------- | ------------------------------------------------------------------------------------------------------------- |
| `yes`     | Regularly hires from Brazil / LatAm remote (employee or common PJ), or all-remote with Brazil on country list |
| `hybrid`  | Remote/hybrid exists but BR eligibility is selective / entity+timezone constrained                            |
| `no`      | Remote roles exist but Brazil almost never eligible                                                           |
| `unknown` | Thin public evidence                                                                                          |

Applied via `TIER_INTL` in `scripts/backfill_brazil_home_office.py` (empty cells only).
New employers: `scripts/seed_intl_remote_br_companies.py`.

## Priority A — existing rows (Brazilians often work remote)

| company_id        | value  | evidence (Oct 2026)                                                                                    |
| ----------------- | ------ | ------------------------------------------------------------------------------------------------------ |
| gitlab-global     | yes    | Greenhouse: Remote Brazil sales/CS (e.g. LATAM Commercial, CSE LATAM). All-remote + country guidelines |
| atlassian-global  | yes    | Team Anywhere where entity exists; LatAm hiring appears on careers                                     |
| stripe-global     | yes    | Country eligibility lists; remote-friendly teams commonly include BR                                   |
| spotify-global    | hybrid | WFA heritage; must confirm Brazil per JD (selective)                                                   |
| microsoft-global  | hybrid | Remote/intl by team; filter LatAm/Brazil                                                               |
| google-global     | hybrid | Selective remote; filter Remote + Brazil/LatAm                                                         |
| amazon-global     | hybrid | Case-by-case remote/intl for BI/analytics                                                              |
| databricks-global | hybrid | Remote by role; verify country                                                                         |
| snowflake-global  | hybrid | Remote by role; verify country                                                                         |
| sap-global        | hybrid | Remote within hiring countries; BR entity possible                                                     |
| siemens-global    | hybrid | Remote/hybrid by unit; verify BR                                                                       |

## Priority B — existing rows (weaker BR)

| company_id                      | value  | evidence                                        |
| ------------------------------- | ------ | ----------------------------------------------- |
| meta-global                     | no     | Remote limited; BR rare on open boards          |
| zalando-global                  | no     | Europe-focused remote/hybrid                    |
| booking-global                  | no     | Europe-centric; outside-EU remote limited       |
| pennylane-europe                | no     | Europe residence / CET; BR usually NO           |
| capital-one-us                  | no     | US-person-centric remote                        |
| jpmorgan-us                     | no     | US hubs; BR remote uncommon on US board         |
| walmart-us                      | no     | US retail tech; BR rare                         |
| citigroup-us                    | no     | Prefer Citi Brasil entity separately            |
| deloitte-us                     | hybrid | Use Deloitte BR entity careers for local/hybrid |
| accenture-us                    | hybrid | Strong BR entity; remote/hybrid by project      |
| alibaba-global                  | no     | Intl via hubs; LatAm remote rare                |
| bytedance-global                | no     | Country-specific; BR rare                       |
| tencent-global                  | no     | Via hubs; BR rare                               |
| meituan-china … baidu-china (6) | no     | China-local / Mandarin-centric boards           |

## New companies — Priority A (seed, `home_office` at insert)

| company_id          | value  | careers / note                                                                              |
| ------------------- | ------ | ------------------------------------------------------------------------------------------- |
| automattic-global   | yes    | automattic.com/work-with-us — work from anywhere; 83 countries; on remote-jobs-brazil lists |
| zapier-global       | yes    | Ashby: Remote incl. South America TAM (Oct 2026)                                            |
| doist-global        | yes    | Fully remote; listed on remote-jobs-brazil                                                  |
| canonical-global    | yes    | Remote-first since 2004; Brazil-tagged openings on aggregators                              |
| shopify-global      | hybrid | Flex/remote but country lists tighten — verify BR                                           |
| elastic-global      | yes    | Distributed; LatAm hires appear                                                             |
| cloudflare-global   | yes    | Remote-friendly; verify country per JD                                                      |
| hubspot-global      | hybrid | Remote/hybrid + LatAm presence; office hubs too                                             |
| globant-global      | yes    | LatAm digital; BR hubs + remote delivery                                                    |
| thoughtworks-global | hybrid | Strong BR offices + project remote                                                          |
| epam-global         | yes    | Common BR remote/contractor path                                                            |
| bairesdev-global    | yes    | LatAm talent network; heavy BR                                                              |
| turing-global       | yes    | Remote marketplace; many BR talent                                                          |
| deel-global         | yes    | Remote-first + EOR/payroll for BR                                                           |
| vtex-brasil         | yes    | BR-rooted commerce cloud; remote/hybrid roles                                               |
| wellhub-global      | hybrid | BR-rooted (Gympass); remote/hybrid LatAm                                                    |

## New companies — Priority B

| company_id        | value  | note                                                  |
| ----------------- | ------ | ----------------------------------------------------- |
| miro-global       | hybrid | Remote-heavy EU product; verify BR eligibility        |
| pipedrive-global  | hybrid | Remote-friendly CRM; verify BR                        |
| x-team-global     | yes    | Remote contractor network; BR common                  |
| remote-com-global | yes    | Remote.com — HR/payroll for distributed; BR supported |

## How to filter

1. Target companies → Home office → **Accepts remote / HO**
2. Optionally Country → **International HQ** for non-BR HQ only
3. **Remote / HO** alone for `yes` only (GitLab, Automattic, Zapier, Leega, Boticário, …)
