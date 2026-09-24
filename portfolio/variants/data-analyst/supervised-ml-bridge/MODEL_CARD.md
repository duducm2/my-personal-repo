# Model card — Breast Cancer Wisconsin (bridge artifact)

## Problem

Binary classification: malignant vs benign tumor diagnosis support from cellular nucleus features. Business-style metric: **prefer high recall on malignant** (minimize false negatives) while keeping precision usable.

## Data

- Source: scikit-learn `load_breast_cancer` (UCI Breast Cancer Wisconsin Diagnostic).
- Rows: 569 · Features: 30 numeric · Target: binary (malignant / benign).
- Split: stratified 80/20 train/test, `random_state=42`.

## Models

1. **Baseline:** `StandardScaler` + `LogisticRegression` (max_iter=1000).
2. **Candidate:** `RandomForestClassifier` (n_estimators=200, class_weight=balanced, random_state=42).

## Metrics (see `output/metrics.json` after run)

Primary: ROC-AUC and recall on malignant class. Secondary: precision, F1, accuracy. Always read the confusion matrix before claiming “it works.”

## Limits

- Not clinical decision support; educational / portfolio only.
- Single holdout (not nested CV); no external validation set.
- No production serving, drift detection, or cost monitoring yet.

## If this were in production — monitoring starter

| Signal | Why |
|--------|-----|
| Latency | Catch slowdowns before users feel them |
| Error / timeout rate | Serving health |
| Prediction volume | Traffic spikes or silent dropouts |
| Later (with seniors) | Score distribution shift, label sampling, retrain cadence |

## Next step

Add nested CV + calibration; discuss leakage and monitoring with a senior DS on a real business dataset.
