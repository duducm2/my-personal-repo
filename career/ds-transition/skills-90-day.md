# Tier A — 90-day autodidact loop

**Cadence:** 8–12 hours/week. Depth over certificates.

## Week structure

| Block   | Hours | Focus                                                           |
| ------- | ----- | --------------------------------------------------------------- |
| Build   | 4–6   | Same dataset: baseline → better model → error analysis          |
| Metrics | 2     | Precision/recall/ROC vs a written business metric; “what fails” |
| Hygiene | 1–2   | Missingness, leakage, train/valid discipline                    |
| Write   | 1     | Update model card / one-pager                                   |

## Skills checklist

- [x] Supervised ML core (scikit-learn, pandas): classification on Breast Cancer Wisconsin — baseline logistic → random forest (see supervised-ml-bridge)
- [x] Experiment design + metrics: malignant recall + ROC-AUC primary; confusion matrix documented
- [x] Feature hygiene: stratified split; no target leakage; importance ranking exported
- [x] Model card one-pager: MODEL_CARD.md with limits + production monitoring starter (latency / error / volume)

## Tier B (months 2–6) — after Tier A green

- Pick **one** domain: ops/industrial **or** product analytics (tabular or light time series).
- Basic MLOps literacy: version model, log prediction volume/latency/errors, human review sample.
- Deepen LLM-as-evaluator (TrustMate style) before multi-agent frameworks.

## Tier C — defer until employed beside seniors

Deep learning from scratch, heavy Spark/Databricks, full multi-agent orchestration.

## Artifact link

Primary build target: [supervised-ml-bridge](../../portfolio/variants/data-analyst/supervised-ml-bridge/).
