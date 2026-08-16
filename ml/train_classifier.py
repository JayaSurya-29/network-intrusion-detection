import os
import json
import joblib
import numpy as np
import pandas as pd
from sklearn.linear_model import SGDClassifier
from sklearn.tree import DecisionTreeClassifier
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import (
    accuracy_score, precision_recall_fscore_support,
    classification_report, confusion_matrix
)
from preprocessing import prepare_data

def log(msg):
    print(str(msg), flush=True)

def train_and_evaluate_classifiers():
    log("Loading and preprocessing dataset...")
    X_train, y_train, X_test, y_test, preprocessor = prepare_data()
    class_names = [str(cls) for cls in preprocessor.label_encoder.classes_]
    
    log(f"Training shapes: X_train={X_train.shape}, y_train={y_train.shape}")
    log(f"Testing shapes: X_test={X_test.shape}, y_test={y_test.shape}")
    log(f"Target Classes: {class_names}\n")

    models = {
        "Logistic Regression (SGD)": SGDClassifier(
            loss='log_loss', max_iter=50, random_state=42, class_weight='balanced'
        ),
        "Decision Tree": DecisionTreeClassifier(
            max_depth=15, random_state=42, class_weight='balanced'
        ),
        "Random Forest": RandomForestClassifier(
            n_estimators=50, max_depth=15, random_state=42, class_weight='balanced', n_jobs=-1
        )
    }

    results = {}
    trained_models = {}

    log("=================================================================")
    log("                MODEL EVALUATION & COMPARISON                    ")
    log("=================================================================")

    for name, model in models.items():
        log(f"\n--- Training {name} ---")
        model.fit(X_train, y_train)
        y_pred = model.predict(X_test)
        
        acc = accuracy_score(y_test, y_pred)
        precision, recall, f1, _ = precision_recall_fscore_support(
            y_test, y_pred, average='weighted', zero_division=0
        )
        macro_prec, macro_rec, macro_f1, _ = precision_recall_fscore_support(
            y_test, y_pred, average='macro', zero_division=0
        )

        results[name] = {
            "accuracy": float(acc),
            "weighted_precision": float(precision),
            "weighted_recall": float(recall),
            "weighted_f1": float(f1),
            "macro_f1": float(macro_f1),
            "report": classification_report(y_test, y_pred, target_names=class_names, zero_division=0, output_dict=True),
            "confusion_matrix": confusion_matrix(y_test, y_pred).tolist()
        }
        trained_models[name] = model

        log(f"{name} Results:")
        log(f"  Accuracy:           {acc * 100:.2f}%")
        log(f"  Weighted Precision: {precision * 100:.2f}%")
        log(f"  Weighted Recall:    {recall * 100:.2f}%")
        log(f"  Weighted F1-Score:  {f1 * 100:.2f}%")
        log(f"  Macro F1-Score:     {macro_f1 * 100:.2f}%")

    # Display comparison table
    comparison_df = pd.DataFrame([
        {
            "Model": name,
            "Accuracy": f"{res['accuracy']*100:.2f}%",
            "Precision": f"{res['weighted_precision']*100:.2f}%",
            "Recall": f"{res['weighted_recall']*100:.2f}%",
            "F1-Score": f"{res['weighted_f1']*100:.2f}%",
            "Macro F1": f"{res['macro_f1']*100:.2f}%"
        }
        for name, res in results.items()
    ])
    
    log("\n=================================================================")
    log("                    MODEL COMPARISON TABLE                       ")
    log("=================================================================")
    log(comparison_df.to_string(index=False))
    log("=================================================================\n")

    # Select best model based on weighted F1-score
    best_model_name = max(results, key=lambda k: results[k]["weighted_f1"])
    best_model = trained_models[best_model_name]
    best_metrics = results[best_model_name]

    log(f"[BEST MODEL SELECTED]: {best_model_name}")
    log(f"  Reason: Highest Weighted F1-Score ({best_metrics['weighted_f1']*100:.2f}%)")
    log("\n--- Detailed Classification Report for Best Model ---")
    log(classification_report(y_test, best_model.predict(X_test), target_names=class_names, zero_division=0))

    # Save final model
    saved_models_dir = os.path.join(os.path.dirname(__file__), 'saved_models')
    os.makedirs(saved_models_dir, exist_ok=True)
    
    model_path = os.path.join(saved_models_dir, 'classifier.joblib')
    joblib.dump(best_model, model_path)
    log(f"\nSaved best model to {model_path}")

    # Save metrics JSON for backend / verification
    metrics_path = os.path.join(saved_models_dir, 'classifier_metrics.json')
    with open(metrics_path, 'w') as f:
        json.dump({
            "best_model": best_model_name,
            "all_results": results,
            "classes": class_names
        }, f, indent=2)
    log(f"Saved model metrics to {metrics_path}")

    return best_model, results

if __name__ == "__main__":
    train_and_evaluate_classifiers()
