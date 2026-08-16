import os
import json
import joblib
import numpy as np
import pandas as pd
import matplotlib.pyplot as plt
import seaborn as sns

from sklearn.metrics import classification_report, confusion_matrix
from preprocessing import prepare_data

def evaluate_and_generate_visualizations():
    print("Loading test data and models for Performance Evaluation...")
    X_train, y_train, X_test, y_test, preprocessor = prepare_data()
    class_names = [str(cls) for cls in preprocessor.label_encoder.classes_]

    models_dir = os.path.join(os.path.dirname(__file__), 'saved_models')
    classifier_path = os.path.join(models_dir, 'classifier.joblib')
    anomaly_path = os.path.join(models_dir, 'anomaly_detector.joblib')

    classifier = joblib.load(classifier_path)
    anomaly_detector = joblib.load(anomaly_path)

    # 1. Evaluate Supervised Classifier
    y_pred = classifier.predict(X_test)
    cm = confusion_matrix(y_test, y_pred)
    report_dict = classification_report(y_test, y_pred, target_names=class_names, output_dict=True)

    results_dir = os.path.join(os.path.dirname(__file__), 'results')
    screenshots_dir = os.path.join(os.path.dirname(os.path.dirname(__file__)), 'screenshots')
    os.makedirs(results_dir, exist_ok=True)
    os.makedirs(screenshots_dir, exist_ok=True)

    # Plot Confusion Matrix Plot
    plt.figure(figsize=(8, 6))
    sns.heatmap(cm, annot=True, fmt='d', cmap='Blues', xticklabels=class_names, yticklabels=class_names)
    plt.title('Random Forest Intrusion Classifier - Confusion Matrix', fontsize=12, fontweight='bold')
    plt.xlabel('Predicted Label', fontsize=10)
    plt.ylabel('True Label', fontsize=10)
    plt.tight_layout()

    cm_path1 = os.path.join(results_dir, 'confusion_matrix.png')
    cm_path2 = os.path.join(screenshots_dir, 'confusion_matrix.png')
    plt.savefig(cm_path1, dpi=300)
    plt.savefig(cm_path2, dpi=300)
    plt.close()
    print(f"Saved Confusion Matrix visualization to {cm_path2}")

    # Plot Classification F1-Scores Bar Chart
    f1_scores = [report_dict[cls]['f1-score'] for cls in class_names]
    plt.figure(figsize=(8, 5))
    bars = plt.bar(class_names, [s * 100 for s in f1_scores], color=['#10b981', '#ef4444', '#f59e0b', '#8b5cf6', '#ec4899'])
    plt.title('Model Classification F1-Score by Category', fontsize=12, fontweight='bold')
    plt.ylabel('F1-Score (%)', fontsize=10)
    plt.ylim(0, 100)
    
    for bar in bars:
        yval = bar.get_height()
        plt.text(bar.get_x() + bar.get_width()/2.0, yval + 1.5, f'{yval:.1f}%', ha='center', va='bottom', fontweight='bold')
        
    plt.tight_layout()
    f1_path1 = os.path.join(results_dir, 'f1_scores.png')
    f1_path2 = os.path.join(screenshots_dir, 'f1_scores.png')
    plt.savefig(f1_path1, dpi=300)
    plt.savefig(f1_path2, dpi=300)
    plt.close()
    print(f"Saved F1-Score visualization to {f1_path2}")

    print("Performance Evaluation Complete!")

if __name__ == "__main__":
    evaluate_and_generate_visualizations()
