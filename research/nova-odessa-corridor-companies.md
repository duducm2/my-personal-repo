# Nova Odessa corridor companies (Oct 2026)

Fills the west RMC gap around **Nova Odessa** (Americana / Santa Bárbara d'Oeste / Limeira belt).

Seed: `scripts/seed_nova_odessa_corridor_companies.py`  
Filter: Country → **Near home** (city/region match `NEAR_HOME_RE` in `web/flags.js`).

## Sources

- Mapa Industrial: Nova Odessa, Santa Bárbara d'Oeste, Americana
- Econodata Nova Odessa ranking (KSPG, Kolbenschmidt)
- Live boards: Denso Gupy (`denso-sa.gupy.io`), Romi LG portal, Goodyear trabalhe-conosco / internship news, Suzano Gupy, Pirelli LG, Raizen careers

## Added companies

| id                            | name                         | city                   | home_office |
| ----------------------------- | ---------------------------- | ---------------------- | ----------- |
| goodyear-santa-barbara        | Goodyear do Brasil           | SBO / Americana        | no          |
| romi-santa-barbara            | Romi                         | Santa Bárbara d'Oeste  | hybrid      |
| denso-santa-barbara           | Denso do Brasil              | Santa Bárbara d'Oeste  | no          |
| kspg-nova-odessa              | KSPG Automotive Brazil       | Nova Odessa            | no          |
| kolbenschmidt-nova-odessa     | Kolbenschmidt Pistons Brazil | Nova Odessa            | no          |
| lupatech-nova-odessa          | Lupatech                     | Nova Odessa            | no          |
| suzano-americana              | Suzano                       | Americana              | hybrid      |
| votorantim-cimentos-americana | Votorantim Cimentos          | Americana              | no          |
| hyundai-infracore-americana   | HD Hyundai Infracore SA      | Americana              | no          |
| mmsa-americana                | MMSA                         | Americana              | no          |
| textil-canatiba-santa-barbara | Têxtil Canatiba              | Santa Bárbara d'Oeste  | no          |
| sanoh-santa-barbara           | Sanoh do Brasil              | Santa Bárbara d'Oeste  | no          |
| pirelli-campinas              | Pirelli Brasil               | Campinas               | no          |
| aethra-sumare                 | Aethra                       | Sumaré                 | no          |
| cargill-limeira               | Cargill                      | Limeira                | hybrid      |
| usina-ester-cosan-rmc         | Cosan / Raízen corridor      | Limeira–Americana belt | no          |

## HO notes

- Plants default **`no`** (Goodyear, Denso, KSPG, Pirelli, …).
- **`hybrid`**: Romi (TI/office), Suzano (corporate analytics), Cargill (office tracks).
- Denso/Romi postings often require residency in **Santa Bárbara d'Oeste, Americana, or Nova Odessa**.
