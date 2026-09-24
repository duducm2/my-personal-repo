"""Supervised ML bridge artifact: baseline vs random forest on breast cancer data."""
from __future__ import annotations

import json
from pathlib import Path

import pandas as pd
from sklearn.datasets import load_breast_cancer
from sklearn.ensemble import RandomForestClassifier
from sklearn.linear_model import LogisticRegression
from sklearn.metrics import (
    accuracy_score,
    classification_report,
    confusion_matrix,
    f1_score,
    precision_score,
    recall_score,
    roc_auc_score,
)
from sklearn.model_selection import train_test_split
from sklearn.pipeline import Pipeline
from sklearn.preprocessing import StandardScaler

OUT = Path(__file__).resolve().parent / "output"
OUT.mkdir(exist_ok=True)


def metrics_bundle(y_true, y_pred, y_proba_malignant, label: str) -> dict:
    """y_proba_malignant = P(malignant). sklearn target: 0=malignant, 1=benign."""
    # Treat malignant (0) as the positive class for safety-oriented metrics.
    y_true_mal = (y_true == 0).astype(int)
    y_pred_mal = (y_pred == 0).astype(int)
    return {
        "label": label,
        "accuracy": float(accuracy_score(y_true, y_pred)),
        "malignant_precision": float(precision_score(y_true_mal, y_pred_mal, zero_division=0)),
        "malignant_recall": float(recall_score(y_true_mal, y_pred_mal, zero_division=0)),
        "malignant_f1": float(f1_score(y_true_mal, y_pred_mal, zero_division=0)),
        "roc_auc_malignant": float(roc_auc_score(y_true_mal, y_proba_malignant)),
        "confusion_matrix_labels": ["malignant(0)", "benign(1)"],
        "confusion_matrix": confusion_matrix(y_true, y_pred).tolist(),
    }


def main() -> None:
    data = load_breast_cancer(as_frame=True)
    X = data.data
    y = data.target  # 0 = malignant, 1 = benign in sklearn; we keep as-is
    feature_names = list(X.columns)

    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=0.2, random_state=42, stratify=y
    )

    baseline = Pipeline(
        [
            ("scaler", StandardScaler()),
            ("clf", LogisticRegression(max_iter=1000, random_state=42)),
        ]
    )
    baseline.fit(X_train, y_train)
    base_pred = baseline.predict(X_test)
    # P(malignant) = P(class 0)
    base_proba_mal = baseline.predict_proba(X_test)[:, 0]

    forest = RandomForestClassifier(
        n_estimators=200,
        class_weight="balanced",
        random_state=42,
        n_jobs=-1,
    )
    forest.fit(X_train, y_train)
    forest_pred = forest.predict(X_test)
    forest_proba_mal = forest.predict_proba(X_test)[:, 0]

    results = {
        "dataset": "sklearn.load_breast_cancer",
        "n_train": int(len(X_train)),
        "n_test": int(len(X_test)),
        "target_note": "sklearn encoding: 0=malignant, 1=benign; primary metric = malignant recall",
        "baseline": metrics_bundle(
            y_test, base_pred, base_proba_mal, "logistic_regression"
        ),
        "candidate": metrics_bundle(
            y_test, forest_pred, forest_proba_mal, "random_forest_balanced"
        ),
        "failure_notes": [
            "Inspect confusion_matrix: false negatives on malignant (class 0) matter most for a safety-oriented metric.",
            "Single stratified holdout only — not a substitute for nested CV on a real problem.",
            "Production starter if served: monitor latency, HTTP/serving errors, and prediction volume before drift tooling.",
        ],
    }

    (OUT / "metrics.json").write_text(
        json.dumps(results, indent=2), encoding="utf-8"
    )

    report = classification_report(
        y_test, forest_pred, target_names=list(data.target_names)
    )
    (OUT / "classification_report_forest.txt").write_text(report, encoding="utf-8")

    importance = (
        pd.DataFrame(
            {
                "feature": feature_names,
                "importance": forest.feature_importances_,
            }
        )
        .sort_values("importance", ascending=False)
        .head(15)
    )
    importance.to_csv(OUT / "feature_importance_top15.csv", index=False)

    print("Wrote", OUT / "metrics.json")
    print("Baseline malignant ROC-AUC:", results["baseline"]["roc_auc_malignant"])
    print("Forest   malignant ROC-AUC:", results["candidate"]["roc_auc_malignant"])
    print("Forest malignant recall:", results["candidate"]["malignant_recall"])
    print(report)


if __name__ == "__main__":
    main()
