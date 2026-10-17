import csv
from collections import Counter
from pathlib import Path

rows = list(
    csv.DictReader(
        Path("my-data/canonical/companies.csv").open(encoding="utf-8", newline="")
    )
)


def ho(r):
    return (r.get("home_office") or "").strip().lower()


c = Counter(ho(r) or "(empty)" for r in rows)
yes = sorted(r["id"] for r in rows if ho(r) == "yes")
accepts = [r["id"] for r in rows if ho(r) in ("yes", "hybrid")]
new_ids = [
    "automattic-global",
    "zapier-global",
    "doist-global",
    "canonical-global",
    "shopify-global",
    "elastic-global",
    "cloudflare-global",
    "hubspot-global",
    "globant-global",
    "thoughtworks-global",
    "epam-global",
    "bairesdev-global",
    "turing-global",
    "deel-global",
    "vtex-brasil",
    "wellhub-global",
    "miro-global",
    "pipedrive-global",
    "x-team-global",
    "remote-com-global",
]
missing = [i for i in new_ids if not any(r["id"] == i for r in rows)]
print("total", len(rows))
print("HO", dict(c))
print("empty", c.get("(empty)", 0))
print("yes", len(yes))
for i in yes:
    print(" ", i)
print("accepts", len(accepts))
print("missing_new", missing)
checks = [
    "gitlab-global",
    "automattic-global",
    "zapier-global",
    "meta-global",
    "meituan-china",
    "leega-brasil",
    "grupo-boticario",
]
for i in checks:
    r = next(x for x in rows if x["id"] == i)
    print(i, "ho=" + r["home_office"], "careers=" + str(bool(r.get("careers_url"))))
