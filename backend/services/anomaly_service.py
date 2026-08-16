"""
Anomaly Service helper for anomaly score classification & alert triggers.
"""

def evaluate_threat_severity(prediction: str, is_anomaly: bool, confidence: float) -> str:
    """Helper service to compute alert severity level."""
    if prediction in ["DoS", "U2R"]:
        return "CRITICAL" if is_anomaly else "HIGH"
    elif prediction in ["Probe", "R2L"]:
        return "HIGH" if is_anomaly else "MEDIUM"
    elif is_anomaly:
        return "HIGH"
    return "LOW"
