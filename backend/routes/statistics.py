from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import func, case

from database import get_db
from models import PredictionLog, AlertLog
from schemas import SystemStatsResponse, AlertResponse

router = APIRouter(prefix="/statistics", tags=["Statistics"])

@router.get("", response_model=SystemStatsResponse)
def get_system_statistics(db: Session = Depends(get_db)):
    total_traffic = db.query(PredictionLog).count()
    normal_traffic = db.query(PredictionLog).filter(PredictionLog.prediction == "Normal").count()
    attacks_detected = db.query(PredictionLog).filter(PredictionLog.prediction != "Normal").count()
    anomalies_detected = db.query(PredictionLog).filter(PredictionLog.anomaly == True).count()

    # Attack Category Distribution
    attack_counts = (
        db.query(PredictionLog.prediction, func.count(PredictionLog.id))
        .group_by(PredictionLog.prediction)
        .all()
    )
    dist_dict = {cat: count for cat, count in attack_counts}
    for default_cat in ["Normal", "DoS", "Probe", "R2L", "U2R"]:
        if default_cat not in dist_dict:
            dist_dict[default_cat] = 0

    # Recent active alerts
    recent_alerts_db = db.query(AlertLog).order_by(AlertLog.timestamp.desc()).limit(10).all()
    recent_alerts = [AlertResponse.model_validate(alert) for alert in recent_alerts_db]

    return SystemStatsResponse(
        total_traffic=total_traffic,
        normal_traffic=normal_traffic,
        attacks_detected=attacks_detected,
        anomalies_detected=anomalies_detected,
        attack_distribution=dist_dict,
        system_status={
            "ml_model": "Active (Random Forest)",
            "anomaly_detector": "Active (Isolation Forest)",
            "api": "Connected",
            "database": "Connected (SQLite)"
        },
        recent_alerts=recent_alerts
    )
