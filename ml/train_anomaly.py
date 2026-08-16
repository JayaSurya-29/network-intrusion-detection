import os
import json
import joblib
import numpy as np
import pandas as pd
from sklearn.ensemble import IsolationForest
from preprocessing import prepare_data

def log(msg):
    print(str(msg), flush=True)

def train_and_evaluate_anomaly_detector():
    log("Loading and preprocessing dataset for Anomaly Detection...")
    X_train, y_train, X_test, y_test, preprocessor = prepare_data()
    class_names = [str(cls) for cls in preprocessor.label_encoder.classes_]
    
    normal_class_idx = preprocessor.label_encoder.transform(['Normal'])[0]
    
    # Train Isolation Forest on normal traffic samples to establish a clean baseline
    X_train_normal = X_train[y_train == normal_class_idx]
    
    log(f"Total Training Samples: {X_train.shape[0]}")
    log(f"Normal Training Samples (Baseline): {X_train_normal.shape[0]}")
    log(f"Test Samples for Evaluation: {X_test.shape[0]}\n")

    # Contamination set to 0.05 (5% expected baseline variance)
    iso_forest = IsolationForest(
        n_estimators=100,
        contamination=0.05,
        random_state=42,
        n_jobs=-1
    )
    
    log("--- Training Isolation Forest Anomaly Detector ---")
    iso_forest.fit(X_train_normal)
    
    # Predict on test set: 1 = normal, -1 = anomaly
    raw_preds = iso_forest.predict(X_test)
    anomaly_bool = (raw_preds == -1)  # True if anomaly
    scores = iso_forest.decision_function(X_test)

    # Evaluate anomaly detection rate across ground truth attack categories
    eval_df = pd.DataFrame({
        'true_category': preprocessor.decode_target(y_test),
        'is_anomaly': anomaly_bool,
        'anomaly_score': scores
    })

    log("=================================================================")
    log("             ANOMALY DETECTION EVALUATION BY CATEGORY            ")
    log("=================================================================")
    
    cat_summary = []
    for cat in class_names:
        sub = eval_df[eval_df['true_category'] == cat]
        total_cat = len(sub)
        anomalies_flagged = sub['is_anomaly'].sum()
        pct_flagged = (anomalies_flagged / total_cat * 100) if total_cat > 0 else 0.0
        mean_score = sub['anomaly_score'].mean()
        
        cat_summary.append({
            "Category": cat,
            "Total Test Samples": total_cat,
            "Flagged Anomalies": int(anomalies_flagged),
            "Anomaly Detection Rate": f"{pct_flagged:.2f}%",
            "Mean Anomaly Score": f"{mean_score:.4f}"
        })

    summary_table = pd.DataFrame(cat_summary)
    log(summary_table.to_string(index=False))
    log("=================================================================\n")

    # Save final anomaly model
    saved_models_dir = os.path.join(os.path.dirname(__file__), 'saved_models')
    os.makedirs(saved_models_dir, exist_ok=True)
    
    anomaly_model_path = os.path.join(saved_models_dir, 'anomaly_detector.joblib')
    joblib.dump(iso_forest, anomaly_model_path)
    log(f"Saved anomaly detection model to {anomaly_model_path}")

    # Save anomaly evaluation metrics JSON
    metrics_path = os.path.join(saved_models_dir, 'anomaly_metrics.json')
    with open(metrics_path, 'w') as f:
        json.dump({
            "model_type": "Isolation Forest",
            "n_estimators": 100,
            "contamination": 0.05,
            "category_summary": cat_summary
        }, f, indent=2)
    log(f"Saved anomaly metrics to {metrics_path}")

    return iso_forest, cat_summary

if __name__ == "__main__":
    train_and_evaluate_anomaly_detector()
