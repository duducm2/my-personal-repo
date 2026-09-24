# Supervised ML bridge — portfolio artifact #3

End-to-end **supervised classification** on a public tabular dataset (scikit-learn Breast Cancer Wisconsin). Built for the Data Scientist transition: baseline → stronger model → error analysis → model card → production monitoring starter.

## Run

```bash
cd portfolio/variants/data-analyst/supervised-ml-bridge
python -m venv .venv
# Windows: .venv\Scripts\activate
pip install -r requirements.txt
python train_evaluate.py
```

Outputs under `output/`: metrics JSON, classification report, feature importance CSV.

## What this demonstrates

| Step | Evidence |
|------|----------|
| Baseline | Logistic regression (scaled) |
| Better model | Random forest with class-balanced focus |
| Metrics | Accuracy, ROC-AUC, precision, recall, F1 |
| Hygiene | Stratified train/test split; no target leakage |
| Failure analysis | Confusion matrix + highest-error notes in report |
| Production starter | If serving: monitor latency, error rate, prediction volume (see MODEL_CARD.md) |

## Honesty

This is an **offline** learning artifact, not a production deployment. It closes the “I have not shipped classic ML” gap with a repeatable loop you can discuss in interviews.
