import os
import joblib
import numpy as np
import pandas as pd

from preprocessing import NetworkDataPreprocessor

class NetworkThreatPredictor:
    def __init__(self, models_dir=None):
        if models_dir is None:
            models_dir = os.path.join(os.path.dirname(__file__), 'saved_models')
            
        preprocessor_path = os.path.join(models_dir, 'preprocessor.joblib')
        classifier_path = os.path.join(models_dir, 'classifier.joblib')
        anomaly_path = os.path.join(models_dir, 'anomaly_detector.joblib')
        
        if not os.path.exists(preprocessor_path):
            raise FileNotFoundError(f"Preprocessor artifact missing at {preprocessor_path}. Run Phase 2 first.")
        if not os.path.exists(classifier_path):
            raise FileNotFoundError(f"Classifier artifact missing at {classifier_path}. Run Phase 3 first.")
        if not os.path.exists(anomaly_path):
            raise FileNotFoundError(f"Anomaly detector artifact missing at {anomaly_path}. Run Phase 4 first.")
            
        self.preprocessor = NetworkDataPreprocessor.load(preprocessor_path)
        self.classifier = joblib.load(classifier_path)
        self.anomaly_detector = joblib.load(anomaly_path)

    def predict_network_traffic(self, input_data: dict) -> dict:
        """
        Unified prediction & threat profiling pipeline for NSL-KDD dataset.
        """
        # 1 & 2. Transform input using fitted preprocessor
        X_sample = self.preprocessor.transform_single(input_data)
        
        # 3. Supervised Classification
        class_pred_idx = self.classifier.predict(X_sample)[0]
        prediction_label = str(self.preprocessor.decode_target([class_pred_idx])[0])
        
        # 4. Classification Confidence
        if hasattr(self.classifier, "predict_proba"):
            probabilities = self.classifier.predict_proba(X_sample)[0]
            confidence = float(np.max(probabilities))
        else:
            confidence = 1.0

        # 5. Unsupervised Isolation Forest Anomaly Detection (-1 = Anomaly, 1 = Normal)
        raw_anomaly = self.anomaly_detector.predict(X_sample)[0]
        is_anomaly = bool(raw_anomaly == -1)
        anomaly_score = float(self.anomaly_detector.decision_function(X_sample)[0])

        # 6. Risk Level & Threat Profiler Engine
        risk_level, explanation, threat_profile = self._generate_threat_profile(
            input_data, prediction_label, confidence, is_anomaly, anomaly_score
        )

        # 7. Return structured result
        return {
            "prediction": prediction_label,
            "confidence": round(confidence, 4),
            "anomaly": is_anomaly,
            "anomaly_score": round(anomaly_score, 4),
            "risk_level": risk_level,
            "explanation": explanation,
            "threat_profile": threat_profile
        }

    def _generate_threat_profile(self, input_data: dict, prediction: str, confidence: float, is_anomaly: bool, anomaly_score: float):
        """Generates comprehensive threat profile metrics and SOC response actions."""
        protocol = str(input_data.get('protocol_type', 'tcp')).upper()
        service = str(input_data.get('service', 'http')).upper()
        flag = str(input_data.get('flag', 'SF'))

        if prediction in ["DoS", "U2R"]:
            if is_anomaly:
                risk = "CRITICAL"
                explanation = f"CRITICAL: High-volume {prediction} attack vector with anomalous statistical deviation."
                action = "BLOCK_SOURCE_IP & ISOLATE_SUBNET"
            else:
                risk = "HIGH"
                explanation = f"HIGH: Traffic matches known {prediction} attack signature ({flag} flag pattern)."
                action = "APPLY_FIREWALL_RATE_LIMIT"
        elif prediction in ["Probe", "R2L"]:
            if is_anomaly:
                risk = "HIGH"
                explanation = f"HIGH: Reconnaissance {prediction} activity with anomalous port scanning behavior."
                action = "QUARANTINE_PORT & LOG_PACKETS"
            else:
                risk = "MEDIUM"
                explanation = f"MEDIUM: Traffic exhibits {prediction} scanning characteristics."
                action = "ENABLE_DEEP_PACKET_INSPECTION"
        else:  # Normal prediction
            if is_anomaly:
                risk = "HIGH"
                explanation = "POTENTIAL ZERO-DAY ANOMALY: Classified as Normal signature but exhibits strong behavioral anomaly deviation. Requires analyst triage."
                action = "FLAG_FOR_ZERO_DAY_ANALYSIS"
            else:
                risk = "LOW"
                explanation = "NORMAL: Network flow is within baseline operational parameters."
                action = "ALLOW_BASELINE_PASS"

        threat_profile = {
            "attack_vector": f"{protocol}/{service} ({flag})",
            "recommended_action": action,
            "behavioral_deviation": f"{abs(anomaly_score) * 100:.1f}%",
            "threat_type": "Zero-Day Anomaly" if (prediction == "Normal" and is_anomaly) else (f"Known {prediction} Signature" if prediction != "Normal" else "Normal Flow")
        }

        return risk, explanation, threat_profile

# Global singleton instance
_predictor_instance = None

def get_predictor():
    global _predictor_instance
    if _predictor_instance is None:
        _predictor_instance = NetworkThreatPredictor()
    return _predictor_instance

def predict_network_traffic(input_data: dict) -> dict:
    predictor = get_predictor()
    return predictor.predict_network_traffic(input_data)

if __name__ == "__main__":
    print("=== TESTING CYBERSECURITY NETWORK THREAT & INTRUSION PROFILER PIPELINE ===")
    test_sample = {
        "duration": 0, "protocol_type": "tcp", "service": "private", "flag": "S0",
        "src_bytes": 0, "dst_bytes": 0, "count": 300, "srv_count": 300, "serror_rate": 1.0
    }
    res = predict_network_traffic(test_sample)
    print(res)
