import os
import sys

# Ensure ml directory is in python path
ROOT_DIR = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
ML_DIR = os.path.join(ROOT_DIR, 'ml')
if ML_DIR not in sys.path:
    sys.path.insert(0, ML_DIR)

try:
    from predict import predict_network_traffic
except ImportError as e:
    raise RuntimeError(f"Failed to import ML prediction pipeline: {e}")

def run_ml_inference(payload_dict: dict) -> dict:
    """Invokes the unified ML pipeline."""
    return predict_network_traffic(payload_dict)
