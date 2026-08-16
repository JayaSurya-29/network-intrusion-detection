from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List

from database import get_db
from models import AlertLog
from schemas import AlertResponse

router = APIRouter(prefix="/alerts", tags=["Alerts"])

@router.get("", response_model=List[AlertResponse])
def get_alerts(status_filter: str = None, limit: int = 50, db: Session = Depends(get_db)):
    query = db.query(AlertLog)
    if status_filter:
        query = query.filter(AlertLog.status == status_filter)
    alerts = query.order_by(AlertLog.timestamp.desc()).limit(limit).all()
    return alerts

@router.patch("/{alert_id}/resolve", response_model=AlertResponse)
def resolve_alert(alert_id: int, db: Session = Depends(get_db)):
    alert = db.query(AlertLog).filter(AlertLog.id == alert_id).first()
    if not alert:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Alert with ID {alert_id} not found."
        )
    alert.status = "Resolved"
    db.commit()
    db.refresh(alert)
    return alert
