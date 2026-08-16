from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List

from database import get_db
from models import PredictionLog, AlertLog
from schemas import TrafficAnalysisRequest, PredictionResponse
from services.ml_service import run_ml_inference

router = APIRouter(prefix="/predict", tags=["Prediction"])

@router.post("", response_model=PredictionResponse)
def analyze_traffic(payload: TrafficAnalysisRequest, db: Session = Depends(get_db)):
    try:
        data_dict = payload.model_dump()
        result = run_ml_inference(data_dict)

        # Log prediction to database
        db_log = PredictionLog(
            prediction=result["prediction"],
            confidence=result["confidence"],
            anomaly=result["anomaly"],
            anomaly_score=result["anomaly_score"],
            risk_level=result["risk_level"],
            explanation=result["explanation"],
            protocol_type=payload.protocol_type,
            service=payload.service,
            src_bytes=payload.src_bytes,
            dst_bytes=payload.dst_bytes
        )
        db.add(db_log)
        db.commit()
        db.refresh(db_log)

        # Trigger automatic alert if threat or anomaly is detected
        if result["risk_level"] in ["CRITICAL", "HIGH", "MEDIUM"]:
            alert_type = (
                "Suspected Zero-Day Threat"
                if (result["prediction"] == "Normal" and result["anomaly"])
                else result["prediction"]
            )
            alert = AlertLog(
                attack_type=alert_type,
                severity=result["risk_level"],
                message=result["explanation"],
                status="Active"
            )
            db.add(alert)
            db.commit()

        return PredictionResponse(
            id=db_log.id,
            prediction=result["prediction"],
            confidence=result["confidence"],
            anomaly=result["anomaly"],
            anomaly_score=result["anomaly_score"],
            risk_level=result["risk_level"],
            explanation=result["explanation"],
            timestamp=db_log.timestamp
        )

    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error processing threat analysis: {str(e)}"
        )

@router.post("/batch", response_model=List[PredictionResponse])
def batch_analyze_traffic(payloads: List[TrafficAnalysisRequest], db: Session = Depends(get_db)):
    results = []
    for item in payloads:
        res = analyze_traffic(item, db)
        results.append(res)
    return results

@router.get("/history", response_model=List[PredictionResponse])
def get_prediction_history(limit: int = 50, db: Session = Depends(get_db)):
    logs = db.query(PredictionLog).order_by(PredictionLog.timestamp.desc()).limit(limit).all()
    return logs

@router.delete("/history")
def clear_prediction_history(db: Session = Depends(get_db)):
    db.query(PredictionLog).delete()
    db.query(AlertLog).delete()
    db.commit()
    return {"message": "All threat logs and alerts cleared successfully."}
