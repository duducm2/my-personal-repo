import json
import urllib.request
from pathlib import Path

BASE = "http://127.0.0.1:8770"
CSV = Path(
    r"C:\Users\eduev\Meu Drive\17 - Projects\my-personal-repo\my-data\canonical\projects.csv"
)


def get():
    with urllib.request.urlopen(BASE + "/api/state") as r:
        return json.loads(r.read().decode())["collections"]


def put(collections):
    data = json.dumps({"collections": collections}).encode()
    req = urllib.request.Request(
        BASE + "/api/state",
        data=data,
        method="PUT",
        headers={"Content-Type": "application/json"},
    )
    with urllib.request.urlopen(req) as r:
        return json.loads(r.read().decode())


cols = get()
assert "summary_detail_en" in cols["projects"][0]
di = next(p for p in cols["projects"] if p["id"] == "data-insights-pt")
assert di["summary_en"] and di["summary_detail_en"]
assert "Grounded Theory" in di["summary_detail_en"]
print("LOAD detail cols ok")

# edit both layers
orig_sum = di["summary_en"]
orig_det = di["summary_detail_en"]
di["summary_en"] = "SMOKE-SUMMARY"
di["summary_detail_en"] = "SMOKE-DETAIL-LONG"
res = put(cols)
assert res.get("ok"), res

cols2 = get()
di2 = next(p for p in cols2["projects"] if p["id"] == "data-insights-pt")
assert di2["summary_en"] == "SMOKE-SUMMARY"
assert di2["summary_detail_en"] == "SMOKE-DETAIL-LONG"
text = CSV.read_text(encoding="utf-8")
assert "SMOKE-SUMMARY" in text and "SMOKE-DETAIL-LONG" in text
print("SAVE both layers ok")

# restore
di2["summary_en"] = orig_sum
di2["summary_detail_en"] = orig_det
put(cols2)
cols3 = get()
di3 = next(p for p in cols3["projects"] if p["id"] == "data-insights-pt")
assert di3["summary_en"] == orig_sum
assert di3["summary_detail_en"] == orig_det
print("RESTORE ok")

with urllib.request.urlopen(BASE + "/") as r:
    html = r.read().decode()
assert "Shift+D" in html and "detail-mode-label" in html
print("STATIC ok")
print("SMOKE PASS")
